import AxiosInstance from 'services/AxiosInstance';
import {MESSAGE, Model} from './Model';

export async function getFriend(userId) {
  try {
    const resault = await AxiosInstance().get(
      `${Model.MESSAGE}/${MESSAGE.GETFRIEND}?userId=${userId}`,
    );
    if (resault.status) {
      return {status: true, data: resault.data};
    } else {
      return {status: false, data: resault.data};
    }
  } catch (error) {
    return { status: false, data: 'Opps ! Have a problem' };
  }
}

export async function getOldMessage(idmessage, user, friend) {
  try {
    const result = await AxiosInstance().get(
      `${Model.MESSAGE}/${MESSAGE.GETOLDMESSAGE}?idmessage=${idmessage}&user=${user}&friend=${friend}`,
    );
    if (result.status) {
      return {status: true, data: result.data};
    } else {
      return {status: false, data: result.data};
    }
  } catch (error) {
    console.log(error);
    return { status: false, data: 'Opps ! Have a problem' };
  }
}

export const getListFriendMessage = async (userId, page) => {
  try {
    const result = await AxiosInstance().get(
      `${Model.MESSAGE}/${MESSAGE.GETLISTMESSAGE}?userId=${userId}&page=${page}`,
    );
    if (result.status) {
      return {status: true, data: result.data};
    } else {
      return {status: false, data: result.data};
    }
  } catch (error) {
    console.log(error);
    return { status: false, data: 'Opps ! Have a problem' };
  }
};

export const seenMessage = async (userId, friendId) => {
  try {
    const body = {
      userId: userId,
      friendId: friendId,
    };

    const result = await AxiosInstance().post(
      `${Model.MESSAGE}/${MESSAGE.SEENMESSAGE}`,
      body,
    );
    if (result.status) {
      return {status: true, data: result.data};
    } else {
      return {status: false, data: result.data};
    }
  } catch (error) {
    console.log(error);
    return { status: false, data: 'Opps ! Have a problem' };
  }
};
