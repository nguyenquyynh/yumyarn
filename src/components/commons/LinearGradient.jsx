import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { Colors } from 'react-native-ui-lib'

const LinearGradientCom = ({
    direction = 'D',
    dark = Colors.yellow,
    light = Colors.white,
}) => {
    var styleColor =
        direction === 'D' ? {
            start: { x: 1, y: 0 },
            end: { x: 1, y: 1 }
        } : direction === 'L' ? {
            start: { x: 0, y: 0 },
            end: { x: 1, y: 1 }
        } : direction === 'U' ? {
            start: { x: 1, y: 1 },
            end: { x: 1, y: 0 }
        } : direction === 'R' && {
            start: { x: 1, y: 1 },
            end: { x: 0, y: 0 }
        }
    return (
        <LinearGradient
            start={styleColor.start} end={styleColor.end}
            locations={[0, 1]}
            colors={[dark, light]}
            style={{ flex: 1, width: '100%', height: '100%' }}
        />
    )
}

export default LinearGradientCom

const styles = StyleSheet.create({})