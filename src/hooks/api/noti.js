import AxiosInstance from "services/AxiosInstance";
import { Model, NotiModel } from "./Model";

export const getNotiByUser =async (page) => {
    try {
        const resault = await AxiosInstance().get(
            `${Model.NOTI}/${NotiModel.GETNOTIBYEUSER}?page=${page}`,
          );
          return resault;
    } catch (error) {
        return { status: false, data: 'Opps ! Have a problem' };
    }
}