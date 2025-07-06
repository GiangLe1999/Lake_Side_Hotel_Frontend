import apiClient from "../api/api-client";

export const addRoom = async (data) => {
  const formData = new FormData();
  for (const key in data) {
    if (key === "images") {
      data.images.forEach((file) => {
        formData.append("images", file);
      });
    } else {
      formData.append(key, data[key]);
    }
  }

  return apiClient.post("/rooms", formData);
};

export const getRoomTypes = async () => {
  return apiClient.get("/rooms/public/types");
};

export const getRoomFilteredByType = async (data) => {
  return apiClient.get(
    `/rooms/public/filtered-by-type?pageNo=${data.pageNo}&pageSize=${data.pageSize}&roomType=${data.type}`
  );
};

export const deleteRoom = async (id) => {
  return apiClient.delete(`/rooms/${id}`);
};

export const getRoomForAdmin = async (id) => {
  return apiClient.get(`/rooms/${id}`);
};

export const editRoom = async ({ id, data }) => {
  const formData = new FormData();
  for (const key in data) {
    if (key === "images") {
      data.images.forEach((file) => {
        formData.append("images", file);
      });
    } else {
      formData.append(key, data[key]);
    }
  }

  return apiClient.put(`/rooms/${id}`, formData);
};

// For client APIs
export const getRoom = async (id) => {
  return apiClient.get(`/rooms/public/${id}`);
};

export const getRoomsForHomepage = async () => {
  try {
    const response = await apiClient.get(`/rooms/public/for-homepage`);
    return response?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getRoomsForFavoritesPage = async (roomsId) => {
  try {
    const roomIdsString = roomsId.join(",");
    const response = await apiClient.get(
      `/rooms/public/for-favorites-page?ids=${roomIdsString}`
    );
    return response?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getRoomFilterCriteria = async () => {
  try {
    const response = await apiClient.get(`/rooms/public/filter-criteria`);
    return response?.data?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getRoomWithAdvancedSearch = async ({
  pageNo = 0,
  pageSize = 6,
  sortBy = "price",
  search = {},
}) => {
  try {
    const params = new URLSearchParams({
      pageNo: pageNo.toString(),
      pageSize: pageSize.toString(),
      sortBy,
      search: "",
    });

    // Add search parameters
    if (Object.keys(search).length > 0) {
      for (const [key, value] of Object.entries(search)) {
        const currentSearch = params.get("search");

        if (!currentSearch) {
          params.set("search", `${key}${value}`);
        } else {
          params.set("search", `${currentSearch},${key}${value}`);
        }
      }
    }

    const response = await apiClient.get(
      `/rooms/public/advanced-search?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms with advanced search:", error);
    throw error;
  }
};
