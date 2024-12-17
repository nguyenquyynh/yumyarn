import {
  Keyboard,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  LayoutAnimation,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {getOldMessage, seenMessage} from 'src/hooks/api/message';
import {Icon, Image, Text, View} from 'react-native-ui-lib';
import Avatar from 'components/Avatar';
import ItemChating from './ItemChating';
import CustomCirlceOnline from './CustomCirlceOnline';
import {useNavigation} from '@react-navigation/native';
import {changeTime, transDate} from 'components/commons/ChangeMiliTopDate';
import NotificationModalApp from 'components/commons/NotificationModalApp';
import {t} from 'lang';

const Chating = ({route}) => {
  const {friend} = route.params;
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);
  const socket = useSelector(state => state.fcm.socket);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const refScoll = useRef(null);
  const [listMessage, setlistMessage] = useState([]);
  const [friendIsWritting, setfriendIsWritting] = useState(false);
  const lastTimeOnline = friend?.lastOnline
    ? changeTime(transDate(friend?.lastOnline))
    : '';
  const [showModal, setshowModal] = useState(false);
  const [end, setEnd] = useState(false);

  const getMessage = async listMessage => {
    try {
      await setIsLoading(true);
      if (!isLoading && !end) {
        const response = await getOldMessage(
          listMessage?.length > 0
            ? listMessage[listMessage.length - 1]._id
            : null,
          user._id,
          friend._id,
        );
        if (
          response.status &&
          response.data[response.data.length - 1]?._id !=
            listMessage[listMessage.length - 1]?._id
        ) {
          if (response.data.length === 0) {
            setEnd(true);
          }
          await setlistMessage(prev => [...prev, ...response?.data]);
        }

        if (
          response.data.length === 0 &&
          listMessage.length === 0 &&
          ((friend?.message_recive_status == 'FRIEND' && !friend.isFriend) ||
            friend?.message_recive_status == 'NOBODY')
        ) {
          setshowModal(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const hanldeseenAllMessage = async () => {
    try {
      await seenMessage(user._id, friend._id);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = () => {
    try {
      if (message && message.trim()) {
        const data = {
          receiveName: friend._id,
          sendderName: user._id,
          content: message,
        };
        socket.emit('send_message', data);
        setlistMessage(prev => [
          {
            content: message,
            receive_user: friend._id,
            create_by: user._id,
            _id: (listMessage?.length + 1).toString(),
            create_at: new Date().getTime(),
          },
          ...prev,
        ]);
        LayoutAnimation.easeInEaseOut();
        setMessage('');
        scrollToStart();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToStart = () => {
    if (refScoll.current)
      refScoll.current?.scrollToIndex({
        index: 0,
        animated: true,
        viewPosition: 0,
        viewOffset: 0,
      });
  };

  useEffect(() => {
    if (
      listMessage.length > 0 &&
      !listMessage[0]?.seen &&
      listMessage[0].receive_user == user._id
    ) {
      hanldeseenAllMessage();
    }
  }, [listMessage]);

  useEffect(() => {
    getMessage(listMessage);
    socket.on('receive_message', data => {
      setlistMessage(prev => [data, ...prev]);
      LayoutAnimation.easeInEaseOut();
    });

    socket.emit('onChat', {userId: user._id, friend: friend._id});
    socket.on('CheckIsWritting', data => {
      if (data.user == friend._id) {
        setfriendIsWritting(data.data);
      }
    });
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        socket.emit('isWritting', {receiveName: friend._id, userId: user._id});
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        socket.emit('isNotWritting', {
          receiveName: friend._id,
          userId: user._id,
        });
      },
    );
    return () => {
      socket.emit('outChat', {userId: user._id});
      socket.off('receive_message');
      socket.off('CheckIsWritting');
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const renderFooter = () => {
    if (!isLoading) return null;
    return <ActivityIndicator animating size="large" />;
  };

  return (
    <View style={{position: 'relative', flex: 1, backgroundColor: 'white'}}>
      <View style={styles.shadowContainer}>
        <View style={styles.containerIcon}>
          <TouchableOpacity onPress={() => navigation.replace('MainChat')}>
            <Icon assetName="back" size={22} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touchProfile}
            onPress={() =>
              navigation.navigate('OtherProfile', {
                name: friend?.name,
                _id: friend?._id,
              })
            }>
            <View style={styles.outlineImage}>
              <Avatar
                onPress={() =>
                  navigation.navigate('OtherProfile', {
                    name: friend?.name,
                    _id: friend?._id,
                  })
                }
                source={{uri: friend?.avatar}}
                size={50}
              />
              {friend?.isOnline &&
                friend?.message_active_status &&
                user?.message_active_status && <CustomCirlceOnline />}
            </View>
            <View style={{justifyContent: 'space-between'}}>
              <Text text80BO>{friend.name}</Text>
              {friend?.message_active_status && user?.message_active_status && (
                <Text>
                  {friend.isOnline ? 'Online' : 'Offline ' + lastTimeOnline}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
        {!socket && (
          <View padding bg-red50>
            <Text center>{t('app.discconect')}</Text>
          </View>
        )}
      </View>
      <FlatList
        ref={refScoll}
        data={listMessage}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <ItemChating item={item} user={user} friend={friend} />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        onEndReached={async () =>
          listMessage.length >= 20 && (await getMessage(listMessage))
        }
        ListFooterComponent={renderFooter}
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        inverted={true}
      />

      <View style={styles.containerChat}>
        {friendIsWritting && (
          <Text style={{position: 'absolute', top: 0, left: 20}}>
            {friend.name} đang nhập...
          </Text>
        )}
        <TextInput
          readOnly={
            ((friend?.message_recive_status == 'FRIEND' && !friend.isFriend) ||
              friend?.message_recive_status == 'NOBODY') &&
            listMessage.length == 0
          }
          placeholderTextColor={'black'}
          style={styles.chatInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Nhập tin nhắn"
        />
        <TouchableOpacity style={styles.containerSend} onPress={sendMessage}>
          <Icon assetName="send_message" size={25} />
        </TouchableOpacity>
      </View>

      <NotificationModalApp
        modalVisible={showModal}
        title={'Thông báo'}
        content={'Người dùng đã tắt nhận tin nhắn từ người lạ'}
        asseticon={'dont'}
        cancel={false}
        funt={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  touchProfile: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineImage: {
    width: 50,
    height: 50,
    position: 'relative',
    borderRadius: 360,
  },
  containerIcon: {
    paddingTop: 35,
    paddingBottom: 15,
    paddingHorizontal: 20,
    gap: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10, // Cho Android
    backgroundColor: 'white',
  },
  containerChat: {
    flexDirection: 'row',
    width: '100%',
    padding: 20,
    gap: 10,
    position: 'relative',
  },
  chatInput: {
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#E5E1E1',
    color: 'black',
  },
  containerSend: {
    width: 50,
    borderRadius: 360,
    backgroundColor: '#F8C630',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chating;
