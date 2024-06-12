import { StatusBar, StyleSheet, Text } from 'react-native'
import React from 'react'
import { View } from 'react-native-ui-lib'
import ScreenGGmap from 'src/testcomponent/ScreenGGmap'
import Signin from 'src/testcomponent/Signin'
import AddAdrressScreen from 'containers/post/AddAdrressScreen'
import Setting from 'containers/auth/Setting'
import Login from 'containers/auth/Login'
import CameraApp from 'components/CameraApp'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Welcome01 from 'containers/auth/welcome/Welcome01'
import Welcome02 from 'containers/auth/welcome/Welcome02'
import SelectImageAndVideoInLibary from 'src/testcomponent/SelectImageAndVideoInLibary'


const App = () => {
  return (
    <View flex>
      <StatusBar translucent backgroundColor={'rgba(0,0,0,0)'}/>
      <View flex> 
          {/* <Signin/> */}
          {/* <CameraApp/> */}
          {/* <Setting/> */}
          <SelectImageAndVideoInLibary/>
        </View>
    </View>
   
  )
}

export default App

const styles = StyleSheet.create({})