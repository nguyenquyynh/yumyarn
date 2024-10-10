import React, { useState } from 'react';
import { ActivityIndicator, Animated, RefreshControl, StyleSheet, } from 'react-native'
import ShowComments from 'containers/comment/ShowComments';
import RenderPost from 'components/homes/RenderPost';
import Modals from 'components/BottomSheetApp';
import { Colors, Icon, TouchableOpacity, Text, View } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { BI } from 'configs/fonts';
import { t } from 'lang';
import Wapper from 'components/Wapper';


const sampleData = [
  {
    "_id": "670263d0c68a37d4e22cdb28",
    "create_at": "1728208704614",
    "post": {
      "_id": "6692270cc5ca6be5dc29c1cb",
      "content": "There are many variations of passages of Lorem Ipsum available...",
      "hashtags": ["abc ", "monngo"],
      "media": [
        "https://videos.pexels.com/video-files/1111421/1111421-sd_640_360_30fps.mp4",
        "https://cdn.pixabay.com/photo/2020/03/28/14/52/egg-4977357_640.jpg"
      ],
      "address": {
        "detail": "5F Hẻm 134 Ấp Đông, Xã Thới Tam Thôn, Huyện Hóc Môn, Hồ Chí Minh, Việt Nam",
        "longitude": 106.61747,
        "latitude": 10.87293,
        "longitudeDelta": 0.005,
        "latitudeDelta": 0.005
      },
      "fire": 4,
      "comments": 59,
      "isFire": false
    },
    "user": {
      "_id": "669225710e3001246d117608",
      "name": "Nguyen Xuan Quynh",
      "avatar": "https://cdn.pixabay.com/photo/2019/03/02/04/42/girl-4029208_960_720.jpg",
      "tagName": "quynh_64"
    }
  },
  {
    "_id": "6702753f3edb2836faefd817",
    "create_at": "1728214218010",
    "post": {
      "_id": "667f9fbbfc13ae1fdb234928",
      "content": "Banh u",
      "hashtags": ["Quận 1"],
      "media": [
        "https://videos.pexels.com/video-files/4057920/4057920-sd_506_960_25fps.mp4"
      ],
      "address": {
        "detail": "Quận 12",
        "longitude": 123.123,
        "latitude": 123.123,
        "longitudeDelta": 123.123,
        "latitudeDelta": 123.123
      },
      "fire": 1,
      "comments": 3,
      "isFire": true
    },
    "user": {
      "_id": "669225710e3001246d117608",
      "name": "Nguyen Xuan Quynh",
      "avatar": "https://cdn.pixabay.com/photo/2019/03/02/04/42/girl-4029208_960_720.jpg",
      "tagName": "quynh_64"
    }
  }
];


const PostSaved = () => {
  const [open, setOpen] = useState(false);
  const [idPost, setIdPost] = useState('');
  const [showmodal, setShowmodal] = useState(false);
  const [userIdPost, setUserIdPost] = useState(null);
  const [isFollow, setIsFollow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const handleOpenComment = (postId) => {
    setIdPost(postId);
    setOpen(true);
  };

  const openModalFollow = () => {
    setShowmodal(true);
  };

  const onRefresh = () => {
    // Xử lý làm mới dữ liệu
    setRefreshing(true);
    // Fetch dữ liệu mới từ API hoặc hành động tương ứng
    setRefreshing(false);
  };

  const onLoadMore = () => {
    // Xử lý tải thêm dữ liệu
  };


  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("setting.saved")}>
      <View flex bg-white>
        <>
          <Animated.FlatList
            showsVerticalScrollIndicator={false}
            style={styles.scrollview}
            scrollEnabled
            data={sampleData}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyExtractor={(item) => item._id}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.6}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            renderItem={({ item }) => (
              <RenderPost
                item={item.post}
                handleOpenComment={handleOpenComment}
                openModalFollow={openModalFollow}
              />
            )}
            ListFooterComponent={() =>
              isLoading && <ActivityIndicator style={{ marginBottom: 50 }} size="large" color="#0000ff" />
            }
          />

          {/* Modal bình luận */}
          {idPost && (
            <ShowComments
              open={open}
              setOpen={setOpen}
              idPost={idPost}
              setIdPost={setIdPost}
            />
          )}

          {/* Modal theo dõi/chỉnh sửa */}
          <Modals modalhiden={setShowmodal} modalVisible={showmodal}>
            {idPost !== userIdPost && (
              <TouchableOpacity
                row
                paddingV-x
                centerV
                onPress={() => {
                  setShowmodal(false);
                  navigation.navigate('EditProfile');
                }}>
                <Icon assetName="edit" size={33} tintColor={Colors.yellow} marginH-x />
                <View>
                  <Text style={{ fontFamily: BI }}>{t('profile.edit')}</Text>
                  <Text color={Colors.gray}>{t('profile.edit_description')}</Text>
                </View>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              row
              paddingV-x
              centerV
              onPress={() => {
                setShowmodal(false);
                // Xử lý theo dõi
              }}>
              <Icon
                assetName={isFollow ? 'cancle_follow' : 'check_follow'}
                size={33}
                marginH-x
              />
              <View>
                <Text style={{ fontFamily: BI }}>
                  {isFollow ? t('app.following') : t('app.follow')}
                </Text>
                <Text color={Colors.gray}>
                  {isFollow ? t('post.unFollow_des') : t('post.follow_des')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              row
              paddingV-x
              centerV
              onPress={() => {
                setShowmodal(false);
                // Xử lý lưu bài viết
              }}>
              <Icon assetName="bookmark" size={33} tintColor={Colors.yellow} marginH-x />
              <View>
                <Text style={{ fontFamily: BI }}>{t('post.save')}</Text>
                <Text color={Colors.gray}>{t('post.save_des')}</Text>
              </View>
            </TouchableOpacity>
          </Modals>
        </>
      </View>
    </Wapper>
  )
}

export default PostSaved

const styles = StyleSheet.create({
  paddingHorizontal: 10,
})