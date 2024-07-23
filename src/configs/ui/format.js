import { t } from "lang";

const numberFormat = (number) => {
    if (number >= 1000000000) {
        return `${(number / 1000000000).toFixed(1)} ${t("app.bilion")}`;
    } else if (number >= 1000000) {
        return `${(number / 1000000).toFixed(1)} ${t("app.milion")}`;
    } else if (number >= 1000) {
        return `${(number / 1000).toFixed(1)} ${t("app.thousand")}`;
    } else {
        return number
    }
}

export default numberFormat