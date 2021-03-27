import { withFilter } from "graphql-subscriptions";
import client from "../../client";
import { NEW_MESSAGE } from "../../constant";
import pubsub from "../../pubsub";

export default {
    Subscription : {
        roomUpdates : {
            subscribe : async(root, args, context, info) => {
                console.log(context);
                const room = await client.room.findFirst({
                    where : {
                        id:args.id,
                        users : {
                            some : {
                                id : context.loggedInUser.id
                            }
                        }
                    },
                    select  :{
                        id : true
                    }
                });

                if(!room) {
                    throw new Error ("You shall not see this.");
                }
                return withFilter(() => pubsub.asyncIterator(NEW_MESSAGE),
                async ({roomUpdates}, {id}, {loggedInUser}) => {
                    
                    if(roomUpdates.roomId === id) {
                        const room = await client.room.findFirst({
                            where : {
                                id:args.id,
                                users : {
                                    some : {
                                        id : context.loggedInUser.id
                                    }
                                }
                            },
                            select  :{
                                id : true
                            }
                        });
                        if(!room) {
                            return false;
                        }
                        return true;
                    }
                }
            )(root, args, context, info);
            }
        }
    }
}