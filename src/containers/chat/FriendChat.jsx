import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import React from 'react';
import ItemFriendChat from './ItemFriendChat';

const FriendChat = props => {
  const {listFriend} = props;

  return (
    <FlatList
      data={listFriend}
      horizontal={true}
      style={{maxHeight: 91, marginLeft: 20}}
      keyExtractor={item => item._id}
      renderItem={({item}) => <ItemFriendChat item={item} />}
      ListEmptyComponent={<ActivityIndicator size="large" color="#0313fc" />}
    />
  );
};

export default FriendChat;
