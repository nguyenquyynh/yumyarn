import { StatusBar, StyleSheet, Text } from 'react-native'
import React from 'react'
import { View } from 'react-native-ui-lib'
import ScreenGGmap from 'src/testcomponent/ScreenGGmap'
import Signin from 'src/testcomponent/Signin'
import AddAdrressScreen from 'containers/post/AddAdrressScreen'
import Setting from 'containers/auth/Setting'
import Login from 'containers/auth/Login'


const App = () => {
  return (
    <View flex>
      {/* <Signin/> */}
      {/* <ImageAndVideoLibary/> */}
      {/* <AddAdrressScreen/> */}
      {/* <Setting/> */}
      <Login/>
    </View>

  )
}

export default App

const styles = StyleSheet.create({})