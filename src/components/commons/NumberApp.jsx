
import React from 'react'
import { Text } from 'react-native-ui-lib'
import { t } from 'lang'

const NumberApp = ({ number, size = 20, color = 'black' }) => {
    const exchangeUnit = (number) => {
        if (number >= 1000000000) {
            return `${(number / 1000000000).toFixed(1)}${t("app.bilion")}`;
        } else if (number >= 1000000) {
            return `${(number / 1000000).toFixed(1)}${t("app.milion")}`;
        } else if (number >= 1000) {
            return `${(number / 1000).toFixed(1)}${t("app.thousand")}`;
        } else {
            // return number.toLocaleString('vi-VN');
            return number
        }
    }
    return (
        <Text style={{
            fontSize: size,
            color: color
        }}>{exchangeUnit(number)}</Text>
    )
}

export default NumberApp
