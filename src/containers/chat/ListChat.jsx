import React from 'react';
import ItemChat from './ItemChat';
import {Text, View} from 'react-native-ui-lib';
import {ActivityIndicator, FlatList, RefreshControl} from 'react-native';

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
          if (!loading) {
            getListMessage(page + 1);
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => refeshListMessage()}
          />
        }
        ListEmptyComponent={() => (
          <>
            {loading ? (
              <ActivityIndicator size="large" color="#0313fc" />
            ) : (
              <Text>Rất tiếc không tìm thấy bạn của bạn </Text>
            )}
          </>
        )}
      />
    </View>
  );
};

export default ListChat;
