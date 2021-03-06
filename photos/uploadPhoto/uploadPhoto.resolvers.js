import client from "../../client";
import { uploadToS3 } from "../../shared/shared.utils";
import {protectedResolver} from "../../users/users.utils";
import {processHashtags} from "../photos.utils";


export default {
    Mutation : {
        uploadPhoto: protectedResolver(async (_, {file, caption}, {loggedInUser}) => {
            let hashtagObj = [];
            if(caption) {
                //parse caption
                const hashtags = processHashtags(caption);
                //get or create Hashtags

            }
            const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
            return client.photo.create({
                data : {
                    file : fileUrl,
                    caption,
                    user : {
                        connect : {
                            id : loggedInUser.id
                        }
                    },
                    ...(hashtagObj.length > 0 && {
                        hashtags : {
                            connectOrCreate : hashtagObj,
                        }
                    })
                }
            })
            // save the photo with the parsed hashtags
            // add the photo to the hashtags
        })
    }
}