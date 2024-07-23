import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MainPost from 'containers/post/MainPost'
import AddAdrressScreen from 'containers/post/AddAdrressScreen'
import Setting from 'containers/setting/Setting'
import { NavigationContainer } from '@react-navigation/native'
import DevScreen from './DevScreen'
import Welcome  from 'containers/auth/Welcome'
import Login from 'containers/auth/Login'
import SearchMain from 'containers/search/SearchMain'
import PostDetail from 'containers/post/PostDetail'

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
                <Stack.Screen name='Search' component={SearchMain} />
                <Stack.Screen name='PostDetail' component={PostDetail} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default DevNavigation

const styles = StyleSheet.create({})