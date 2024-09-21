import IconApp from 'components/IconApp'
import React from 'react'
import { Icon, Image, View } from 'react-native-ui-lib'

const EmptyScreen = () => {
  return (
    <View flex center>
        <Icon assetName='empty' size={200}/>
    </View>
  )
}

export default EmptyScreen
