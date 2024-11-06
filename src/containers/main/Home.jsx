import {
  Animated,
  StyleSheet,
} from 'react-native';
import React, { memo } from 'react';
import { Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import ListPost from 'containers/post/ListPost';
import Avatar from 'components/Avatar';

const Home = () => {
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth.user);
  const name = auth?.name?.split(' ')[0];
  const idUser = auth._id;
  //Animated header
  const scrollY = new Animated.Value(0);
  const diffclamp = Animated.diffClamp(scrollY, 0, 50);
  const tranSlateY = diffclamp.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
  });
  function handlerSearch() {
    navigation.navigate('Search');
  }
  function handlerCreatePost() {
    navigation.navigate('Post');
  }

  return (
    <View flex bg-white>
      <Animated.View
        style={[styles.header, { transform: [{ translateY: tranSlateY }] }]}>
        <View row centerV>
          <Avatar source={{ uri: auth.avatar }} size={40} onPress={() => { }} />
          <Text style={styles.name}>{name}</Text>
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
      <ListPost idUser={idUser} scrollY={scrollY} />
    </View>
  );
};

export default memo(Home);

const styles = StyleSheet.create({
  name: {
    marginHorizontal: 10,
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
});
