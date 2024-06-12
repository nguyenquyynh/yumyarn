import { StyleSheet } from 'react-native'
import React from 'react'
import Wapper from 'components/Wapper'
import { Colors, Text, TouchableOpacity } from 'react-native-ui-lib'
import { useNavigation } from '@react-navigation/native'

const DevScreen = () => {
    const navigation = useNavigation()
    const gotoScreen = (screen) => {
        navigation.navigate(screen)
    }
    return (
        <Wapper gadient>
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
        </Wapper>
    )
}

export default DevScreen

const styles = StyleSheet.create({})