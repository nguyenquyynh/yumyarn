import { t } from "lang";
import { ToastAndroid } from "react-native";
import { Filter } from 'bad-words'
export const isCleanContent = (content) => {
    const filter = new Filter()
    const Vnfilter = (words) => {
        const regex = ['địt', 'địt mẹ', 'lồn', 'cặc', 'đéo', 'vãi', 'vãi lồn', 'vcl', 'cmm', 'dcm', 'cc']
        if (regex.some(word => words.toLowerCase().includes(word))) {
            return true
        }
        return false
    }

    if (filter.isProfane(content) || Vnfilter(content)) {
        console.log(filter.isProfane(content));
        ToastAndroid.show(t("error.bad_words"), ToastAndroid.SHORT)
        return false
    } else {
        console.log(filter.isProfane(content));
        return true
    }
}