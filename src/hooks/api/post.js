import AxiosInstance from 'services/AxiosInstance';
import { Model, POST, ReportModel, SAVED } from './Model';
import { isTokenExpired } from './auth';

export async function createpost(data) {
  try {
    const resault = await AxiosInstance().post(
      `${Model.POSTS}/${POST.CREATEPOST}`,
      data,
    );

    // Kiểm tra lỗi trong then của Promise
    if (resault.status) {
      return { status: true, data: resault.data };
    } else {
      return { status: false, data: resault.data };
    }
  } catch (error) {
    console.log(error + 'Lỗi');
    return { status: false, data: 'Opps ! Have a problem' };
  }
}
export async function editmypost(data) {
  console.log(data);

  try {
    const resault = await AxiosInstance().put(
      `${Model.POSTS}/${POST.EDIT}`,
      data,
    );

    if (resault.status) {
      return { status: true, data: resault.data };
    } else {
      return { status: false, data: resault.data };
    }
  } catch (error) {
    console.log(error + 'Lỗi');
    return { status: false, data: 'Opps ! Have a problem' };
  }
}
export async function getPost(dataRequest) {
  try {
    const resault = await AxiosInstance().get(
      `${Model.POSTS}/${POST.FEED}?create_by=${dataRequest.id}&page=${dataRequest.page}`,
    );

    if (resault.status) {
      return { status: true, data: resault.data };
    } else {
      return { status: false, data: resault.data };
    }
  } catch (error) {
    console.log(error + 'Lỗi');
    return { status: false, data: 'Opps ! Have a problem' };
  }
}

export async function watchPost(dataRequest) {
  try {
    const resault = await AxiosInstance().get(
      `${Model.POSTS}/${POST.WATCH}?u=${dataRequest.u}&p=${dataRequest.p}`,
    );
    if (resault.status) {
      return { status: true, data: resault.data };
    } else {
      return { status: false, data: resault.data };
    }
  } catch (error) {
    console.log(error + 'Lỗi');
    return { status: false, data: 'Opps ! Have a problem' };
  }
}

export async function getTimeOutAdvertisement(dataRequest) {
  try {
    const resault = await AxiosInstance(dataRequest.token).get(
      `/${Model.ADVERTISEMENT}/timeout?post=${dataRequest.post}`,
    );
    await isTokenExpired(resault.statuscode);
    if (resault.status) {
      return { status: true, data: resault.data };
    } else {
      return { status: false, data: resault.data };
    }
  } catch (error) {
    console.log(error + 'Lỗi');
    return { status: false, data: 'Opps ! Have a problem' };
  }
}

export async function getAllAdvertisement(dataRequest) {
  try {
    const resault = await AxiosInstance(dataRequest.token).get(
      `/${Model.COSTADVERTISEMENT}`,
    );
    await isTokenExpired(resault.statuscode);
    if (resault.status) {
      return { status: true, data: resault.data };
    } else {
      return { status: false, data: resault.data };
    }
  } catch (error) {
    console.log(error + 'Lỗi getAllAdvertisement');
    return { status: false, data: 'Opps ! Have a problem' };
  }
}

export async function checkoutAdv(dataRequest) {
  try {
    const resault = await AxiosInstance(dataRequest.token).post(
      `/${Model.ADVERTISEMENT}/checkout`,
      dataRequest.body,
    );
    await isTokenExpired(resault.statuscode);
    console.log(resault);
    if (resault.status) {
      return { status: true, data: resault.data };
    } else {
      return { status: false, data: resault.data };
    }
  } catch (error) {
    console.log(error + 'Lỗi checkoutAdv');
    return { status: false, data: 'Opps ! Have a problem' };
  }
}

export async function rePost(data) {
  try {
    const resault = await AxiosInstance().post(
      `${Model.POSTS}/${POST.REPOST}`,
      data,
    );
    if (resault.status) {
      return { status: true, data: resault.data };
    } else {
      return { status: false, data: resault.data };
    }
  } catch (error) {
    console.log(error + 'Lỗi');
    return { status: false, data: 'Opps ! Have a problem' };
  }
}

export async function dePost(data) {
  try {
    const resault = await AxiosInstance().delete(
      `${Model.POSTS}/${POST.REMOVE}`,
      { data: data },
    );
    if (resault.status) {
      return { status: true, data: resault.data };
    } else {
      return { status: false, data: resault.data };
    }
  } catch (error) {
    console.log(error + 'Lỗi');
    return { status: false, data: 'Opps ! Have a problem' };
  }
}

export async function createSaved(data) {
  console.log(data);

  try {
    const resault = await AxiosInstance().post(
      `${Model.SAVED}/${SAVED.CREATE}`,
      data,
    );
    if (resault.status) {
      return { status: true, data: resault.data };
    } else {
      return { status: false, data: resault.data };
    }
  } catch (error) {
    console.log(error, 'aaaaaaaaaaaaa');
    return { status: false, data: 'Opps ! Have a problem' };
  }
}

export async function createReport(data) {
  try {
    const resault = await AxiosInstance().post(
      `${Model.REPORT}`, data
    );
    return resault
  } catch (error) {
    console.log(error + ' Lỗi');
    return { status: false, data: error.data };
  }
}

export async function getReport(data) {
  try {
    const resault = await AxiosInstance().get(`${Model.REPORT}/${ReportModel.ALL}?page=${data?.page}&limit=${data.limit}`);
    return resault
  } catch (error) {
    console.log(error + ' Lỗi');
    return { status: false, data: error.data };
  }
}

export async function removeReport(data) {
  console.log(data);
  
  try {
    const resault = await AxiosInstance().delete(`${Model.REPORT}/${ReportModel.REMOVE}`, {data: data});
    return resault
  } catch (error) {
    console.log(error + ' Lỗi');
    return { status: false, data: error.data };
  }
}