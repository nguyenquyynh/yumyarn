import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Welcome from 'containers/auth/Welcome';
import Login from 'containers/auth/Login';

const Authen = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName='Welcome' screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Welcome' component={Welcome} />
        </Stack.Navigator>
    )
}

export default Authen

const styles = StyleSheet.create({})