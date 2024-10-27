import {StyleSheet, FlatList, ActivityIndicator, LayoutAnimation} from 'react-native';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native-ui-lib';
import Wapper from 'components/Wapper';
import {t} from 'lang';
import {useNavigation} from '@react-navigation/native';
import UserRender from '../../components/searchs/UserRender'; // Import component hiển thị từng user
import {getFollowers, getFollowing} from 'src/hooks/api/follow';

const FollowerList = ({route}) => {
  // lấy danh sách theo user truyền vào còn kiểm tra có follow hay không theo view
  const {user, view, statusView} = route?.params || '';
  const navigation = useNavigation();
  const [followersData, setFollowersData] = useState([]);  

  const getDataFollowers = async () => {
    try {
      const result = await getFollowers(user);
      if (result.status) {
        setFollowersData(result.data);
        LayoutAnimation.easeInEaseOut()
      } else {
        ToastAndroid.show(t('app.warning'), ToastAndroid.SHORT);
      }
      LayoutAnimation.easeInEaseOut()
    } catch (error) {
      console.log('getDataFollowers :', error);
    }
  };
  useEffect(() => {
    getDataFollowers();
  }, []);

  return (
    <Wapper
      renderleft
      funtleft={() => navigation.goBack()}
      title={t('profile.followers')}>
      <View flex bg-white>
        {followersData ? (
          <FlatList
            data={followersData}
            keyExtractor={item => item._id} // Mỗi item cần có key duy nhất
            renderItem={({item}) => <UserRender statusView={statusView} item={item.create_by} />} // Hiển thị từng user
            contentContainerStyle={{paddingVertical: 10}} // Đặt padding cho FlatList
          />
        ) : (
          <View flex centerH centerV>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    </Wapper>
  );
};

export default FollowerList;

const styles = StyleSheet.create({});
