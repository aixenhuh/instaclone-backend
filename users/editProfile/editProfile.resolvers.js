import {createWriteStream} from "fs";
import bcrypt from "bcrypt";
import client from "../../client";
import {protectedResolver} from "../users.utils";
import { uploadToS3 } from "../../shared/shared.utils";


const resolverFn = async (_, {
    firstName,
    lastName,
    username,
    email,
    password: newsPassword,
    bio,
    avatar
}, {loggedInUser}) => { // token을 자동으로 보내기
   
    let avatarUrl = null;
    if(avatar) {
        avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
        //const {filename, createReadStream} = await avatar;
        //const newFileName = `${loggedInUser.id}-${Date.now()}-${filename}`
        // const readStream = createReadStream();
        // const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFileName);
        // readStream.pipe(writeStream);
        // avatarUrl = `http://localhost:4000/static/${newFileName}`; 
    }

    let uglyPassword = null;
    if (newsPassword) {
        uglyPassword = await bcrypt.hash(newsPassword, 10);
    }

    const updatedUser = await client.user.update({
        where: {
            id: loggedInUser.id
        },
        data: { 
            firstName,
            lastName,
            username,
            email,
            bio,
            avatar,
            ...(uglyPassword && {
                password: uglyPassword
            }),
            ..._(avatarUrl && {avatar: avatarUrl})
        }
    })

    if (updatedUser.id) {
        return {ok: true}
    } else {
        return {ok: false, error: 'could not update profile'}
    }
}

export default {
    Mutation: {
        editProfile: protectedResolver(resolverFn)
    }
}
