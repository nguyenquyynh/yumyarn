import React from 'react';
import { View } from 'react-native-ui-lib';
import { StatusBar, StyleSheet } from 'react-native';
import HeaderApp from './HeaderApp';

const Wapper = ({
  header = false, // call if you want to custom header
  customheader, //funtion return UI
  gadient, // Show linearGadient Top
  iconleft,
  iconright,
  renderleft = false,
  renderright = false,
  sizeiconleft,
  sizeiconright,
  customleft,
  customright,
  title,
  children
}) => {

  return (
    <View flex>
       <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>
        {!header ?
          <HeaderApp
            gadient={gadient}
            title={title}
            iconleft={!iconleft ? 'back' : iconleft}
            iconright={!iconright ? 'settings' : iconright}
            renderleft={renderleft}
            renderright={renderright}
            customleft={customleft}
            customright={customright}
            sizeiconright={sizeiconright}
            sizeiconleft={sizeiconleft}
          /> : customheader && customheader?.()}
      </View>
      <View flex-15>
        {children}
      </View>
    </View>
  )
}

export default Wapper
const styles = StyleSheet.create({
  header:{
    height: 100
  }
})
