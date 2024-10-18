import {Alert, StyleSheet} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {View} from 'react-native-ui-lib';
import Wapper from 'components/Wapper';
import {t} from 'lang';
import {useNavigation} from '@react-navigation/native';
import FriendChat from './FriendChat';
import {useSelector} from 'react-redux';
import {getFriend, getListFriendMessage} from 'src/hooks/api/message';
import ListChat from './ListChat';

const MainChat = () => {
  const navigation = useNavigation();
  const userId = useSelector(state => state.auth.user._id);
  const socket = useSelector(state => state.fcm.socket);
  const [listFriend, setListFriend] = useState([]);
  const [listMessage, setListMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const getListFriend = async () => {
    try {
      const response = await getFriend(userId);
      if (response.status) {
        setListFriend(response.data);
        socket.emit('listOnlineFriend', {
          listFriend: response.data,
        });
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Vui lòng reloa lại');
    }
  };

  const getListMessage = async (page) => {
    try {
      setLoading(true);
      const response = await getListFriendMessage(
        userId,
        page,
      );
      if (response.status) {
        setListMessage(prev => [...prev, ...response.data]);
        socket.emit('listOnlineMessage', {
          listFriend: [...listMessage, ...response.data],
        });
        setPage(page)
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
        setPage(0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListFriend();
    refeshListMessage();
  }, []);

  useEffect(() => {
    socket.on('getOnlineFriend', data => {
      setListFriend(data);
    });
    socket.on('getOnlineMessage', data => {
      setListMessage(data);
    });

    socket.on('refesh_message', () => {
      refeshListMessage();
    });

    return () => {
      socket.off('getOnlineFriend');
      socket.off('getOnlineMessage');
      socket.off('refesh_message');
    };
  }, []);
  return (
    <Wapper
      renderleft
      funtleft={() => navigation.goBack()}
      title={t('chat.title')}>
      <View flex bg-white gap-8>
        <FriendChat listFriend={listFriend} loading={loading}/>
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
