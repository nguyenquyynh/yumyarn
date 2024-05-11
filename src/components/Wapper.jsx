
import React, { Children } from 'react'
import { View } from 'react-native-ui-lib'

const Wapper = ({
    children
}) => {
  return (
    <View flex bg-yellow paddingT-xx>
      {children}
    </View>
  )
}

export default Wapper