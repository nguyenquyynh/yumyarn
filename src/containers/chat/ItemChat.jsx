import {StyleSheet} from 'react-native';
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native-ui-lib';
import CustomCirlceOnline from './CustomCirlceOnline';
import {changeTime, transDate} from 'components/commons/ChangeMiliTopDate';
import {useNavigation} from '@react-navigation/native';

const ItemChat = props => {
  const {item} = props;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chating', {friend: item})}
      style={styles.container}>
      <View style={styles.styleIcon}>
        <Image source={{uri: item?.avatar}} style={styles.styleIcon} />
        {item?.isOnline && <CustomCirlceOnline />}
      </View>
      <View style={{flex: 1}}>
        <Text text80BO numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.textGray}>{item.latestMessage}</Text>
      </View>
      <View
        style={{
          width: 100,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
        }}>
        <Text style={styles.textGray}>
          {changeTime(transDate(item.latestTimestamp))}
        </Text>
        {item?.countSeen ? (
          <View style={styles.containerSeen}>
            <Text style={styles.textSeen}>{item?.countSeen}</Text>
          </View>
        ) : (
          <Text></Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textSeen: {
    color: 'white',
    lineHeight: 16,
  },
  containerSeen: {
    borderRadius: 360,
    backgroundColor: 'red',
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGray: {
    color: 'rgba(0, 0, 0, 0.4)',
  },
  styleIcon: {
    width: 50,
    height: 50,
    borderRadius: 360,
  },
  container: {
    marginVertical: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export default ItemChat;
