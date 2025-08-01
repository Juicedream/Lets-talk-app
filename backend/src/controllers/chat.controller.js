import { requestResponse, response, userError } from "../lib/utils.js";
import { getStreamTokenService } from "../services/chat.service.js";

export async function getStreamToken(req, res){
    try {
        try {
           const {token}=  await getStreamTokenService(req);
           return requestResponse(res, 200, "Chat Token Generated!", token);
        } catch (error) {
            console.log(
              "Error in get stream token service: ",
              error.message
            );
            return response(res, 500, userError.internalServer);
        }
    } catch (error) {
         console.log("Error in get stream token controller: ", error.message);
        return response(res, 500, userError.internalServer);
    }
}