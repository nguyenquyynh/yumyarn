import { Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { Icon, TouchableOpacity, View } from 'react-native-ui-lib'

const HearDetailPost = ({
  back,
  dot
}) => {
  return (
    <View style={styles.top}>
      <View spread bottom flex paddingT-xxx padding-x centerV row>
        <TouchableOpacity br40 bg-opacity padding-x onPress={() => { back() }}>
          <Icon assetName='arrow_back' size={20} tintColor='white' />
        </TouchableOpacity>
        <TouchableOpacity padding-x onPress={dot}>
          <Icon assetName='dots' size={25} tintColor='white' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HearDetailPost
var widthscreen = Dimensions.get('window').width < Dimensions.get('window').height ? Dimensions.get('window').width : Dimensions.get('window').height

const styles = StyleSheet.create({
  top: {
    width: '100%', height: widthscreen / 4.5,
    position: 'absolute',
    top: 0
  },
})