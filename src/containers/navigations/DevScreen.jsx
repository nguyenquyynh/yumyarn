import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import Wapper from 'components/Wapper'
import { Colors, Text, TouchableOpacity } from 'react-native-ui-lib'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { t } from 'lang'
import { setting_changelanguage } from 'reducers/setting'
import { Translation } from 'react-i18next'
import fonts from 'configs/fonts'

const DevScreen = () => {
    const navigation = useNavigation()
    const auth = useSelector(state => state.auth)
    const setting = useSelector(state => state.setting)
    console.log("auth:", auth, "setting:", setting)
    const dishpatch = useDispatch()

    const gotoScreen = (screen) => {
        navigation.navigate(screen)
    }
    return (
        <Wapper gadient  title={"notification.system"}>
            <TouchableOpacity center padding-xx bg-orange onPress={() => { gotoScreen("Post") }}>
                <Text color={Colors.white}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity center padding-xx bg-orange onPress={() => { gotoScreen("Setting") }}>
                <Text color={Colors.white}>Setting</Text>
            </TouchableOpacity>
            <TouchableOpacity center padding-xx bg-orange onPress={() => { gotoScreen("Addadress") }}>
                <Text color={Colors.white}>Addadress</Text>
            </TouchableOpacity>
            <TouchableOpacity center padding-xx bg-orange onPress={() => { gotoScreen("Welcome") }}>
                <Text color={Colors.white}>Welcome</Text>
            </TouchableOpacity>
            <TouchableOpacity center padding-xx bg-orange onPress={() => { dishpatch(setting_changelanguage('en')) }}>
                <Text>English</Text>
            </TouchableOpacity>
            <TouchableOpacity center padding-xx bg-orange onPress={() => { dishpatch(setting_changelanguage('cn')); dishpatch(setting_changelanguage('cn')) }}>
                <Text>China</Text>
            </TouchableOpacity>
            <TouchableOpacity center padding-xx bg-orange onPress={() => { dishpatch(setting_changelanguage('vi')) }}>
                <Text>VietNam</Text>
            </TouchableOpacity>
        </Wapper>
    )
}

export default DevScreen

const styles = StyleSheet.create({})