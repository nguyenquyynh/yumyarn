import {View, Text, StyleSheet} from 'react-native';
import React, {memo} from 'react';

const ItemChating = memo(props => {
  const {item, user} = props;
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: user == item.create_by ? '#4C4C4C' : '#F8C630',
          alignItems: user == item.create_by ? 'right' : 'left',
          alignSelf: user == item.create_by ? 'flex-end' : 'flex-start',
          borderTopEndRadius: user == item.create_by ? 0 : 30,
          borderTopStartRadius: user == item.create_by ? 30 : 0,
        },
      ]}>
      <Text
        style={{
          textAlign: user == item.create_by ? 'right' : 'left',
          color: 'white',
        }}>
        {item.content}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    maxWidth: 260,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    padding: 10,
  },
});

export default ItemChating;
