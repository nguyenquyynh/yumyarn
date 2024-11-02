export const Model = {
  USERS: 'users',
  ADMINS: 'admins',
  COMMENTS: 'comment',
  FIRES: 'fires',
  FOLLOWS: 'follows',
  HASHTAGS: 'hashtags',
  NOTIFIES: 'notifies',
  POSTS: 'posts',
  REQUESTS: 'requests',
  SUGGEST: 'searchsuggest',
  ADVERTISEMENT: 'advs',
  COSTADVERTISEMENT: 'costadvs',
  SAVED: 's',
  MESSAGE: 'message',
  REPORT: 'reports',
  NOTI:'noti',
};

export const USERS = {
  AUTHEN: 'authen',
  VERIFY: 'verify',
  SEARCH: 'search',
  CHECKAUTHEN: 'checkauthen',
  COUNTFOLLOWER: 'countfollower',
  FINDUSER: 'finduser',
  FOLLOWER: 'follow',
  POST: 'getidpost',
  AVATAR: 'avatar',
  COVERPHOTO: 'coverphoto',
  UPDATE_INFOR: 'updateInfor',
  FIND_USER: 'finduser',
  LOGOUT_USER: 'logout',
  UPDATEMESSAGE: 'updateMessage',
};

export const COMMENT = {
  CREATE: 'create',
  GET: 'get',
  GET_RECOMMENT: 'get_recomment',
};

export const USERS_AUTHEN = {
  REGISTER: 'REGISTER',
  LOGIN: 'LOGIN',
  VERIFY: 'VERIFY',
  ERROR: 'ERROR',
};

export const POST = {
  CREATEPOST: 'create',
  SEARCH: 'search',
  FEED: 'feed',
  WATCH: 'watch',
  TIMELINE: 'timeline',
  EDIT: 'edit',
  REPOST: 're',
  REMOVE: 'de',
};

export const SUGGEST = {
  ADD: 'add',
  SUGGEST: 'suggest',
};

export const FOLLOW = {
    CHECK: 'check',
    UNFOLLOW: 'unfollow',
    FOLLOW: 'follow',
    CHECKFOLLOWER: "checkfollowerprofile",
    GETFOLLOWING: "getfollowing",
    GETFOLLOWERS: "getFollowers",
}

export const FIRE = {
  CREATE: 'create',
  DELETE: 'delete',
};

export const SAVED = {
  CREATE: 'new',
  DELETE: 'delete',
  CHECK_POST: 'check_post'
};

export const MESSAGE = {
  GETOLDMESSAGE: 'getOldMessage',
  GETFRIEND: 'getFriend',
  GETLISTMESSAGE: 'getListMessages',
  SEENMESSAGE: 'seenMessage',
};

export const ReportModel = {
  ALL: 'all',
  REMOVE: 're',
  DETAIL: 'detail',
  WAR: 'Nội dung kích động bạo lực mạng.',
  NFSW: 'Nội dung chứ hình ảnh nhạy cảm 18+',
  KID: 'Bài viết liên quan đển an toàn trẻ dưới vị thành niên.',
  RELIGION: 'Nội dung chia rẽ sắc tộc, tôn giáo.',
  SUCK: 'Bài viết chứa từ ngữ thô tục.',
  FAKE: 'Bài viết chứa nội dung không đúng sự thật'
}

export const NotiModel ={
  GETNOTIBYEUSER:"getNotiByUser",

}