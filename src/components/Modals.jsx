import { Image, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { Modal, Pressable, StyleSheet } from 'react-native'
import React, { Children } from 'react'

const Modals = ({
  modalVisible = true,
  modalhiden,
  children
}) => {
  return (
    <View flex absF>{modalVisible &&
      <View flex bg-tr_black >
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}>
          <Pressable bg-red height={'100%'} onPress={() => { modalhiden(false) }}>
          </Pressable>
          <View flex bottom absF marginT-cc>
            <View centerH paddingT-x bg-white style={styles.viewModal}>
              <Image assetName='line' tintColor='gray' width={60} height={10} />
              <View padding-x>
                {children}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    }
    </View>

  )
}

export default Modals

const styles = StyleSheet.create({
  viewModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
});