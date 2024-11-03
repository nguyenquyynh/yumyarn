import React, {useEffect, useState} from 'react';
import {
  Colors,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import Avatar from 'components/Avatar';
import {t} from 'lang';
import {checkFollowerProfile, createFollow} from 'src/hooks/api/follow';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const UserRender = ({item, statusView}) => {
  //statusView true/fasle kiểm tra trạng thái xem là xem người theo dõi hay đang xem đang theo dõi
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth.user);
  const user = useSelector(state => state.auth.user);
  const [isfollow, setIsfollow] = useState(null);

  const checkFollower = async () => {
    try {
      const body = {
        user: auth._id,
        follower: item._id,
      };
      const result = await checkFollowerProfile(body);
      if (result.status) {
        setIsfollow(true);
      }
    } catch (error) {
      console.log('ERROR getIdUser ', error);
    }
  };

  useEffect(() => {
    checkFollower();
  }, []);

  const styleButtonFollow = {
    backgroundColor: isfollow ? Colors.yellow : Colors.white,
    borderWidth: 1.5,
    borderColor: isfollow ? Colors.yellow : Colors.black,
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  };
  const handlerfollow = async () => {
    await createFollow(user._id, item?._id);
    setIsfollow(!isfollow);
  };
  return (
    <View bg-white padding-viii marginT-x centerV center spread>
      <View row>
        <TouchableOpacity
          row
          flex-3
          onPress={() =>
            navigation.navigate('OtherProfile', {name: item.name ,_id :item._id})
          }
        >
          <Avatar source={{uri: item?.avatar}} size={44} />
          <View paddingH-x flex>
            <Text text70BO numberOfLines={1} ellipsizeMode="tail">
              {item?.name}
            </Text>
            <Text
              text80L
              numberOfLines={1}
              ellipsizeMode="tail"
              color={Colors.black}>
              @{item?.tagName}
            </Text>
          </View>
        </TouchableOpacity>
        <View>
          {isfollow != null && statusView && (
            <TouchableOpacity onPress={handlerfollow} style={styleButtonFollow}>
              <Text color={isfollow ? Colors.white : Colors.yellow}>
                {isfollow ? t('app.following') : t('app.follow')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View bg-gray marginT-xv width={'90%'} height={1}></View>
    </View>
  );
};

export default UserRender;
