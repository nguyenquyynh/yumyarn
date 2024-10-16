import React from 'react';
import ItemChat from './ItemChat';
import {Text, View} from 'react-native-ui-lib';
import {FlatList, RefreshControl} from 'react-native';

const ListChat = props => {
  const {listMessage, loading, getListMessage, refeshListMessage, page} = props;
  return (
    <View paddingH-20>
      <Text>Recent Chat</Text>
      <FlatList
        data={listMessage}
        keyExtractor={item => item._id}
        renderItem={({item}) => <ItemChat item={item} />}
        onEndReached={() => {
          if (!loading ) {
            getListMessage(page +1);
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => getListMessage(page +1)}
          />
        }
      />
    </View>
  );
};

export default ListChat;
