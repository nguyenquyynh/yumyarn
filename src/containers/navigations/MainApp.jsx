import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AddAdrressScreen from 'containers/post/AddAdrressScreen'
import MainPost from 'containers/post/MainPost'

const MainApp = () => {
    const Stack = createNativeStackNavigator()
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name='Mainpost' component={MainPost} />
            <Stack.Screen name='Adddrressscreen' component={AddAdrressScreen} />
        </Stack.Navigator>
    )
}

export default MainApp
