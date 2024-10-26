import React from 'react';
import {StyleSheet} from 'react-native';
import {Image, Text, TouchableOpacity, View} from 'react-native-ui-lib';
import CustomCirlceOnline from './CustomCirlceOnline';
import {useNavigation} from '@react-navigation/native';
import { useSelector } from 'react-redux';

const ItemFriendChat = props => {
  const navigation = useNavigation();
  const {item} = props;
  const user = useSelector(state => state.auth.user);
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chating', {friend: item})}
      style={styles.container}>
      <View style={styles.outlineImage}>
        <Image source={{uri: item?.avatar}} style={styles.image} />
        {item?.isOnline &&
          item?.message_active_status &&
          user?.message_active_status && <CustomCirlceOnline />}
      </View>
      <Text numberOfLines={1} style={{width: 70}}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
    marginRight: 6,
  },
  outlineImage: {
    borderRadius: 360,
    borderColor: '#D9D9D9',
    borderWidth: 5,
    padding: 2,
    width: 70,
    height: 70,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 360,
  },
});

export default ItemFriendChat;
