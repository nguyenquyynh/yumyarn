import Modals from 'components/Modals'
import Wapper from 'components/Wapper'
import React, { useState } from 'react'
import { ScrollView, StatusBar, StyleSheet } from 'react-native'
import { Text, View } from 'react-native-ui-lib'
const Screen1 = () => {
  const [show, setshow] = useState(true)
  return (
    <Wapper>
      <Text onPress={() => setshow(true)}>aaaaaaaaaaaaaaaaaa</Text>
      <Modals modalVisible={show} modalhiden={setshow}>
        <ScrollView showsVerticalScrollIndicator={false}>
        </ScrollView>
      </Modals>
      </Wapper>
  )
}

export default Screen1

const styles = StyleSheet.create({
  
})