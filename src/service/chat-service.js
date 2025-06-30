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

  markConversationAsRead: async (sessionId) => {
    await apiClient.put(`/chat/admin/${sessionId}/read`);
  },

  toggleConversationStatus: async ({ sessionId, status }) => {
    const response = await apiClient.put(
      `/chat/admin/${sessionId}/status?status=${status}`
    );
    return response.data;
  },

  // Get conversation messages
  getMessages: async ({ sessionId, pageNo = 0, pageSize = 20 }) => {
    try {
      const response = await apiClient.get(`/chat/${sessionId}/messages`, {
        params: { pageNo, pageSize },
      });

      return response.data;
    } catch (error) {
      if (
        error?.data?.status === 404 &&
        error?.data?.message == "Chat conversation not found"
      ) {
        return "Chat conversation not found";
      }
    }
  },

  deleteConversation: async (sessionId) => {
    const response = await apiClient.delete(`/chat/admin/${sessionId}/delete`);
    return response.data;
  },
};
