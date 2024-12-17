import {Alert, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import {Text, View} from 'react-native-ui-lib';
import Wapper from 'components/Wapper';
import {t} from 'lang';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import FriendChat from './FriendChat';
import {useSelector} from 'react-redux';
import {getFriend, getListFriendMessage} from 'src/hooks/api/message';
import ListChat from './ListChat';

const MainChat = ({route}) => {
  const navigation = useNavigation();
  const userId = useSelector(state => state.auth.user._id);
  const socket = useSelector(state => state.fcm.socket);
  const [listFriend, setListFriend] = useState([]);
  const [listMessage, setListMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [endFriend, setEndFriend] = useState(false);
  const [endMessage, setEndMessage] = useState(false);
  const getListFriend = async () => {
    try {
      if (!endFriend) {
        const response = await getFriend(userId);
        if (response.status && response.data.length > 0) {
          setListFriend(response.data);
          socket.emit('listOnlineFriend', {
            listFriend: response.data,
          });
        } else {
          setEndFriend(true);
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Vui lòng reloa lại');
    }
  };

  const getListMessage = async page => {
    try {
      if (!endMessage) {
        setLoading(true);
        const response = await getListFriendMessage(userId, page);
        if (response.status && response.data.length > 0) {
          setListMessage(prev => [...prev, ...response.data]);
          socket.emit('listOnlineMessage', {
            listFriend: [...listMessage, ...response.data],
          });
          setPage(page);
        } else {
          setEndMessage(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const refeshListMessage = async () => {
    try {
      setLoading(true);
      const response = await getListFriendMessage(userId, 0);
      if (response.status) {
        setListMessage(response.data);
        socket.emit('listOnlineMessage', {
          listFriend: response.data,
        });
        if (route.params?._id) {
          navigation.replace('Chating', {
            friend: response.data?.find(item => item._id === route.params?._id),
          });
        }
        setPage(0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getListFriend();
      refeshListMessage();
    }, []),
  );

  useEffect(() => {
    socket.on('getOnlineFriend', data => {
      setListFriend(data);
    });
    socket.on('getOnlineMessage', data => {
      setListMessage(data);
    });

    return () => {
      socket.off('getOnlineFriend');
      socket.off('getOnlineMessage');
    };
  }, []);
  return (
    <Wapper
      renderleft
      funtleft={() => navigation.navigate('Main')}
      title={t('chat.title')}>
      <View flex bg-white gap-8>
        {!socket && (
          <View padding bg-red50>
            <Text center>{t('app.discconect')}</Text>
          </View>
        )}
        <FriendChat listFriend={listFriend} loading={loading} />

        <ListChat
          listMessage={listMessage}
          loading={loading}
          getListMessage={getListMessage}
          refeshListMessage={refeshListMessage}
          page={page}
        />
      </View>
    </Wapper>
  );
};

export default MainChat;

const styles = StyleSheet.create({});
