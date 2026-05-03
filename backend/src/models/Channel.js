const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: [true, "Channel name is required"],
            trim: true,
            lowercase: true,
            minlength: [2, "Channel name must be at least 2 characters"],
            maxlength: [50, "Channel name cannot exceed 50 characters"],
        },
        description: {
            type: String,
            maxlength: 200,
            default: "",
        },
        type: {
            type: String,
            enum: ["public", "private", "direct"],
            default: "public",
        },
        createdBy: {
            type: mongooe.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
                role: { 
                    type: String,
                    enum: ["member", "moderator", "admin"],
                    default: "member",
                },
                joinedAt: { type: Date, default: Date.now },
            },
        ],
        avatar: {
            type: String,
            default: "",
        },
        isArchived: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        lastActivity: {
            type: Date,
            defautl: Date.now,
        },
        pinnedMessages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
            },
        ],
    },
    { timestamps: true }
);

channelSchema.index({ name: 1 });
channelSchema.index({ "members.user": 1 });

module.exports = mongoose.Schema("Channel", channelSchema);