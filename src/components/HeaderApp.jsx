import fonts, { BLACK } from 'configs/fonts'
import React from 'react'
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import { Colors, Image, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import IconApp from './IconApp';
import TextApp from './commons/TextApp';

const HeaderApp = ({
    gadient = false,
    colortitle,
    renderleft,
    iconleft,
    customleft,
    renderright,
    titlesize,
    iconright,
    customright,
    sizeiconleft = 25,
    sizeiconright = 25,
    funtleft,
    funtright,
    title,
}) => {

    return (
        <View flex>
            {gadient &&
                <LinearGradient
                    start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}
                    locations={[0, 1]}
                    colors={[Colors.yellow, Colors.white]}
                    style={{ height: '100%' }}
                />}
            <View flex row centerV padding-xx absF>
                <View flex left paddingT-xx>
                    {renderleft ?
                        <TouchableOpacity onPress={funtleft}>
                            <IconApp
                                assetName={iconleft}
                                size={sizeiconleft} />
                        </TouchableOpacity> : customleft && customleft?.()}
                </View>
                {title &&
                    <View flex absH paddingT-xx center>
                        <TextApp size={titlesize} color={colortitle || Colors.black} style={styles.title} text={title ? title : ""}/>
                    </View>}
                <View flex right paddingT-xx>
                    {renderright ?
                        <TouchableOpacity onPress={funtright}>
                            <IconApp
                                assetName={iconright}
                                size={sizeiconright} />
                        </TouchableOpacity> : customright && customright?.()}
                </View>

            </View>
        </View>
    )
}

export default HeaderApp

const styles = StyleSheet.create({
    title: {
        fontFamily: fonts.BOLD
    }
})