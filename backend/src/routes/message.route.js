const express = require("express");
const router = express.Router();

const messageController = require("../controllers/message.controllers");
const { protectRoute } = require("../middleware/auth.middleware");
const { messageLimiter } = require("../middleware/ratelimit.middleware");
const upload = require("../middleware/upload.middleware");

// Channel messages
router.get(
  "/channel/:channelId",
  protectRoute,
  messageController.getChannelMessages
);

router.post(
  "/channel/:channelId",
  protectRoute,
  messageLimiter,
  upload.single("file"),
  messageController.sendChannelMessage
);

// DM messages
router.get(
  "/dm/:userId",
  protectRoute,
  messageController.getDMMessages
);

router.post(
  "/dm/:userId",
  protectRoute,
  messageLimiter,
  upload.single("file"),
  messageController.sendDMMessage
);

module.exports = router;