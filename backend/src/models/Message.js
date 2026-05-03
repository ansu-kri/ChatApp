const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
    emoji:{ type: String, require: true,},
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel",
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        content: {
            type: String,
            default: "",
            maxlength: [400, "Message cannot exceed 4000 characters"],
        },
        type: {
            type: String,
            enum: ["text", "image", "file", "system"],
            default: "text",
        },
        fileUrl: {
            type: String,
            default: "",
        },
        filePublicId: {
            type: String,
            default: "",
        },
        fileName: {
            type: String,
            default: "",
        },
        fileType: {
            type: String,
            default: "",
        },
        reactions: [reactionSchema],
        replyTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        isEdited: {
            type: Boolean,
            default: false,
        },
        editedAt: {
            type: Date,
        },
        idDeleted: {
            type: Boolean,
            default: false,
        },
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    { timestamps: true }
);

//Index for faster queries
messageSchema.index({ channel: 1, createdAt: -1});
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1});

module.exports = mongoose.model("Message", messageSchema);