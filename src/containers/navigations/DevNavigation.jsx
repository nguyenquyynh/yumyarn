import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainPost from 'containers/post/MainPost'
import AddAdrressScreen from 'containers/post/AddAdrressScreen'
import Setting from 'containers/setting/Setting'
import Welcome from 'containers/auth/Welcome'
import { NavigationContainer } from '@react-navigation/native'
import DevScreen from './DevScreen'

const DevNavigation = () => {
    const Stack = createNativeStackNavigator()
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name='DevScreen' component={DevScreen} />
                <Stack.Screen name='Post' component={MainPost} />
                <Stack.Screen name='Addadress' component={AddAdrressScreen} />
                <Stack.Screen name='Setting' component={Setting} />
                <Stack.Screen name='Welcome' component={Welcome} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default DevNavigation

const styles = StyleSheet.create({})