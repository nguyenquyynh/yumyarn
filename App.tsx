import { StatusBar, StyleSheet, Text } from 'react-native'
import React from 'react'
import { View } from 'react-native-ui-lib'
import ScreenGGmap from 'src/testcomponent/ScreenGGmap'
import Signin from 'src/testcomponent/Signin'
<<<<<<< Updated upstream
// import Signin from 'src/testcomponent/Signin'
// import ImageAndVideoLibary from 'src/testcomponent/SelectImageAndVideoInLibary'


const App = () => {
  return (
    <View flex>
      <Signin/>
      {/* <ImageAndVideoLibary/> */}
      {/* <ScreenGGmap/> */}
=======
import AddAdrressScreen from 'containers/post/AddAdrressScreen'
import Welcome01 from 'containers/auth/welcome/Welcome01'
import Welcome02 from 'containers/auth/welcome/Welcome02'
import Login from 'containers/auth/Login'
const App = () => {
  return (
    <View flex>
      <Login/>
>>>>>>> Stashed changes
    </View>

  )
}

export default App

const styles = StyleSheet.create({})