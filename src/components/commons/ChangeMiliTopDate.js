import { t } from "lang";

export const transDate = create_at => {
  const dateNow = new Date();
  const datePast = new Date(parseInt(create_at));
  const differenceInMilliseconds = dateNow - datePast;
  return Math.floor(differenceInMilliseconds / 1000);
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
