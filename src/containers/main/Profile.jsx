import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Colors,
  Icon,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import Avatar from 'components/Avatar';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { t } from 'lang';
import numberFormat from 'configs/ui/format';
import ListMediaProfile from 'components/profile/ListMediaProfile';
import { findUser, getTimeline } from 'src/hooks/api/profile';
import Modals from 'components/BottomSheetApp';
import { BI, I, SBI } from 'configs/fonts';
import Animated from 'react-native-reanimated';

const Profile = () => {
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth.user);
  const [data, setdata] = useState([]);
  const [page, setPage] = useState(1)
  const [showmodal, setShowmodal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [load, setLoad] = useState(true);
  const [dataUser, setDataUser] = useState([])
  const timeout = useRef(null);

  async function loadTimeline(option) {
    switch (option) {
      case 'refress':
        const refress = await getTimeline({
          user: auth._id,
          page: 1,
        });
        if (refress.status) {
          setdata([...refress.data]);
          setPage(1)
        }
        break;

      default:
        const resault = await getTimeline({
          user: auth._id,
          page: page + 1,
        });

        if (resault.status) {
          if (resault.data.length == 0) {
            setPage(null)
            setLoad(false)
            return
          }
          setPage(page + 1)
          setdata([...data, ...resault.data]);
          setLoad(false);
        }
        break;
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTimeline('refress');
    setRefreshing(false);
  };
  const handleScroll = useCallback(event => {
    clearTimeout(timeout.current);
    const { contentOffset, contentSize } = event.nativeEvent;
    const { height: windowHeight } = Dimensions.get('window');

    if (contentOffset.y + windowHeight > contentSize.height) {
      if (!page) return
      console.log('load');
      timeout.current = setTimeout(() => {
        setLoad(true);
        loadTimeline();
      }, 1000);
    }
  });

  const getIdUser = async () => {
    try {
      const query = {
        _id: auth._id,
      };
      const result = await findUser(query);
      if (result.status) {
        setDataUser(result.data);
      }
    } catch (error) {
      console.log('ERROR getIdUser ', error);
    }
  };

  useEffect(() => {
    const reaload = async () => {
      await getIdUser();
      await loadTimeline();
    }
    reaload()
  }, [])

  const foucus = useIsFocused()
  useEffect(() => {
    getIdUser();
  }, [foucus])

  return (
    <View flex>
      <ImageBackground
        style={{ height: 210 }}
        source={{
          uri:
            dataUser?.coverPhoto ||
            'https://cdn.pixabay.com/photo/2021/02/12/18/14/wallpaper-6009269_640.png',
        }}
      />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={state => handleScroll(state)}>
        <TouchableOpacity
          style={{ position: 'absolute', right: 15, top: 15 }}
          onPress={() => {
            setShowmodal(!showmodal);
          }}>
          <Icon assetName="dots" tintColor="white" size={26} />
        </TouchableOpacity>
        <View centerH paddingT-120>
          <Animated.View style={[{ zIndex: 1 }, styles.avatar]}>
            <Avatar
              source={{ uri: dataUser?.avatar }}
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
                    user: dataUser._id,
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
                    user: dataUser._id,
                    statusView: true,
                  })
                }>
                <Text text70BO style={styles.numbercard}>
                  {numberFormat(dataUser.count_following)}
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
              <Text xivtext style={styles.story}>
                {auth.story.length == 0 ? 'Tạo ghi chú mới' : auth.story}
              </Text>
            </View>
            <View
              marginT-xx
              br50
              style={{ width: '100%', height: '100%' }}
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
      <Modals modalhiden={setShowmodal} modalVisible={showmodal}>
        <TouchableOpacity
          row
          paddingV-x
          centerV
          onPress={() => {
            setShowmodal(false);
            navigation.navigate('EditProfile');
          }}>
          <Icon
            assetName="edit"
            size={33}
            tintColor={Colors.yellow}
            marginH-x
          />
          <View>
            <Text style={{ fontFamily: BI }}>{t('profile.edit')}</Text>
            <Text color={Colors.gray}>{t('profile.edit_description')}</Text>
          </View>
        </TouchableOpacity>
      </Modals>
    </View>
  );
};

export default memo(Profile);

const styles = StyleSheet.create({
  scroll: { width: '100%', height: '100%', position: 'absolute', bottom: 0 },
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
    borderRadius: 360
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
});
