import { StyleSheet } from 'react-native'
import React from 'react'
import { Button, Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import IconApp from './IconApp'
import { BOLD } from 'configs/fonts'

const ButtonApp = ({
    title = 'Title',
    outline,
    background = Colors.yellow,
    color = Colors.white,
    colorborder,
    renderleft,
    renderright,
    customlefft,
    customright,
    iconleft,
    iconsize,
    iconright,
    onclick,
    customcontent,
    props,
}) => {
    var bordercolor = outline ? colorborder : background
    return (
        <View style={props}>
            {customcontent ||
                <View br20 paddingH-xv paddingV-iv backgroundColor={background} centerH row style={{borderWidth: 1, borderColor: bordercolor}}>
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