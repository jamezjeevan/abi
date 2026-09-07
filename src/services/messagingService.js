import { campusStore } from './campusStore';

export const messagingService = {
  async getConversations(userId) {
    return campusStore.getUserConversations(userId);
  },

  async getMessages(conversationId) {
    return campusStore.getConversationMessages(conversationId);
  },

  async sendMessage({ conversationId, senderId, senderName, content }) {
    return campusStore.sendMessage({ conversationId, senderId, senderName, content });
  },

  async startOrGetDirectConversation({ userA, userB, title }) {
    return campusStore.startOrGetDirectConversation({ userA, userB, title });
  }
};
