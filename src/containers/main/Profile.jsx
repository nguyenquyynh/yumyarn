import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Image, Text, View, TouchableOpacity, Colors } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Avatar from 'components/Avatar';
import { getTimeline, findUser } from 'src/hooks/api/profile';
import { t } from 'lang';
import numberFormat from 'configs/ui/format';
import { Edit, Users, ImageUp, UserCheck, UserPlus, MessageCircle, Flag } from 'lucide-react-native';
import RenderMedia from 'components/commons/RenderMedia';
import TextApp from 'components/commons/TextApp';
import LottieView from 'lottie-react-native';
import lottie from 'configs/ui/lottie';

const Profile = () => {
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth.user);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataUser, setDataUser] = useState({});
  const timeout = useRef(null);

  async function loadTimeline(option) {
    switch (option) {
      case 'refress':
        const refress = await getTimeline({
          user: auth?._id,
          page: 1,
        });
        if (refress.status) {
          setData(refress.data);
          setPage(1)
          setRefreshing(false)
        }
        break;

      default:
        if (!page) {
          break
        }
        const resault = await getTimeline({
          user: auth?._id,
          page: page + 1,
        });
        if (resault.status && resault.data.length > 0) {
          setData(pver => [...pver, ...resault.data]);
          setPage(page + 1)
        } else {
          setData(pver => [...pver, ...resault.data]);
          setPage(null)
        }
        setLoading(false)
        break;
    }
  }

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

  // Handle load more data when scrolling
  const handleScroll = useCallback(event => {
    clearTimeout(timeout.current);
    const { contentOffset, contentSize } = event.nativeEvent;
    const { height: windowHeight } = Dimensions.get('window');
    if (contentOffset.y + windowHeight > contentSize.height) {
      if (!page) return; // No more pages to load
      timeout.current = setTimeout(() => {
        setLoading(true)
        loadTimeline();
      }, 1000);
    }
  }, [page]);

  // Fetch user data
  const getIdUser = async () => {
    try {
      const result = await findUser({ _id: auth._id });
      if (result.status) {
        setDataUser(result.data);
      }
    } catch (error) {
      console.log('Error getting user data:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await getIdUser();
      await loadTimeline('refress');
    };
    init();
  }, []);

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
        <Image source={{ uri: dataUser?.coverPhoto }} style={styles.coverImage} />
        <View row>
          <Avatar size={100} source={{ uri: dataUser?.avatar }} style={styles.profileImage} />
          <View marginL-130 padding-5>
            <Text text65BO color={Colors.yellow}>{dataUser?.name}</Text>
            <Text>@{dataUser?.tagName}</Text>
          </View>
        </View>
        <TouchableOpacity bg-tr_black br40
          style={{ position: 'absolute', top: 10, right: 10 }}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Edit size={25} color={Colors.yellow} style={{ margin: 5 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.userInfo} marginV-5>
        <Text style={styles.userStory}>{dataUser.story}</Text>
      </View>
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
          ListEmptyComponent={() => <View flex center >
            <LottieView autoPlay loop source={lottie.Nodata} style={{ width: 100, height: 100 }} />
          </View>}
        />
      </View>
    </ScrollView>
  );
};

export default memo(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 200,
  },
  coverImage: {
    width: '100%',
    height: 150,
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
    paddingHorizontal: 15,
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
