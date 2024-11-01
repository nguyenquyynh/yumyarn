import React from 'react';
import ItemChat from './ItemChat';
import {Text, View} from 'react-native-ui-lib';
import {ActivityIndicator, Dimensions, FlatList, RefreshControl} from 'react-native';
import LottieView from 'lottie-react-native';
import lottie from 'configs/ui/lottie';

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
              <View
                center
                style={{
                  width: '100%',
                  marginTop: 150
                }}>
                <LottieView
                  source={lottie.Nodata}
                  loop={false}
                  autoPlay
                  style={{width: 150, height: 150}}
                />
              </View>
            )}
          </>
        )}
      />
    </View>
  );
};

export default ListChat;
