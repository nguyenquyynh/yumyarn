import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Colors, Icon, Text, View, Image } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { BI, EBI } from 'configs/fonts';
import { t } from 'lang';
import Wapper from 'components/Wapper';
import { getPostAdvs } from 'src/hooks/api/post';
import RenderVideo from 'components/homes/RenderVideo';
import { millisecondsToDate, millisecondsToDay } from 'configs/ui/time';
import numberFormat from 'configs/ui/format';
import LottieView from 'lottie-react-native';
import lottie from 'configs/ui/lottie';
import { Clock, Crown, Eye, FlameIcon, MessageCircle } from 'lucide-react-native';
const MAX_WIDTH = Dimensions.get('window').width
const Advertisement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const loadAdvertisementPost = async () => {
    await getPostAdvs()
      .then(resault => setData(resault.data))
      .catch(err => console.log(err))

  }

  const onRefresh = async () => {
    setRefreshing(true);
    await getPostAdvs()
      .then(resault => setData(resault.data))
      .catch(err => console.log(err))
      .finally(() => { setRefreshing(false) })
  };

  const onLoadMore = async () => {
    setIsLoading(true)
    await getPostAdvs(page)
      .then(resault => {
        if (Array.isArray(resault.data && resault.data.length > 0)) {
          setData([...data, resault.data])
          setPage(page + 1)
        }
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false))
  };

  useEffect(() => {
    loadAdvertisementPost()
  }, [])


  const Render = (item) => {
    return (
      <View paddingH-x paddingB-10 bg-white style={styles.sizeContainer}>
        {/* Image */}
        <View marginB-10 marginT-15 style={styles.borderRadiusSwiper}>
          <FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal
            pagingEnabled={true}
            snapToAlignment="center"
            data={item?.post?.media}
            renderItem={data => (
              <Pressable
                onPress={() => {
                  navigation.navigate('PostDetail', { id: item?.post?._id, defaultdata: item?.post });
                }}
                style={{ overflow: 'hidden', borderRadius: 15 }}>

                {data.item.endsWith('.mp4') ? (
                  <RenderVideo urlvideo={data.item} />
                ) : (
                  <Image
                    source={{ uri: data.item }}
                    style={styles.styleImage}
                    resizeMode="cover"
                  />
                )}
                <View abs paddingH-10 paddingV-1 center row br100 bg-yellow style={{ top: 10, right: 10 }}>
                  <Crown color={'white'} size={15} />
                  <Text marginL-5 color='white' text90BO>{millisecondsToDate(item?.end_vip)}</Text>
                </View>
              </Pressable>
            )}
            key={item => item.id}
          />
        </View>
        {/* Content */}
        <Text
          text
          text85BO
          numberOfLines={3}>
          {item?.post?.content}
        </Text>
        {item?.post?.hashtags.length != 0 && (
          <View row>
            {item?.post?.hashtags.map(el => (
              <Text
                key={el}
                onPress={() => {
                  navigation.navigate('Search', { inputkey: el });
                }}
                style={{ fontFamily: EBI }}
                color={Colors.yellow}>
                #{el}{' '}
              </Text>
            ))}
          </View>
        )}
        <View row top centerV>
          <Icon assetName="location" size={12} marginR-v />
          <Text
            numberOfLines={1}
            onPress={() => {
              navigation.navigate('SearchMap', { defaultlocation: item?.post?.address });
            }}
            text
            text90BO
            marginR-7>
            {item?.post?.address?.detail}
          </Text>
        </View>
        <View marginT-10 style={{ width: '100%', }}>
          <View row left centerV>
            <Clock size={15} color={'red'} />
            <Text marginL-5 text90L>{millisecondsToDate(item.start_vip)} {`-`} {millisecondsToDate(item.end_vip)}</Text>
          </View>
          <View row>
            <View row left marginR-10 center>
              <FlameIcon size={15} color={'red'} />
              <Text marginL-5 text80H>{numberFormat(item?.fires || 0)}</Text>
            </View>
            <View row right marginR-10 center>
              <MessageCircle size={15} color={'blue'}/>
              <Text marginL-5 text80H>{numberFormat(item?.comments || 0)}</Text>
            </View>
            <View row right center>
              <Eye size={15} color={'green'}/>
              <Text marginL-5 text80H>{numberFormat(item?.comments || 0)}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("setting.advertisement")}>
      <View flex bg-white>
        <>
          <Animated.FlatList
            showsVerticalScrollIndicator={false}
            style={styles.scrollview}
            scrollEnabled
            data={data}  // Chỉ sử dụng phần data trong sampleData
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyExtractor={(item) => item.post._id}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            renderItem={({ item }) => (
              <View style={styles.postContainer}>
                {Render(item)}

              </View>
            )}
            ListEmptyComponent={() => <View center style={{ width: '100%', height: Dimensions.get('window').height - 100 }}>
              <LottieView source={lottie.Nodata} loop={false} autoPlay style={{ width: 150, height: 150 }} />
            </View>}
            ListFooterComponent={() =>
              isLoading && <ActivityIndicator style={{ marginBottom: 10 }} size="large" color="#0000ff" />
            }
          />
          { }
        </>
      </View>
    </Wapper>
  )
}

export default Advertisement;

const styles = StyleSheet.create({
  scrollview: {
  },
  postContainer: {
    alignItems: 'center', // Center items in the container
    marginBottom: 10, // Add spacing between posts
  },
  dateText: {
    fontSize: 16, // Set font size
    fontWeight: 'bold', // Make the text bold
    marginBottom: 10, // Space between date and post
    textAlign: 'center', // Center the text
    color: Colors.black, // Set text color
  },
  borderRadiusSwiper: {
    width: '100%',
    height: 210,
    borderRadius: 20,
    overflow: 'hidden'
  },
  styleImage: {
    width: MAX_WIDTH - 20,
    width: MAX_WIDTH - 20,
    maxWidth: 480,
    height: '100%',
  },
  sizeContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    position: 'relative',
    elevation: 2
  },
});
