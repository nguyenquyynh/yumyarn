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
  funtleft,
  funtright,
  sizeiconleft,
  sizeiconright,
  customleft,
  customright,
  title,
  titlesize,
  children
}) => {

  return (
    <View flex>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>
        {!header ?
          <HeaderApp
          titlesize={titlesize}
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
            funtleft={funtleft}
            funtright={funtright}
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
  header: {
    height: 100
  }
})
