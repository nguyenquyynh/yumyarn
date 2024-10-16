import { View, StyleSheet } from 'react-native'
import React from 'react'

const CustomCirlceOnline = () => {
  return (
    <View style={styles.circleIsOnilne}/>
  )
}

const styles = StyleSheet.create({
  circleIsOnilne: {
    backgroundColor: '#00FF08',
    width: 10,
    height: 10,
    borderRadius: 360,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
})

export default CustomCirlceOnline