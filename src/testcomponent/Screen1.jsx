import LinearGradientCom from 'components/commons/LinearGradient';
import React from 'react'
import { ScrollView, StyleSheet } from 'react-native';
import { Avatar, Colors, Icon, Image, Text, View } from 'react-native-ui-lib';
const Screen1 = () => {
  return (
    <View flex bg-red>
      <View height={300}>

      </View>
      <ScrollView width={'100%'} style={{ backgroundColor: 'blue', position: 'absolute', bottom: 0 }}>
        <Icon assetName='fire'/>
        <View bg-white>
          <Text>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>
          <Text>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>
          <Text>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>
          <Text>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>
        </View>
      </ScrollView>
    </View>
  )
}

export default Screen1

const styles = StyleSheet.create({

})