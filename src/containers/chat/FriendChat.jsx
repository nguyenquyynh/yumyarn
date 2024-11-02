import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import React from 'react';
import ItemFriendChat from './ItemFriendChat';

const FriendChat = props => {
  const {listFriend, loading} = props;

  return (
    <FlatList
      data={listFriend}
      horizontal={true}
      style={{minHeight: 91, marginLeft: 20, maxHeight: 91}}
      keyExtractor={item => item._id}
      renderItem={({item}) => <ItemFriendChat item={item} />}
      ListEmptyComponent={() => (
        <>{loading && <ActivityIndicator size="large" color="#0313fc" />}</>
      )}
    />
  );
};

export default FriendChat;
