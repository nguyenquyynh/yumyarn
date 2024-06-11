import { StatusBar, StyleSheet, Text } from 'react-native'
import React from 'react'
import { View } from 'react-native-ui-lib'
import ScreenGGmap from 'src/testcomponent/ScreenGGmap'
import Signin from 'src/testcomponent/Signin'
import CameraApp from 'components/CameraApp'
import { GestureHandlerRootView } from 'react-native-gesture-handler'


const App = () => {
  return (
    <GestureHandlerRootView>
      <StatusBar translucent backgroundColor={'rgba(0,0,0,0)'}/>
      <View flex> 
          
          {/* <Signin/> */}
          <CameraApp/>
        </View>
    </GestureHandlerRootView>
   
  )
}

export default App

const styles = StyleSheet.create({})