import { StyleSheet } from 'react-native'
import React from 'react'
import { View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { useNavigation } from '@react-navigation/native'

const OtherProfile = ({ route }) => {
    const { name } = route.params
    const navigation = useNavigation()

    return (
        <Wapper renderleft funtleft={() => navigation.goBack()} title={name}>
            <View flex bg-white>

            </View>
        </Wapper>
    )
}

export default OtherProfile

const styles = StyleSheet.create({})