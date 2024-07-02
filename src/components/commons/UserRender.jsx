import { Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { Text, View } from 'react-native-ui-lib'

const UserRender = ({ item }) => {
    console.log(item);
    return (
        <View>
            <Text>{item.name}</Text>
        </View>
    )
}

export default UserRender

const styles = StyleSheet.create({})