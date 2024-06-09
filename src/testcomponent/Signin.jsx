import { StyleSheet, View } from 'react-native'
import React from 'react'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import { Button, Text } from 'react-native-ui-lib'
const Signin = () => {
  GoogleSignin.configure({
    webClientId: process.env.GOOGLE_SIGNINAPI,
  })
  const handleSignin = async () => {
    console.log('google signin........')
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true
    })
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      console.log('select.......')
      const user = userInfo.user
      console.log('user info', user)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSignout = async () => {
    console.log('google sign out........')
    await GoogleSignin.signOut()
  }

  return (
    <View>
      <Button onPress={handleSignin}>
        <Text white xviiiText>Login with google</Text>
      </Button>
      <Button onPress={handleSignout}>
        <Text white xviiiText>Logout</Text>
      </Button>
    </View>
  )
}

export default Signin
