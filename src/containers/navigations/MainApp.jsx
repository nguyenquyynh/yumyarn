import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AddAdrressScreen from 'containers/post/AddAdrressScreen'
import MainPost from 'containers/post/MainPost'
import Main from 'containers/main/Main'
import Setting from 'containers/main/Setting'
import SearchMain from 'containers/search/SearchMain'
import ListPost from 'containers/post/ListPost'
import PostDetail from 'containers/post/PostDetail'
import EditProfile from 'containers/profile/EditProfile'
import FollowerList from 'containers/profile/FollowerList'
import FollowingList from 'containers/profile/FollowingList'
import OtherProfile from 'containers/profile/OtherProfile'
import About from 'containers/setting/About'
import Advertisement from 'containers/setting/Advertisement'
import HelpSupport from 'containers/setting/HelpSupport'
import MessageSetting from 'containers/setting/MessageSetting'
import Payment from 'containers/setting/Payment'
import PostSaved from 'containers/setting/PostSaved'
import SearchMap from 'containers/search/SearchMap'
import MainChat from 'containers/chat/MainChat'
import MainNotifications from 'containers/notification/MainNotifications'

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
            <Stack.Screen name='EditProfile' component={EditProfile} />
            <Stack.Screen name='FollowerList' component={FollowerList} />
            <Stack.Screen name='FollowingList' component={FollowingList} />
            <Stack.Screen name='About' component={About} />
            <Stack.Screen name='Advertisement' component={Advertisement} />
            <Stack.Screen name='HelpSupport' component={HelpSupport} />
            <Stack.Screen name='MessageSetting' component={MessageSetting} />
            <Stack.Screen name='Payment' component={Payment} />
            <Stack.Screen name='PostSaved' component={PostSaved} />
            <Stack.Screen name='SearchMap' component={SearchMap} />
            <Stack.Screen name='OtherProfile' component={OtherProfile} />
            <Stack.Screen name='MainChat' component={MainChat} />
            <Stack.Screen name='MainNotifications' component={MainNotifications} />
        </Stack.Navigator>
    )
}

export default MainApp
