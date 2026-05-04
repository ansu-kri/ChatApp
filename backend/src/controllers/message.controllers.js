const Message = require("../models/Message");
const Channel = require("../models/Channel");
const User = require("../models/User");
const { getIO } = require("../lib/socket");
const { uploadToCloudinary } = require("../lib/cloudinary");


const MESSAGES_TTL = 60, // 1min cache for message pages

//Helper: cache key for channel messages page
const msgCacheKey = (channelID, page, limit) => `message:channel:${channelId}:p${page}:${limit}`;

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