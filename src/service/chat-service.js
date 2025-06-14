import apiClient from "../api/api-client";

export const chatService = {
  // Initialize chat conversation
  initializeChat: async ({ roomId, guestName, guestEmail }) => {
    const response = await apiClient.post("/chat/init", {
      guestName,
      guestEmail,
      roomId,
    });
    return response.data;
  },

  // Send message
  sendMessage: async ({
    sessioonId,
    content,
    messageType = "TEXT",
    senderName = "",
    file = null,
  }) => {
    const formData = new FormData();
    formData.append("sessioonId", sessioonId);
    formData.append("content", content);
    formData.append("messageType", messageType);

    if (senderName) {
      formData.append("senderName", senderName);
    }

    if (file) {
      formData.append("file", file);
    }

    const response = await apiClient.post("/chat/send", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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
