import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ToastAndroid,
} from 'react-native';
import { Image, Text, View, TouchableOpacity, Colors, Icon } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Avatar from 'components/Avatar';
import { getTimeline, findUser } from 'src/hooks/api/profile';
import { t } from 'lang';
import numberFormat from 'configs/ui/format';
import { Edit, Users, ImageUp, UserCheck, UserPlus, MessageCircle, Flag, Backpack, ChevronLeft } from 'lucide-react-native';
import RenderMedia from 'components/commons/RenderMedia';
import TextApp from 'components/commons/TextApp';
import LottieView from 'lottie-react-native';
import lottie from 'configs/ui/lottie';
import { ReportModel } from 'src/hooks/api/Model';
import Modals from 'components/BottomSheetApp';
import { DEFAULT } from 'src/data/default';
import { checkFollowerProfile, createFollow, unFollow } from 'src/hooks/api/follow';
import { createReport } from 'src/hooks/api/post';

const OtherProfile = ({ route }) => {
  const { name, _id, id } = route.params;
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth.user);
  const timeout = useRef(null);

  const [refreshing, setRefreshing] = useState(false);
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [dataUser, setDataUser] = useState({});
  const [statusFollow, setStatusFollow] = useState(false);
  const [report, setReport] = useState(false);

  async function loadTimeline(option) {
    switch (option) {
      case 'refress':
        const refress = await getTimeline({
          user: _id ? _id : id,
          page: 1,
        });
        if (refress.status) {
          setdata(refress.data);
          setPage(1)
          setRefreshing(false)
        }
        break;

      default:
        if (!page) {
          break
        }
        const resault = await getTimeline({
          user: _id ? _id : id,
          page: page + 1,
        });
        if (resault.status && resault.data.length > 0) {
          setdata(pver => [...pver, ...resault.data]);
          setPage(page + 1)
        } else {
          setdata(pver => [...pver, ...resault.data]);
          setPage(null)
        }
        setLoading(false)
        break;
    }
  }

  const handleScroll = useCallback(event => {
    clearTimeout(timeout.current);
    const { contentOffset, contentSize } = event.nativeEvent;
    const { height: windowHeight } = Dimensions.get('window');

    if (contentOffset.y + windowHeight > contentSize.height - 100) {
      if (!page) return;

      timeout.current = setTimeout(() => {
        setLoading(true)
        loadTimeline();
      }, 1000);
    }
  }, [page]);

  const handleFollow = async () => {
    try {
      const result = await createFollow(auth._id, _id ? _id : id);
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

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTimeline('refress');
      await getIdUser()
    } catch (error) {
      console.log(error);

    } finally { setRefreshing(false) }
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
    getIdUser()
  };

  const getIdUser = async () => {
    try {
      const query = {
        _id: _id ? _id : id,
      };
      const result = await findUser(query);
      if (result.status) {
        setDataUser(result.data);
        navigation.getParent()?.setParams({ id: null });
      }
    } catch (error) {
      console.log('ERROR getIdUser ', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getIdUser();
      await checkFollower();
      await loadTimeline('refress');
      setLoading(false);
    };
    fetchData();
  }, [name, _id, id]);

  const filterDataNoDuplicate = (list) => {
    return list.reduce((acc, current) => {
      // Kiểm tra xem _id đã có trong Set chưa
      if (!acc.ids.has(current._id)) {
        acc.ids.add(current._id);
        acc.result.push(current);
      }
      return acc;
    }, { ids: new Set(), result: [] }).result
  }

  return (
    <ScrollView style={styles.container} onScroll={state => handleScroll(state)} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image source={{ uri: dataUser?.coverPhoto || DEFAULT.COVER_PHOTO }} style={styles.coverImage} />
        <View row>
          <Avatar size={100} source={{ uri: dataUser?.avatar }} style={styles.profileImage} />
          <View marginL-130 padding-5>
            <Text text65BO color={Colors.yellow}>{dataUser?.name}</Text>
            <Text>@{dataUser?.tagName}</Text>
          </View>
        </View>
        <TouchableOpacity br20 bg-tr_black padding-5
          style={{ position: 'absolute', top: 40, left: 20 }}
          onPress={() => _id ? navigation.goBack() : navigation.replace('Main')}
        >
          <ChevronLeft size={25} color={Colors.yellow} />
        </TouchableOpacity>
      </View>

      <View style={styles.userInfo} marginV-5>
        <Text style={styles.userStory}>{dataUser.story}</Text>
      </View>
      {(auth?._id !== _id || auth?.id !== id) && <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleCheckPersonFollow(statusFollow)}>
          {statusFollow ? (
            <UserCheck color="#FFFFFF" size={24} />
          ) : (
            <UserPlus color="#FFFFFF" size={24} />
          )}
          <Text style={styles.actionButtonText}>
            {statusFollow ? t("app.following") : t("app.follow")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}
          onPress={() => {
            navigation.navigate('Chating', { friend: dataUser });
          }}>
          <MessageCircle color="#FFFFFF" size={24} />
          <Text style={styles.actionButtonText}>{t("chat.title")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.reportButton]} onPress={() => setReport(true)}>
          <Flag color="#000000" size={24} />
        </TouchableOpacity>
      </View>}
      <View style={styles.statsContainer}>
        <TouchableOpacity flex-1
          style={styles.statItem}
          onPress={() => navigation.navigate('FollowerList', { user: dataUser._id, statusView: false })}
        >
          <Users color="#000000" size={24} />
          <Text style={styles.statNumber}>{numberFormat(dataUser.count_followers)}</Text>
          <TextApp style={styles.statLabel} text={'profile.followers'} />
        </TouchableOpacity>
        <TouchableOpacity flex-1
          style={styles.statItem}
          onPress={() => navigation.navigate('FollowingList', { user: dataUser._id, statusView: true })}
        >
          <Users color="#000000" size={24} />
          <Text style={styles.statNumber}>{numberFormat(dataUser.count_following)}</Text>
          <TextApp style={styles.statLabel} text={'profile.following'} />
        </TouchableOpacity>
        <TouchableOpacity flex-1 style={styles.statItem}>
          <ImageUp color="#000000" size={24} />
          <Text style={styles.statNumber}>{numberFormat(dataUser.count_post)}</Text>
          <TextApp style={styles.statLabel} text={'profile.postting'} />
        </TouchableOpacity>
      </View>

      <View style={styles.postsContainer}>
        <Text style={styles.sectionTitle}>{t("profile.near_post")}</Text>
        <FlatList
          data={filterDataNoDuplicate(data)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.postImage} onPress={() => {
              navigation.navigate('PostDetail', { id: item._id, defaultdata: item })
            }}>
              <RenderMedia item={item?.media[0]} i={item?._id} />
            </TouchableOpacity>
          )}
          keyExtractor={item => item._id}
          numColumns={3}
          scrollEnabled={false}
          ListFooterComponent={() => <View padding-10>
            {loading ? <ActivityIndicator size={30} /> : !page && <TextApp style={{ fontSize: 14, textAlign: 'center' }} text={'profile.end_list'} />}
          </View>}
          ListEmptyComponent={() => <View flex center marginT-50>
            {(!data.length && !page) && <LottieView autoPlay loop source={lottie.Nodata} style={{ width: 100, height: 100 }} />}
          </View>}
        />
      </View>
      <Modals modalhiden={setReport} modalVisible={report}>
        <View>
          <Text center margin-10 text80BO>
            {t('post.report_d')}
          </Text>
          <FlatList
            scrollEnabled={false}
            data={optionReport}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
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
    </ScrollView>
  );
};

export default OtherProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 250,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  profileImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    position: 'absolute',
    bottom: 0,
    left: 20,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    marginHorizontal: 17,
    alignItems: 'left',
  },
  userStory: {
    fontSize: 15,
    color: '#000000',
    marginTop: 20,
    textAlign: 'left',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F8C630',
    paddingVertical: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#000000',
  },
  postsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  postImage: {
    width: '33%',
    aspectRatio: 1,
    margin: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8C630',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  reportButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
  },
  reportButtonText: {
    color: '#000000',
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
