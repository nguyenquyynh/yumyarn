export const Model = {
    USERS: "users",
    ADMINS: "admins",
    COMMENTS: "comment",
    FIRES: "fires",
    FOLLOWS: "follows",
    HASHTAGS: "hashtags",
    NOTIFIES: "notifies",
    POSTS: "posts",
    REQUESTS: "requests",
    SUGGEST: 'searchsuggest'
}

export const USERS = {
    AUTHEN: "authen",
    VERIFY: "verify",
    SEARCH: "search",
}

export const COMMENT = {
    CREATE: "create",
    GET:"get",
    GET_RECOMMENT:"get_recomment",
}

export const USERS_AUTHEN= {
    REGISTER: "REGISTER",
    LOGIN: "LOGIN",
    VERIFY: "VERIFY",
    ERROR: "ERROR",
}

export const POST = {
    CREATEPOST: "create",
    SEARCH: "search",
    FEED:"feed",
    WATCH: "watch",
}

export const SUGGEST = {
    ADD: 'add',
    SUGGEST: 'suggest'
}
export const PROFILE = {
    CHECKFOLLOWER: "checkfollowerprofile",
    COUNTFOLLOWER: "countfollower",
    FINDUSER: "finduser",
    FOLLOWER: "follow",
    UNFOLLOW: "unfollow",
    POST: "getidpost",
    AVATAR: "avatar",
    COVERPHOTO: "coverphoto",
}

export const FOLLOW = {
    CHECK: 'check',
    UNFOLLOW: 'unfollow',
    FOLLOW: 'follow'
}

export const FIRE = {
    CREATE: 'create',
    DELETE: 'delete',
}