import { gql } from "apollo-server-core";

export default gql `

    type Mutation {
        createComment(photoId : Int!, payload:String) : MutationResponse!
    }
`