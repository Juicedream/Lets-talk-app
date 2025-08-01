import { generateStreamToken } from "../lib/stream.js";

export async function getStreamTokenService(req){
    const { chatToken } = await generateStreamToken(req.user.id);
    return { token: chatToken };
}