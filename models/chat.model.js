const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    userId: String,
    // roomChatId: String,
    content: String,
    images: Array,
    deleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
)
const Chat = mongoose.model('Chat', schema, 'chats');

module.exports = Chat;
