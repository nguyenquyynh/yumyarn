import {LayoutAnimation, StyleSheet} from 'react-native';
import React, {memo, useState} from 'react';
import {
  changeTime,
  formatDate,
  transDate,
} from 'components/commons/ChangeMiliTopDate';
import {Text, TouchableOpacity, View} from 'react-native-ui-lib';

const ItemChating = memo(props => {
  const {item, user, friend} = props;
  const [showTime, setshowTime] = useState(false);
  return (
    <TouchableOpacity marginT-10 onPress={() => {
      setshowTime(!showTime);
      LayoutAnimation.easeInEaseOut()
    }}>
      {showTime && (
        <Text marginB-5 style={{textAlign: 'center'}}>
          {formatDate(item.create_at)}
        </Text>
      )}
      <View
        style={[
          styles.container,
          {
            backgroundColor: user._id == item.create_by ? '#4C4C4C' : '#F8C630',
            alignItems: user._id == item.create_by ? 'right' : 'left',
            alignSelf: user._id == item.create_by ? 'flex-end' : 'flex-start',
            borderTopEndRadius: user._id == item.create_by ? 0 : 30,
            borderTopStartRadius: user._id == item.create_by ? 30 : 0,
          },
        ]}>
        <Text
          marginT-5
          style={{
            textAlign: user._id == item.create_by ? 'left' : 'right',
            color: 'white',
          }}>
          {item.content}
        </Text>
      </View>
      {showTime && user._id === item.create_by && (
        <Text
          style={{textAlign: user._id == item.create_by ? 'right' : 'left'}}>
          {item?.seen && friend?.message_reading_status && user?.message_reading_status
            ? 'Đã xem'
            : 'Đã gửi ' + changeTime(transDate(item.create_at))}
        </Text>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    maxWidth: 260,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    padding: 10,
  },
});

export default ItemChating;
