import apiClient from "../api/api-client";

export const chatService = {
  // Initialize chat conversation
  initializeChat: async ({
    roomId = null,
    guestName = null,
    guestEmail = null,
  }) => {
    const response = await apiClient.post("/chat/init", {
      guestName,
      guestEmail,
      roomId,
    });
    return response.data;
  },

  // Get conversations
  getConversations: async ({ pageNo, pageSize, search, sortBy, status }) => {
    const response = await apiClient.get(
      `/chat/admin/conversations?pageNo=${pageNo}&pageSize=${pageSize}&search=${search}&sortBy=${sortBy}&status=${status}`
    );
    return response.data;
  },

  // Get conversation messages
  getMessages: async ({ sessionId, pageNo = 0, pageSize = 20 }) => {
    const response = await apiClient.get(`/chat/${sessionId}/messages`, {
      params: { pageNo, pageSize },
    });
    return response.data;
  },

  // Mark messages as read
  markMessagesAsRead: async (sessionId) => {
    await apiClient.post(`/chat/${sessionId}/read`);
  },
};
