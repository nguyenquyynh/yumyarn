import {
  ActivityIndicator,
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Icon, Text, TouchableOpacity, View} from 'react-native-ui-lib';
import {useSelector} from 'react-redux';
import {t} from 'lang';
import {useNavigation} from '@react-navigation/native';
import ListPost from 'containers/post/ListPost';
import {getPost} from 'src/hooks/api/post';

const Home = () => {
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth.user);
  const name = auth.name.split(' ')[0];
  const idUser = auth._id;
  const [isLoading, setIsLoading] = useState(false);
  const [dataPost, setDataPost] = useState([]);
  const [page, setPage] = useState(0);
  //Animated header
  const scrollY = new Animated.Value(0);
  const diffclamp = Animated.diffClamp(scrollY, 0, 50);
  const tranSlateY = diffclamp.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
  });
  function handlerSearch() {
    navigation.navigate('Search');
  }
  function handlerCreatePost() {
    navigation.navigate('Post');
  }
  function handlerNotify() {
    navigation.navigate('Post');
  }
  function handlerChat() {
    navigation.navigate('Post');
  }

  const getPostData = async (idUser, page) => {
    try {
      const dataRequest = {
        id: idUser,
        page: page,
      };
      const response = await getPost(dataRequest);
      if (response.status) {
        setDataPost(prev => [...prev, ...response.data]);
        setPage(page);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async page => {
    if (!isLoading) {
      setIsLoading(true);
      await getPostData(idUser, page);
      console.log('đã tải');
    }
  };

  useEffect(() => {
    getPostData(idUser, 1);
  }, []);

  useEffect(() => {
    console.log(page);
  }, [page]);
  return (
    <View flex bg-white>
      <Animated.View
        style={[styles.header, {transform: [{translateY: tranSlateY}]}]}>
        <View row centerV>
          <Avatar source={{uri: auth.avatar}} size={40} onPress={() => {}} />
          <Text marginH-xvi style={styles.name}>
            {t('home.welcome')} {name}
          </Text>
          <TouchableOpacity onPress={handlerCreatePost}>
            <Icon assetName="add" size={20} />
          </TouchableOpacity>
        </View>
        <View row centerV>
          <TouchableOpacity onPress={handlerSearch}>
            <Icon assetName="search" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            marginH-xvi
            onPress={() => {
              navigation.navigate('MainNotifications');
            }}>
            <Icon assetName="notifycation" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('MainChat');
            }}>
            <Icon assetName="chat" size={20} />
          </TouchableOpacity>
        </View>
      </Animated.View>
      <Animated.ScrollView
        style={styles.scrollview}
        scrollToOverflowEnabled={false}
        showsVerticalScrollIndicator={false}
        onScroll={state => {
          scrollY.setValue(state.nativeEvent.contentOffset.y);
          console.log(state.nativeEvent.contentSize);
          console.log(state.nativeEvent.contentOffset.y);
        }}
        // onEndReachedThreshold={0.5}
        // initialNumToRender={2}
        // maxToRenderPerBatch={2}
        onEndReached={() => {
          handleLoadMore(page + 1);
          console.log('aaaa');
        }} // Gọi hàm khi kéo tới cuối danh sách
        ListFooterComponent={() =>
          isLoading && <ActivityIndicator size="large" color="#0000ff" />
        }>
        <ListPost
          idUser={idUser}
          setDataPost={setDataPost}
          dataPost={dataPost}
        />
      </Animated.ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  name: {
    fontFamily: 'Inter-SemiBoldItalic',
    fontSize: 16,
  },
  scrollview: {paddingTop: 50},
  header: {
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
});

var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
