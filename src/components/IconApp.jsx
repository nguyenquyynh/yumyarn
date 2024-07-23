import React from 'react'
import { Colors, Image, View } from 'react-native-ui-lib'

const IconApp = ({
    assetName,
    size = 22,
    color = Colors.black,
    props,
}) => {
    return (
        <Image style={props} assetName={assetName} width={size} height={size} />
    )
}

export default IconApp