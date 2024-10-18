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
    return Promise.reject(error);
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
    return Promise.reject(error);
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
    return Promise.reject(error);
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
    return Promise.reject(error);
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
    return Promise.reject(error);
  }
};

const finduser = async query => {
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
    return Promise.reject(error);
  }
};

const logout = async _id => {
  try {
    const result = await AxiosInstance().delete(
      `${Model.USERS}/${USERS.LOGOUT_USER}?_id=${_id}`,
    );
    if (result.status) {
      return {status: true, data: result.data};
    } else {
      return {status: false, data: result.data};
    }
  } catch (error) {
    console.log(error + 'Lỗi logout');
    return Promise.reject(error);
  }
};

export {
  finduser,
  updateInfor,
  changeAvatar,
  changeCoverPhoto,
  countFollower,
  getTimeline,
  logout
};
