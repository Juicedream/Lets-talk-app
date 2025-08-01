import {
  requestResponse,
  requestsResponse,
  response,
  userError,
  userResponse,
  usersResponse,
} from "../lib/utils.js";

import {
  acceptedFriendRequestService,
  friendRequestService,
  getFriendRequestsService,
  getMyFriendsService,
  getOutgoingFriendReqsService,
  getRecommendedUsersService,
} from "../services/user.service.js";

const getRecommendedUsers = async (req, res) => {
  // start
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;
    const { recommendedUsers } = await getRecommendedUsersService(
      currentUserId,
      currentUser
    );
    usersResponse(res, 200, "Recommended Users!", recommendedUsers);
  } catch (error) {
    console.log("Error in get recommended users controller: ", error.message);
    return response(res, 500, userError.internalServer);
  }

  // end
};
const getMyFriends = async (req, res) => {
  // start
  try {
    const { friends: userFriends } = await getMyFriendsService(req);
    usersResponse(res, 200, "Your Friends!", userFriends);
  } catch (error) {
    console.log("Error in get my friends controller: ", error.message);
    return response(res, 500, userError.internalServer);
  }
  // end
};

const sendFriendRequest = async (req, res) => {
  // start
  try {
    try {
      const { friendRequest } = await friendRequestService(req);
      return requestResponse(
        res,
        201,
        "Friend request was sent successfully!",
        friendRequest
      );
    } catch (error) {
      if (error.message === "SELF_REQUEST")
        return response(res, 400, userError.selfRequest);
      if (error.message === "RECIPIENT_NOT_FOUND")
        return response(res, 404, userError.recipientNotFound);
      if (error.message === "ALREADY_FRIENDS")
        return response(res, 400, userError.alreadyFriends);
      if (error.message === "REQUEST_EXISTS")
        return response(res, 400, userError.requestExists);

      console.log("Error in friend request service: ", error.message);
      return response(res, 500, userError.internalServer);
    }
  } catch (error) {
    console.log("Error in send friend request controller: ", error.message);
    return response(res, 500, userError.internalServer);
  }
  // end
};

const acceptFriendRequest = async (req, res) => {
  // start
  try {
    try {
      const { message } = await acceptedFriendRequestService(req);
      return response(res, 200, message, true);
    } catch (error) {
      if (error.message === "REQUEST_NOT_FOUND")
        return response(res, 404, userError.requestDoesNotExist);
      if (error.message === "UNAUTHORIZED")
        return response(res, 403, userError.unauthorizedRequest);

      console.log("Error in accept friend request service: ", error.message);
      return response(res, 500, userError.internalServer);
    }
  } catch (error) {
    console.log("Error in accept friend request controller: ", error.message);
    return response(res, 500, userError.internalServer);
  }

  //end
};

const getFriendRequests = async (req, res) => {
  // start
  try {
    try {
      const {incomingReqs, acceptedReqs, message} = await getFriendRequestsService(req);
      return requestsResponse(res, 200, message, incomingReqs, acceptedReqs);
    } catch (error) {
      console.log("Error in get friend request service: ", error.message);
      return response(res, 500, userError.internalServer);
    }
  } catch (error) {
    console.log("Error in get friend request controller: ", error.message);
    return response(res, 500, userError.internalServer);
  }
  // end
};

const getOutgoingFriendReqs = async (req, res) => {
  // start

  try {
    try {
     const {message, outgoingFriendRequests} = await getOutgoingFriendReqsService(req);
    //  console.log("Outgoing Friend Requests: ", outgoingFriendRequests);
     return requestResponse(res, 200, message, outgoingFriendRequests);
    } catch (error) {
      console.log("Error in get outgoing friend request service: ", error.message);
      return response(res, 500, userError.internalServer);
    }
  } catch (error) {
    console.log("Error in get outgoing friend request controller: ", error.message);
    return response(res, 500, userError.internalServer);
  }


  // end
}

export {
  getRecommendedUsers,
  getMyFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendReqs
};
