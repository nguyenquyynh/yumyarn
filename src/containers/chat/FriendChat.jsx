import { FlatList, ActivityIndicator } from 'react-native';
import React from 'react';
import ItemFriendChat from './ItemFriendChat';
import { Colors, Text, View } from 'react-native-ui-lib';
import { t } from 'lang';

const FriendChat = props => {
  const { listFriend, loading } = props;

  return (
    <FlatList
      data={listFriend}
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      style={{ minHeight: 91, paddingLeft: 10, maxHeight: 91}}
      keyExtractor={item => item._id}
      renderItem={({ item }) => <ItemFriendChat item={item} />}
      ListEmptyComponent={() => (
        <>{loading && <ActivityIndicator size="large" color="#0313fc" />}
          {!listFriend.length && !loading && <View center>
            <Text center marginL-20 text80BO>{t("messenge.nofriends")}</Text>
            <Text center color={Colors.yellow} marginL-20 text80BO>{t("messenge.remember")}</Text>
          </View>}
        </>
      )}
    />
  );
};

export default FriendChat;
