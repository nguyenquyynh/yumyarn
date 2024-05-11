import React from 'react'
import { Image, View } from 'react-native-ui-lib'

const IconCustom = ({
    name,
    size = 22,
}) => {
    return (
        <Image assetName={name} width={size} height={size} />

    )
}

export default IconCustom