import {StreamChat} from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Stream API or Secret is missing!");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

//create or update user
export const upsertStreamUser = async function(userData){
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upserting stream user: ", error);
    }
}

export const generateStreamToken = async function (userId) {
    try{
        // ensure userId is a string
        const userIdStr = userId.toString();
        const chatToken = streamClient.createToken(userIdStr);
        return {chatToken: chatToken};
    }catch(err){
        console.log("Error generating Stream token: ", err);
    }
}