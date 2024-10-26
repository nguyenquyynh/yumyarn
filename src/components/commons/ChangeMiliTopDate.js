import {t} from 'lang';

export const transDate = create_at => {
  const dateNow = new Date();
  const datePast = new Date(parseInt(create_at));
  const differenceInMilliseconds = dateNow - datePast;
  return Math.floor(differenceInMilliseconds / 1000);
};

export const formatDate = timestamp => {
  const date = new Date(parseInt(timestamp));
  const now = new Date();

  const diffMilliseconds = now - date;
  const diffSeconds = Math.floor(diffMilliseconds / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 0) {
    // Trả về giờ:phút
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (diffDays < 7) {
    // Trả về thứ giờ:phút
    const weekday = date.toLocaleString('vi-VN', {weekday: 'short'});
    const time = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${weekday}, ${time}`;
  } else if (diffDays < 365) {
    // Trả về tháng ngày, giờ:phút
    const monthDay = date.toLocaleString('vi-VN', {
      month: 'short',
      day: '2-digit',
    });
    const time = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${monthDay}, ${time}`;
  } else {
    // Trả về năm tháng ngày, giờ:phút
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
};

export const changeTime = time => {
  if (time >= 60 * 60 * 24 * 365) {
    return `${Math.floor(time / (60 * 60 * 24 * 365))} ${t('app.year')} ${t(
      'app.ago',
    )}`;
  } else if (time >= 60 * 60 * 24 * 30) {
    return `${Math.floor(time / (60 * 60 * 24 * 30))} ${t('app.month')} ${t(
      'app.ago',
    )}`;
  } else if (time >= 60 * 60 * 24) {
    return `${Math.floor(time / (60 * 60 * 24))} ${t('app.day')} ${t(
      'app.ago',
    )}`;
  } else if (time >= 60 * 60) {
    return `${Math.floor(time / (60 * 60))} ${t('app.hour')} ${t('app.ago')}`;
  } else if (time >= 60) {
    return `${Math.floor(time / 60)} ${t('app.minute')} ${t('app.ago')}`;
  } else {
    return `${time} ${t('app.second')} ${t('app.ago')}`;
  }
};
