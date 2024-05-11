import IconCustom from 'components/IconCustom';
import Wapper from 'components/Wapper'
import { t } from 'lang';
import React from 'react'
import { StyleSheet } from 'react-native';
import { Avatar, Image, Text, View } from 'react-native-ui-lib';
const Screen1 = () => {
  return (
    <Wapper
      gadient
      // renderleft
      customleft={() => (
        <View marginT-xx>
          <Text appname style={{ fontFamily: 'Anton-Regular' }}>Yumyarn</Text>
        </View>
      )}
      // renderright
      customright={() => (
        <View flex row right marginT-xx centerV>
          <IconCustom name={'search'} />
          <View marginH-xx>
            <IconCustom name={'notification'} />
          </View>
          <Avatar source={require('assets/icon/diaphragm.png')} size={30} />
        </View>
      )}


    // title={t('create_post.title')}

    // header
    // customheader={() => (
    //   <View flex paddingT-xx bg-red>
    //   </View>
    // )}
    >
      <View flex >
        <Text>aaaaaaaaaaaaaaaaaaaaaaa</Text>
        <Text>aaaaaaaaaaaaaaaaaaaaaaa</Text>
        <Text>aaaaaaaaaaaaaaaaaaaaaaa</Text>
      </View>
    </Wapper>
  )
}

export default Screen1

const styles = StyleSheet.create({

})