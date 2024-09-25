import { SB } from 'configs/fonts'
import React from 'react'
import { StyleSheet } from 'react-native';
import { Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import IconApp from './IconApp';
import { useNavigation } from '@react-navigation/native';

const HeaderApp = ({
    customheader,
    colortitle,
    renderleft,
    customleft,
    renderright,
    iconright,
    customright,
    sizeiconright = 25,
    funtleft,
    funtright,
    title,
}) => {
    const navigation = useNavigation()
    return (
        <View flex bg-white>
            {customheader ?
                <View absF>
                    {customheader()}
                </View> :
                <View flex row centerV padding-xx absF>
                    <View flex left paddingT-xx>
                        {renderleft ?
                            <TouchableOpacity br40 bg-yellow padding-x onPress={funtleft}>
                                <Icon assetName='arrow_back' size={15} tintColor='white' />
                            </TouchableOpacity> : customleft && customleft?.()}
                    </View>
                    {title &&
                        <View flex absH paddingT-xx center>
                            <Text color={colortitle || 'black'} style={styles.title}>{title}</Text>
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
            }
        </View>
    )
}

export default HeaderApp

const styles = StyleSheet.create({
    title: {
        fontFamily: SB,
        fontSize: 16
    }
})