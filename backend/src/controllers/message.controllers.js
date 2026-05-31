const Message = require("../models/Message");
const Channel = require("../models/Channel");
const User = require("../models/User");
const { getIO } = require("../lib/socket");
const { uploadToCloudinary } = require("../lib/cloudinary");
const { asyncHandler } = require("../lib/errors");


const MESSAGES_TTL = 60; // 1min cache for message pages

//Helper: cache key for channel messages page
const msgCacheKey = (channelId, page, limit) => `message:channel:${channelId}:p${page}:${limit}`;

//-------Get channel Messages------------
exports.getChannelMessages = asyncHandler(async (req,res) => {
    const {channelId} = req.params;
    const {page=1, limit =50} = req.query;

    const channel = await Channel.findById(channelId).lean();
    if(!channel) throw AppError.notFound("Channel");

    const isMember = channel.members.some((m) => m.user.toString() === req.user._id.toString());
    if(!isMember && channel.type !== "public")
        throw AppError.forbidden("You are not a member of this channel");
    //only cache page 1 (latest messages) - historical pages cached too 
    const cacheKey = msgCacheKey(channelId, page, limit);
    const cached = await redis.get(cacheKey);
    if(cached) {
        res.setHeader("X-Cache","HIT");
        return res.json(cached);
    }
    const skip =(page-1)*limit;
    const [message,total] = await Promise.all([
        Message.find({ channel: channelId, isDeleted: false })
        .sort({createdAt: -1})
        .skip(skip)
        .limit(parseInt(limit))
        .populate("sender", "fullname profilePic role")
        .populate("replyTo","content sender")
        .lean(),
        Message.countDocuments({ channel: channelId, isDeleted: false }),
    ]);

    const payload = {
        messages: message.reverse(),
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total/limit),
        },
    };

    await redis.set(cacheKey, payload, MESSAGES_TTL);
    res.json(payload);
});

//-----------Get DM MEssage-------------

exports.getDMMessages = asyncHandler(async (req, res) => {
    const {userId} = req.param;
    const { page = 1, limit = 50 } = req.query;

    const receiver = await User.findById(userId).lean();
    if(!receiver) throw AppError.notFound("User");

    const skip = (page-1) * limit;

    //Build deterministic Dm Key (sorted user Ids)
    const dmkey = [req.user._id.toString(), userId].sort().join(":");
    const cacheKey= `messages:dm:${dmKey}:p${page}:l${limit}`;

    const cached = await redis.get(cacheKey);
     if (cached) {
    res.setHeader("X-Cache", "HIT");
    return res.json(cached);
  }

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("sender", "fullName profilePic role")
    .lean();
 
  const payload = { messages: messages.reverse() };
  await redis.set(cacheKey, payload, MESSAGES_TTL);
  res.json(payload);
})

//----------send Channel Message------------

exports.sendChannelMessage = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const { content, replyTo } = req.body;
    const io = getIO();

    if(!content?.trim() && !re.file)
        throw AppError.badRequest("Message content or file is required");

    let fileData = {};
    if(req.file) {
        const result = await uploadToCloudinary(req.file.buffer, { folder: "orgchat/files" });
        fileData = {
            type: req.file.mimetype.startsWith("image/") ? "image" : "file",
            fileUrl: result.secure_url,
            filePublicId: result.public_id,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
        };
    }

    const message = await Message.create({
        sender: req.user._id,
        channel: channelId,
        content: content?.trim() || "",
        replyTo: replyTo || null,
        ...fileData,
    });

    //update channel metadata and bust caches in parallel
    await Promise.all([
        Channel.findByIdAndUpdate(channelId, {
            lastMessage: message._id,
            lastActivity: new Date(),
        }),
        redis.delPattern(`messages:channel:${channelId}:*`),
        redis.delPattern(`channels:user:*`),
    ]);

    const populated = await message.populate("sender","fullname profilePic role");

    io.to(channelId).emit("newMessage", Message.populated);
    res.status(201).json(populated);
});

//--------------send DM-----------------
exports.sendDMMessage = asyncHandler(async (req,res) => {
    const { userId } = req.params;
    const { content } = req.body;
    const io = getIO();

    const receiver = await User.findById(userId);
    if(!receiver) throw AppError.notFound("User");
    if(!content?.trim() && !req.file)
        throw AppError.badRequest("Message content or file is required");

    let fileData = {}
    if(req.file) {
        const result = await uploadToCloudinary(req.file.buffer, { folder: "orgchat/files" });
        fileData = {
            type: req.file.mimetype.startsWith("image/") ? "image" : "file",
            fileUrl: result.secure_url,
            filePublicId: result.public_id,
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
        };
    }

    const message = await Message.create({
        sender: req.user._id,
        receiver: userId,
        content: content?.trim() || "",
        ...fileData,
    })

    const dmKey = [req.user._id.toString(), userId].sort().join(":");
    await redis.delPattern(`message:dm:${dmKey}:*`);

    const populated = await message.populate("sender", "fullname profilePic");

    //Deliver to receiver's personal room
    io.to(userId).emit("newDM", populated);
    io.to(req.user._id.toString()).emit("newDM", populated);

    res.status(201).json(populated);
})

//---------Edit Message--------------