import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AddAdrressScreen from 'containers/post/AddAdrressScreen'
import MainPost from 'containers/post/MainPost'
import Main from 'containers/main/Main'
import Setting from 'containers/main/Setting'
import SearchMain from 'containers/search/SearchMain'
import ListPost from 'containers/post/ListPost'
import PostDetail from 'containers/post/PostDetail'

const MainApp = () => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}
            initialRouteName='Main'>
            <Stack.Screen name='Main' component={Main} />
            <Stack.Screen name='Search' component={SearchMain} />
            <Stack.Screen name='Setting' component={Setting} />
            <Stack.Screen name='Post' component={MainPost} />
            <Stack.Screen name='ListPost' component={ListPost} />
            <Stack.Screen name='PostDetail' component={PostDetail} />
            <Stack.Screen name='Adddrressscreen' component={AddAdrressScreen} />
        </Stack.Navigator>
    )
}

export default MainApp
