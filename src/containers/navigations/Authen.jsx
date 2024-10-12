import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Welcome from 'containers/auth/Welcome';
import Login from 'containers/auth/Login';
import OpenApp from 'components/commons/OpenApp';

const Authen = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName='OpenApp' screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Welcome' component={Welcome} />
            <Stack.Screen name='OpenApp' component={OpenApp} />
        </Stack.Navigator>
    )
}

export default Authen
