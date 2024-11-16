import AxiosInstance from 'services/AxiosInstance';
import {Model, POST, SUGGEST, USERS, FOLLOW} from './Model';

const changeAvatar = async body => {
  try {
    const result = await AxiosInstance().post(
      `${Model.USERS}/${USERS.AVATAR}`,
      body,
    );
    if (result.status) {
      return {status: true, data: result.data};
    } else {
      return {status: false, data: result.data};
    }
  } catch (error) {
    console.log(error + 'Lỗi getPost');
    return { status: false, data: 'Opps ! Have a problem' };
  }
};
const changeCoverPhoto = async body => {
  try {
    const result = await AxiosInstance().post(
      `${Model.USERS}/${USERS.COVERPHOTO}`,
      body,
    );
    if (result.status) {
      return {status: true, data: result.data};
    } else {
      return {status: false, data: result.data};
    }
  } catch (error) {
    console.log(error + 'Lỗi getPost');
    return { status: false, data: 'Opps ! Have a problem' };
  }
};

const updateInfor = async body => {
  try {
    const result = await AxiosInstance().post(
      `${Model.USERS}/${USERS.UPDATE_INFOR}`,
      body,
    );
    if (result.status) {
      return {status: true, data: result.data};
    } else {
      return {status: false, data: result.data};
    }
  } catch (error) {
    console.log(error + 'Lỗi updateInfor');
    return { status: false, data: 'Opps ! Have a problem' };
  }
};

const countFollower = async _id => {
  try {
    const result = await AxiosInstance().post(
      `${Model.USERS}/${USERS.COUNTFOLLOWER}?_id=${_id}`,
    );
    if (result.status) {
      return {status: true, data: result.data};
    } else {
      return {status: false, data: result.data};
    }
  } catch (error) {
    console.log(error + 'Lỗi');
    return { status: false, data: 'Opps ! Have a problem' };
  }
};
const getTimeline = async body => {
  try {
    const result = await AxiosInstance().get(
      `${Model.POSTS}/${POST.TIMELINE}?u=${body.user}&page=${body.page}`,
    );
    if (result.status) {
      return {status: true, data: result.data};
    } else {
      return {status: false, data: result.data};
    }
  } catch (error) {
    console.log(error + 'Lỗi getPost');
    return { status: false, data: 'Opps ! Have a problem' };
  }
};

const findUser = async query => {
  try {
    const result = await AxiosInstance().post(
      `${Model.USERS}/${USERS.FIND_USER}?_id=${query._id}`,
    );
    if (result.status) {
      return {status: true, data: result.data};
    } else {
      return {status: false, data: result.data};
    }
  } catch (error) {
    console.log(error + 'Lỗi getPost');
    return { status: false, data: 'Opps ! Have a problem' };
  }
};

const logout = async _id => {
  try {
    const result = await AxiosInstance().delete(
      `${Model.USERS}/${USERS.LOGOUT_USER}?_id=${_id}`,
    );
    if (result.status) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.log(error + 'Lỗi logout');
    return { status: false, data: 'Opps ! Have a problem' };
  }
};

const messageSetting = async (body) => {
  try {
    const result = await AxiosInstance().put(
      `${Model.USERS}/${USERS.UPDATEMESSAGE}`,
      body
    );
    if (result.status) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.log(error + 'L��i getPost');
    return { status: false, data: 'Opps! Have a problem' };
  }
}
const updateAutoMess = async (body) => {
  try {
    const result = await AxiosInstance().post(
      `${Model.USERS}/${USERS.AUTO_MESS}`,
      body
    );
    if (result.status) {
      return result;
    } else {
      return result;
    }
  } catch (error) {
    console.log(error + 'Lỗi updateAutoMess');
    return { status: false, data: 'Opps! Have a problem' };
  }
}

export {
  findUser,
  updateInfor,
  changeAvatar,
  changeCoverPhoto,
  countFollower,
  getTimeline,
  logout,
  messageSetting,
  updateAutoMess
};
