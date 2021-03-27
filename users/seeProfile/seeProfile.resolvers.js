import client from "../../client";

export default {
    Query : {
        seeProfile : (_, {username}, context, info)=> client.user.findUnique({
            where : {
                username
            },
            include : {
                following : true,
                followers : true
            }
        })
    },
}