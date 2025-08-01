import { axiosInstance } from "./axios";

// authentication
export const signup = async (signupData) => {
  const res = await axiosInstance.post("/auth/signup", signupData);
  return res.data;
};
export const login = async (loginData) => {
  const res = await axiosInstance.post("/auth/login", loginData);
  return res.data;
};
export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser: ", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

// friends and users
export const getUserFriends = async () => {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
};
export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};
export const getOutgoingFriendsReqs = async () => {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");

  return response.data;
};
export const sendFriendRequest = async (userId) => {
  try {
    const response = await axiosInstance.post(
      `/users/friend-request/${userId}`
    );
    // console.log("Friend request sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
};

export const getFriendRequests = async () => {
  const response = await axiosInstance.get("/users/friend-requests");
  // console.log("Friend requests:", response.data);
  return response.data;
};
export const acceptFriendRequest = async (requestId) => {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  // console.log("accepted requests:", response.data);
  return response.data;
};
export const getStreamToken = async () => {
  const response = await axiosInstance.get(`/chat/token`);
  return response.data;
};
