import {
  StyleSheet,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text, View, Image, Button} from 'react-native-ui-lib';
import Wapper from 'components/Wapper';
import {t} from 'lang';
import {useNavigation} from '@react-navigation/native';
import UserRender from 'components/searchs/UserRender';
import {getFollowing} from 'src/hooks/api/follow';

const FollowingList = ({route}) => {
  // lấy danh sách theo user truyền vào còn kiểm tra có follow hay không theo view
  const {user, statusView} = route?.params || '';
  const navigation = useNavigation();
  const [followersData, setFollowersData] = useState([]);

  const getDataFollowing = async () => {
    try {
      const result = await getFollowing(user);
      if (result.status) {
        setFollowersData(result.data);
      } else {
        ToastAndroid.show(t('app.warning'), ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('getDataFollowing :', error);
    }
  };

  useEffect(() => {
    getDataFollowing();
  }, []);

  return (
    <Wapper
      renderleft
      funtleft={() => navigation.goBack()}
      title={t('profile.following')}>
      {!followersData ? (
        <View flex centerH centerV>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <View flex bg-white>
          {/* Sử dụng FlatList để hiển thị danh sách followers */}
          <FlatList
            data={followersData}
            keyExtractor={item => item._id} // Mỗi item cần có key duy nhất
            renderItem={({item}) => <UserRender statusView={statusView} item={item.follow_user} />} // Hiển thị từng user
            contentContainerStyle={{paddingVertical: 10}} // Đặt padding cho FlatList
          />
        </View>
      )}
    </Wapper>
  );
};

export default FollowingList;

const styles = StyleSheet.create({});
