import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import Avatar from 'components/Avatar';
import {Colors, Icon, Text, TouchableOpacity, View} from 'react-native-ui-lib';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {t} from 'lang';
import numberFormat from 'configs/ui/format';
import ListMediaProfile from 'components/profile/ListMediaProfile';
import {findUser, getTimeline} from 'src/hooks/api/profile';
import {BI, I, SBI} from 'configs/fonts';
import Animated from 'react-native-reanimated';
import Wapper from 'components/Wapper';
import {
  checkFollowerProfile,
  createFollow,
  unFollow,
} from 'src/hooks/api/follow';
import Modals from 'components/BottomSheetApp';
import {ReportModel} from 'src/hooks/api/Model';
import ButtonApp from 'components/ButtonApp';
import {createReport} from 'src/hooks/api/post';
import LoadingApp from 'components/commons/LoadingApp';
import ModalFollowSuccess from 'components/profile/ModalFollowSuccess';

const screenwidth = Dimensions.get('window').width;
const screenheight = Dimensions.get('window').height;
const OtherProfile = ({route}) => {
  const {name, _id, id} = route.params;
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth.user);
  const timeout = useRef(null);

  const [refreshing, setRefreshing] = useState(false);
  const [data, setdata] = useState([]);
  const [load, setLoad] = useState(true);
  const [dataUser, setDataUser] = useState({});
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [statusFollow, setStatusFollow] = useState(false);
  const [report, setReport] = useState(false);
  const [statusFollowSuccess, setFollowSuccess] = useState(false);

  async function loadTimeline(option) {
    switch (option) {
      case 'refress':
        const refress = await getTimeline({
          user: _id ? _id : id,
          page: 1,
        });
        if (refress.status) {
          setdata([...refress.data]);
        }
        break;

      default:
        const resault = await getTimeline({
          user: _id ? _id : id,
          page: Math.ceil(data.length / 10) + 1,
        });

        if (resault.status && resault.data.length > 0) {
          setdata([...data, ...resault.data]);
        }
        setLoad(false);
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
      const result = await createFollow(auth._id, _id ? _id : id);
      if (result.status) {
        setStatusFollow(true);
        setFollowSuccess(true);
      }
    } catch (error) {
      console.log('ERROR getIdUser ', error);
    }
  };

  const handleUnFollow = async () => {
    try {
      const body = {
        user: auth._id,
        follower: _id ? _id : id,
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
        follower: _id ? _id : id,
      };
      const result = await checkFollowerProfile(body);
      if (result.status) {
        setStatusFollow(true);
      }
    } catch (error) {
      console.log('ERROR getIdUser ', error);
    }
  };
  const handleReport = async e => {
    const resault = await createReport({
      id_user: _id ? _id : id,
      content: e.content,
    });
    if (resault?.status) {
      ToastAndroid.show(t('error.reporting'), ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(t(resault?.data), ToastAndroid.SHORT);
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
        _id: _id ? _id : id,
      };
      const result = await findUser(query);
      if (result.status) {
        console.log(result);
        setDataUser(result.data);
        navigation.getParent()?.setParams({id: null});
      }
    } catch (error) {
      console.log('ERROR getIdUser ', error);
    }
  };

  const customRight = () => {
    if (auth?._id !== _id ? _id : id) {
      return (
        <ButtonApp
          title={t('post.report')}
          onclick={() => {
            setReport(true);
          }}
        />
      );
    }
  };

  const onLottieSuccess = () => {
    setFollowSuccess(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoadingScreen(true);
      await getIdUser();
      await checkFollower();
      await loadTimeline('refress');
      setLoadingScreen(false);
    };
    fetchData();
  }, [name, _id, id]);

  return (
    <Wapper
      renderleft
      funtleft={() => navigation.goBack()}
      title={!dataUser ? name : ''}
      customright={customRight}>
      {loadingScreen ? (
        <LoadingApp loading={loadingScreen} />
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
              <Animated.View style={[{zIndex: 1}, styles.avatar]}>
                <Avatar
                  source={{
                    uri: dataUser?.avatar,
                  }}
                  size={100}
                />
              </Animated.View>
              <View bg-puper style={styles.background}>
                <View row spread padding-x>
                  <TouchableOpacity
                    flex
                    center
                    onPress={() =>
                      navigation.navigate('FollowerList', {
                        user: _id ? _id : id,
                        statusView: false,
                      })
                    }>
                    <Text text70BO style={styles.numbercard}>
                      {numberFormat(dataUser.count_followers)}
                    </Text>
                    <Text ixtext style={styles.numbercard}>
                      {t('profile.followers')}
                    </Text>
                  </TouchableOpacity>
                  <View flex />
                  <TouchableOpacity
                    flex
                    center
                    onPress={() =>
                      navigation.navigate('FollowingList', {
                        user: _id ? _id : id,
                        statusView: false,
                      })
                    }>
                    <Text text70BO style={styles.numbercard}>
                      {numberFormat(dataUser?.count_following)}
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
                  <View row spread width={300} style={styles.view_opaticy}>
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
      <Modals modalhiden={setReport} modalVisible={report}>
        <View>
          <Text center margin-10 text80BO>
            {t('post.report_d')}
          </Text>
          <FlatList
            scrollEnabled={false}
            data={optionReport}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  handleReport(item);
                  setReport(false);
                }}
                spread
                row
                centerV
                paddingV-15
                paddingH-16>
                <Text text80BO>{item?.value}</Text>
                <Icon assetName="right_arrow" size={15} />
              </TouchableOpacity>
            )}
          />
        </View>
      </Modals>
      {statusFollowSuccess && (
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            height: screenheight,
            width: screenwidth,
            position: 'absolute',
          }}>
          <ModalFollowSuccess
            statusFollowSuccess={statusFollowSuccess}
            onLottieSuccess={onLottieSuccess}
          />
        </View>
      )}
    </Wapper>
  );
};

export default OtherProfile;

const styles = StyleSheet.create({
  view_opaticy: {
    alignSelf: 'center',
  },
  opacity: {
    width: 130,
  },
  scroll: {width: '100%', height: '100%', position: 'absolute', bottom: 0},
  background: {
    width: '100%',
    position: 'relative',
    top: -50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  avatar: {
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 360,
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

var optionReport = [
  {
    id: 1,
    value: 'Người dùng này giả mạo tổ chức khác.',
    content: ReportModel.WAR,
  },
  {
    id: 2,
    value: 'Đăng tải các hình ảnh nhạy cảm 18+.',
    content: ReportModel.NFSW,
  },
  {
    id: 3,
    value:
      'Đăng tải các bài viết liên quan đển an toàn trẻ dưới vị thành niên.',
    content: ReportModel.KID,
  },
  {
    id: 4,
    value: 'Nội dung chia rẽ sắc tộc, tôn giáo.',
    content: ReportModel.RELIGION,
  },
  {
    id: 5,
    value: 'Người này là thuộc thành phần thù địch.',
    content: ReportModel.SUCK,
  },
  {
    id: 6,
    value: 'Đăng tải các nội dung không đúng sự thật.',
    content: ReportModel.FAKE,
  },
];
