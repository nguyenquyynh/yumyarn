import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Avatar,
  Colors,
  Icon,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {t} from 'lang';
import numberFormat from 'configs/ui/format';
import ListMediaProfile from 'components/profile/ListMediaProfile';
import {finduser, getTimeline} from 'src/hooks/api/profile';
import Modals from 'components/BottomSheetApp';
import {BI, I, SBI} from 'configs/fonts';
import Animated from 'react-native-reanimated';
import Wapper from 'components/Wapper';
import {
  checkFollowerProfile,
  createFollow,
  unFollow,
} from 'src/hooks/api/follow';

const screenheight = Dimensions.get('window').height;
const screenwidth = Dimensions.get('window').width;
const OtherProfile = ({route}) => {
  const {name, _id} = route.params;
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth.user);
  const timeout = useRef(null);

  const [refreshing, setRefreshing] = useState(false);
  const [data, setdata] = useState([]);
  const [load, setLoad] = useState(true);
  const [dataUser, setDataUser] = useState({});
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [statusFollow, setStatusFollow] = useState(false);

  async function loadTimeline(option) {
    switch (option) {
      case 'refress':
        const refress = await getTimeline({
          user: _id,
          page: 1,
        });
        if (refress.status) {
          setdata([...refress.data]);
        }
        break;

      default:
        const resault = await getTimeline({
          user: _id,
          page: Math.ceil(data.length / 10) + 1,
        });
        if (resault.status) {
          setdata([...data, ...resault.data]);
          setLoad(false);
        }
        break;
    }
  }
  const handleScroll = useCallback(event => {
    clearTimeout(timeout.current);
    const {contentOffset, contentSize} = event.nativeEvent;
    const {height: windowHeight} = Dimensions.get('window');
    if (contentOffset.y + windowHeight > contentSize.height) {
      timeout.current = setTimeout(() => {
        setLoad(true);
        loadTimeline();
      }, 1000);
    }
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadTimeline('refress');
      setRefreshing(false);
    }, 1000);
  };

  const handleFollow = async () => {
    try {
      const result = await createFollow(auth._id, _id);
      if (result.status) {
        setStatusFollow(true);
      }
    } catch (error) {
      console.log('ERROR getIdUser ', error);
    }
  };

  const handleUnFollow = async () => {
    try {
      const body = {
        user: auth._id,
        follower: _id,
      };
      const result = await unFollow(body);
      if (result.status) {
        setStatusFollow(false);
      }
    } catch (error) {
      console.log('ERROR getIdUser ', error);
    }
  };

  const checkFollower = async () => {
    try {
      const body = {
        user: auth._id,
        follower: _id,
      };
      const result = await checkFollowerProfile(body);
      if (result.status) {
        console.log('follow success');
        setStatusFollow(true);
      }
    } catch (error) {
      console.log('ERROR getIdUser ', error);
    }
  };

  const handleCheckPersonFollow = async statusFollow => {
    if (statusFollow) {
      await handleUnFollow();
    } else {
      await handleFollow();
    }
  };

  const getIdUser = async () => {
    try {
      const query = {
        _id: _id,
      };
      const result = await finduser(query);
      console.log(result.status);

      if (result.status) {
        setDataUser(result.data);
      }
    } catch (error) {
      console.log('ERROR getIdUser ', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingScreen(true);
      await getIdUser();
      await checkFollower();
      await loadTimeline();
      setLoadingScreen(false);
    };
    fetchData();
  }, []);

  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={name}>
      {loadingScreen ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <View flex bg-white>
          <ImageBackground
            style={{width: '100%', height: 210}}
            source={{
              uri:
                dataUser?.coverPhoto ||
                'https://cdn.pixabay.com/photo/2024/09/25/15/53/japan-9074037_1280.jpg',
            }}
          />
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onScroll={state => handleScroll(state)}>
            <View centerH paddingT-120>
              <Animated.View style={{zIndex: 1}}>
                <Avatar
                  source={{
                    uri:
                      dataUser?.avatar ||
                      'https://cdn.pixabay.com/photo/2020/01/07/16/41/vietnam-4748105_1280.jpg',
                  }}
                  size={100}
                  imageStyle={styles.avatar}
                />
              </Animated.View>
              <View bg-puper style={styles.background}>
                <View row spread padding-x>
                  <TouchableOpacity
                    flex
                    center
                    onPress={() => navigation.navigate('FollowerList')}>
                    <Text text70BO style={styles.numbercard}>
                      {numberFormat(0)}
                    </Text>
                    <Text ixtext style={styles.numbercard}>
                      {t('profile.followers')}
                    </Text>
                  </TouchableOpacity>
                  <View flex />
                  <TouchableOpacity
                    flex
                    center
                    onPress={() => navigation.navigate('FollowerList')}>
                    <Text text70BO style={styles.numbercard}>
                      {numberFormat(0)}
                    </Text>
                    <Text ixtext style={styles.numbercard}>
                      {t('profile.following')}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View paddingH-l centerH>
                  <Text xviiiText style={styles.name}>
                    {dataUser.name}
                  </Text>
                  <Text marginB-xv style={styles.name}>
                    @{dataUser.tagName}
                  </Text>
                  {dataUser.story && (
                    <Text xivtext marginB-20 style={styles.story}>
                      {dataUser.story}
                    </Text>
                  )}
                </View>
                {_id !== auth._id && (
                  <View row spread style={styles.view_opaticy}>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={[styles.opacity, styles.shadowStyle]}
                      backgroundColor={'#5790DF'}
                      padding-10
                      center
                      br100
                      onPress={() => handleCheckPersonFollow(statusFollow)}>
                      <Text text80H color={Colors.white}>
                        {!statusFollow
                          ? t('app.follow')
                          : t('profile.following')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.6}
                      style={[styles.opacity, styles.shadowStyle]}
                      backgroundColor={Colors.white}
                      padding-10
                      center
                      br100
                      onPress={() => {
                        navigation.navigate('Chating', {friend: dataUser});
                      }}>
                      <Text text80H>{t('chat.title')}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <View
                  marginT-xx
                  br50
                  style={{width: '100%', height: '100%'}}
                  bg-white
                  padding-x>
                  <ListMediaProfile
                    data={data}
                    loadTimeline={loadTimeline}
                    load={load}
                    navigation={navigation}
                    refressTimeline={() => {
                      loadTimeline('refress');
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </Wapper>
  );
};

export default OtherProfile;

const styles = StyleSheet.create({
  view_opaticy: {
    paddingHorizontal: screenwidth * 0.15,
  },
  opacity: {
    width: 130,
  },
  scroll: {width: '100%', height: '100%', position: 'absolute', bottom: 0},
  background: {
    width: '100%',
    position: 'relative',
    top: -50,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  avatar: {
    borderColor: 'white',
    borderWidth: 3,
  },
  name: {
    fontFamily: BI,
  },
  story: {
    fontFamily: I,
    textAlign: 'center',
  },
  numbercard: {
    fontFamily: SBI,
    color: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowStyle: {
    shadowColor: '#000', // Màu đổ bóng
    shadowOffset: {width: 0, height: 2}, // Vị trí đổ bóng
    shadowOpacity: 0.25, // Độ mờ của đổ bóng
    shadowRadius: 3.84, // Độ lan tỏa của đổ bóng
    elevation: 5, // Độ cao (chỉ cho Android)
  },
});
