import fonts from 'configs/fonts'
import React from 'react'
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import { Colors, Image, Text, TouchableOpacity, View } from 'react-native-ui-lib';

const Header = ({
    gadient = false,
    renderleft,
    iconleft,
    customleft,
    renderright,
    iconright,
    customright,
    sizeiconleft = 25,
    sizeiconright = 25,
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
                {renderleft ?
                    <TouchableOpacity flex left paddingT-xx>
                        <Image
                            assetName={iconleft}
                            width={sizeiconleft}
                            height={sizeiconleft} />
                    </TouchableOpacity> : customleft && customleft?.()}
                {title &&
                    <View flex absH paddingT-xx center>
                        <Text title style={styles.title}>
                            {title ? title : ""}
                        </Text>
                    </View>}
                {renderright ?
                    <TouchableOpacity flex right paddingT-xx>
                        <Image
                            assetName={iconright}
                            width={sizeiconright}
                            height={sizeiconright} />
                    </TouchableOpacity> : customright && customright?.()}
            </View>
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    title: {
        fontFamily: fonts.BOLD
    }
})