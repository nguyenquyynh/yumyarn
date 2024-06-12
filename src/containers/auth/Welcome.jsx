import React from 'react'
import { StyleSheet } from 'react-native'
import { Button, Text, View } from 'react-native-ui-lib'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from 'src/store/reducers/ex'

export function Welcome() {
    const count = useSelector((state) => state.user)
    const dispatch = useDispatch()
    return (
        <View style={styles.container}>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    count: {
        fontSize: 20,
        marginHorizontal: 10,
    },
});