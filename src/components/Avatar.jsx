import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native-ui-lib'

const Avatar = ({
    source,
    size,
    onPress
}) => {
    return (
        <Image source={source} styles={{ width: size, height: size }} onPress={onPress} />
    )
}

export default Avatar

const styles = StyleSheet.create({})