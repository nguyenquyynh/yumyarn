import {
  View,
  Keyboard,
  TextInput,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {getOldMessage, seenMessage} from 'src/hooks/api/message';
import {Icon, Image, Text} from 'react-native-ui-lib';
import ItemChating from './ItemChating';
import CustomCirlceOnline from './CustomCirlceOnline';
import {useNavigation} from '@react-navigation/native';
import {changeTime, transDate} from 'components/commons/ChangeMiliTopDate';

const Chating = ({route}) => {
  const {friend} = route.params;
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user._id);
  const socket = useSelector(state => state.fcm.socket);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const refScoll = useRef(null);
  const [listMessage, setlistMessage] = useState([]);
  const [friendIsWritting, setfriendIsWritting] = useState(false);
  const lastTimeOnline = friend?.lastOnline
    ? changeTime(transDate(friend?.lastOnline))
    : '';

  const scroll = () => {
    if (refScoll?.current) {
      refScoll.current?.scrollToEnd({animated: true});
    }
  };

  const getMessage = async () => {
    try {
      if (!isLoading) {
        setIsLoading(true);
        const response = await getOldMessage(
          listMessage?.length > 0 ? listMessage[0]._id : null,
          user,
          friend._id,
        );

        if (response.status) {
          const reversedData = [...response?.data].reverse();
          setlistMessage(prev => [...reversedData, ...prev]);
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
      await seenMessage(user, friend._id);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = () => {
    try {
      if (message && message.trim()) {
        const data = {
          receiveName: friend._id,
          sendderName: user,
          content: message,
        };
        socket.emit('send_message', data);
        setlistMessage(prev => [
          ...prev,
          {
            content: message,
            receive_user: friend._id,
            create_by: user,
            _id: (listMessage?.length + 1).toString(),
            create_at: new Date().getMilliseconds(),
          },
        ]);
        setMessage('');
        scroll();
      } else {
        Alert.alert('Thông báo', 'không được bỏ trống tin nhắn');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    hanldeseenAllMessage();
    getMessage();
    socket.on('receive_message', data => {
      setlistMessage(prev => [...prev, data]);
      scroll();
    });

    socket.emit('onChat', {userId: user, friend: friend._id});
    socket.on('CheckIsWritting', data => {
      if(data.user == friend._id){
        setfriendIsWritting(data.data);
      }
    });

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        socket.emit('isWritting', {receiveName: friend._id, userId: user});
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        socket.emit('isNotWritting', {receiveName: friend._id, userId: user});
      },
    );

    return () => {
      socket.emit('outChat', {userId: user});
      socket.off('receive_message');
      socket.off('CheckIsWritting');
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if(listMessage <=20){
      scroll();
    }
  }, [refScoll, listMessage, isLoading]);

  return (
    <View style={{position: 'relative', flex: 1}}>
      <View style={styles.containerIcon}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon assetName="back" size={30} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchProfile}>
          <View style={styles.outlineImage}>
            <Image source={{uri: friend?.avatar}} style={styles.image} />
            {friend?.isOnline && <CustomCirlceOnline />}
          </View>
          <View style={{justifyContent: 'space-between'}}>
            <Text text80BO>{friend.name}</Text>
            <Text>
              {friend.isOnline ? 'Online' : 'Offline ' + lastTimeOnline}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={refScoll}
        data={listMessage}
        keyExtractor={item => item._id}
        renderItem={({item}) => <ItemChating item={item} user={user} />}
        contentContainerStyle={{
          paddingHorizontal: 20,
          justifyContent: 'flex-end',
          minHeight: '100%',
        }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => getMessage()}
          />
        }
      />

      <View style={styles.containerChat}>
        {friendIsWritting && (
          <Text style={{position: 'absolute', top: 0, left: 20}}>
            {friend.name} đang nhập...
          </Text>
        )}
        <TextInput
          style={styles.chatInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Nhập tin nhắn"
        />
        <TouchableOpacity style={styles.containerSend} onPress={sendMessage}>
          <Icon assetName="send_message" size={25} />
        </TouchableOpacity>
      </View>
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
  image: {
    width: 50,
    height: 50,
    borderRadius: 360,
  },
  containerIcon: {
    height: 50,
    marginTop: 50,
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    maxHeight: 50,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#E5E1E1',
  },
  containerSend: {
    width: 50,
    height: 50,
    borderRadius: 360,
    backgroundColor: '#F8C630',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chating;
