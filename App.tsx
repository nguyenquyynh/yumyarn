import { StatusBar, StyleSheet, Text } from 'react-native'
import React from 'react'
import { View } from 'react-native-ui-lib'
import ScreenGGmap from 'src/testcomponent/ScreenGGmap'
import Signin from 'src/testcomponent/Signin'
import AddAdrressScreen from 'containers/post/AddAdrressScreen'
import Login from 'containers/auth/Login'
import CameraApp from 'components/CameraApp'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Welcome01 from 'containers/auth/welcome/Welcome01'
import Welcome02 from 'containers/auth/welcome/Welcome02'
import Setting from 'containers/setting/Setting'


const App = () => {
  return (
    <GestureHandlerRootView>
      <StatusBar translucent backgroundColor={'rgba(0,0,0,0)'}/>
      <View flex> 
          <Setting/>
        </View>
    </GestureHandlerRootView>
   
  )
}

export default App

const styles = StyleSheet.create({})