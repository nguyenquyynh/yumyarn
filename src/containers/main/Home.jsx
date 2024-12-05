import {
  Animated,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { Icon, Modal, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ListPost from 'containers/post/ListPost';
import Avatar from 'components/Avatar';
import { t } from 'lang';
import TextApp from 'components/commons/TextApp';
import Markdown from 'react-native-markdown-display';
import LottieView from 'lottie-react-native';
import lottie from 'configs/ui/lottie';
import messaging from '@react-native-firebase/messaging';

const Home = () => {
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth.user);
  const name = auth?.name?.split(' ')[0];
  const idUser = auth._id;
  const [showNotiAdmin, setshowNotiAdmin] = useState('')
  //Animated header
  const scrollY = new Animated.Value(0);
  const diffclamp = Animated.diffClamp(scrollY, 0, 55);
  const tranSlateY = diffclamp.interpolate({
    inputRange: [0, 55],
    outputRange: [0, -55],
  });
  function handlerSearch() {
    navigation.navigate('Search');
  }
  function handlerCreatePost() {
    navigation.navigate('Post');
  }

  function gotoDetail(data) {
    navigation.navigate('PostDetail', { ...data })
  }

  messaging().onMessage(async remoteMessage => {
    if (remoteMessage?.data?.type) {
      setshowNotiAdmin(remoteMessage.data)
    }
  });

  return (
    <View flex bg-white>
      <Animated.View
        style={[styles.header, { transform: [{ translateY: tranSlateY }] }]}>
        <View row centerV marginT-6>
          <Avatar source={{ uri: auth.avatar }} size={40} onPress={() => { }} />
          <TextApp style={[styles.name, { marginLeft: 5 }]} text={`home.welcome`} /><Text style={[styles.name, { marginRight: 5 }]}>{name}</Text>
          <TouchableOpacity onPress={handlerCreatePost}>
            <Icon assetName="add" size={20} />
          </TouchableOpacity>
        </View>
        <View row centerV>
          <TouchableOpacity onPress={handlerSearch}>
            <Icon assetName="search" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            marginH-xvi
            onPress={() => {
              navigation.navigate('MainNotifications');
            }}>
            <Icon assetName="notifycation" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('MainChat', { _id: null });
            }}>
            <Icon assetName="chat" size={20} />
          </TouchableOpacity>
        </View>
      </Animated.View>
      <ListPost idUser={idUser} scrollY={scrollY} gotoDetail={gotoDetail} />
      <Modal visible={showNotiAdmin?.length !== 0} statusBarTranslucent transparent>
        <View flex bg-tr_black center>
          <View center marginH-10 bg-white br30 padding-10 style={{ elevation: 20, width: '98%', maxHeight: '90%' }}>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
              <View center padding-10>
                <LottieView source={lottie.Noti} style={{ width: 200, height: 200 }} loop autoPlay />
                <View padding-10 row>
                  <Text center text50BO>{t("chat.app_noti")}</Text>
                </View>
                <Markdown style={styles.text}>
                  {showNotiAdmin?.body}
                </Markdown>
              </View>
            </ScrollView>
            <TouchableOpacity marginT-40 style={{ width: '100%' }} centerH br100 marginH-10 padding-10 bg-yellow onPress={() => { setshowNotiAdmin('') }}>
              <Text text65BO color='white'>{t("chat.allow")}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  name: {

    fontFamily: 'Inter-SemiBoldItalic',
    fontSize: 16,
  },
  header: {
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  text: {
    text: {
      color: 'black',
    },
  }
});
