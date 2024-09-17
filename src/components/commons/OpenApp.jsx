import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Colors, Icon, Image, Text, View } from 'react-native-ui-lib'
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

const OpenApp = () => {
    const offset = useSharedValue(50)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: offset.value }],
        opacity: interpolate(offset.value, [0, 50], [1, 0])
    }))

    useEffect(() => {
        offset.value = withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.back(3)) })
    }, [])

    return (
        <View style={styles.container}>

            <Image source={{ uri: 'https://cdn.pixabay.com/photo/2020/08/09/11/30/bar-5475279_640.jpg' }} style={styles.hamburgerImage} />
            <Image source={{ uri: 'https://cdn.pixabay.com/photo/2020/08/09/11/30/bar-5475279_640.jpg' }} style={styles.pizzaImage} />
            <View style={styles.diagonalLine} center>
                <View center style={styles.logo}>
                    <Animated.View style={animatedStyle}>
                        <Icon assetName='logoapp' size={100} />
                        <Text text60BO>YUMYARN</Text>
                    </Animated.View>
                </View>
            </View>
        </View>
    )
}

export default OpenApp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    hamburgerImage: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '50%',
    },
    pizzaImage: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '50%',
    },
    diagonalLine: {
        position: 'absolute',
        width: '100%',
        height: 1000,
        borderWidth: 2,
        borderColor: Colors.yellow,
        backgroundColor: 'white',
        transform: [{ rotate: '-45deg' }],
    },
    logo: { transform: [{ rotate: '45deg' }], }
})