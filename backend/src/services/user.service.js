import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsersService(currentUserId, currentUser) {
    const recommendedUsers = await User.find({
        $and: [
            {_id: {$ne: currentUserId}}, //exclude current user
            {_id: {$nin: currentUser.friends}}, //exclude current user's friends
            {isOnboarded: true}
        ]
    });

    return { recommendedUsers: recommendedUsers };
}

export async function getMyFriendsService(req){
    const user = await User.findById(req.user.id).select("friends").populate("friends", "fullName profilePic nativeLanguage learningLanguage",);

    return {friends: user.friends};
}


export async function friendRequestService(req){
    const myId = req.user.id;
    const {id: recipientId} = req.params;

    // prevent sending request to yourself
    if(myId === recipientId) throw new Error("SELF_REQUEST");

    // //checking if recipient id exists
    const recipient = await User.findById(recipientId);
    if(!recipient) throw new Error("RECIPIENT_NOT_FOUND");


    
    // checking we are already friends
    if(recipient.friends.includes(myId)) throw new Error("ALREADY_FRIENDS");

    // check if a friend request already exists
    const existingRequest = await FriendRequest.findOne({
        $or: [
            {sender: myId, recipient: recipientId},
            {sender: recipientId, recipient: myId},
        ]
    });

    
    if(existingRequest) throw new Error("REQUEST_EXISTS");
    
    // creating a friend request
    const friendRequest = await FriendRequest.create({
        sender: myId,
        recipient: recipientId
    });

    return {friendRequest: friendRequest};
}

export async function acceptedFriendRequestService(req){
    const {id: requestId} = req.params;
     
    const friendRequest = await FriendRequest.findById(requestId);

    if(!friendRequest) throw new Error("REQUEST_NOT_FOUND");

    // verify the current user is the recipient
    if(friendRequest.recipient.toString() !== req.user.id) throw new Error("UNAUTHORIZED");

    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to the others' friend array
    await User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: {friends: friendRequest.recipient}
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
        $addToSet: {friends: friendRequest.sender}
    });
    
    return { message: "Friend request accepted!"};
}

export async function getFriendRequestsService(req){
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
        sender: req.user.id,
        status: "accepted",
    }).populate("recipient", "fullName profilePic");

    return {incomingReqs: incomingReqs, acceptedReqs: acceptedReqs, message: "All incoming and accepted requests!"};

}

export async function getOutgoingFriendReqsService(req){
    
    const outgoingFriendRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage"
    );
    return {message: "Outgoing Friend Requests", outgoingFriendRequests: outgoingFriendRequests}
}