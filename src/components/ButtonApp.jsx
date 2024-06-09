import { StyleSheet } from 'react-native'
import React from 'react'
import { Button, Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import IconApp from './IconApp'
import { BOLD } from 'configs/fonts'

const ButtonApp = ({
    padding = 10,
    margirn = 0,
    title = 'Title',
    background = Colors.yellow,
    color = Colors.white,
    renderleft,
    renderright,
    customlefft,
    customright,
    iconleft,
    iconsize,
    iconright,
    onclick,
    customcontent,
    ...props
}) => {
    return (
        <View left paddingT-xx>
            {customcontent ||
                <View br20 paddingH-xv paddingV-iv backgroundColor={background} centerH row >
                    <View>
                        {customlefft || renderleft ? <IconApp assetName={iconleft} size={iconsize} /> : <View />}
                    </View>
                    <Text color={color} style={styles.title}>{title}</Text>
                    <View>
                        {customright || renderright ? <IconApp assetName={iconright} size={iconsize} /> : <View />}
                    </View>
                </View>
            }
        </View>
    )
}

export default ButtonApp

const styles = StyleSheet.create({
    title:{
        fontFamily: BOLD
    }
})