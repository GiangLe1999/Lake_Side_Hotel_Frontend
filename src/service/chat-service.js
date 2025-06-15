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

  // Get conversation messages
  getMessages: async (conversationId, page = 0, size = 50) => {
    const response = await apiClient.get(
      `/api/chat/${conversationId}/messages`,
      {
        params: { page, size },
      }
    );
    return response.data;
  },

  // Mark messages as read
  markMessagesAsRead: async (sessionId) => {
    await apiClient.post(`/api/chat/${sessionId}/read`);
  },
};
