import React, { useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  RefreshControl,
  StyleSheet,
} from 'react-native';
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
    "status": true,
    "data": [
      {
        "_id": "66fa513a79b799f6237c01dd",
        "start_vip": "1727680826459",
        "end_vip": "1730791226459",
        "create_at": "1727680826462",
        "post": {
          "_id": "666d1a1d9aade859d65619e5",
          "content": "banh ngot",
          "hashtags": [
            "hhhhh"
          ],
          "media": [
            "https://videos.pexels.com/video-files/3298478/3298478-sd_506_960_25fps.mp4"
          ],
          "address": {
            "detail": "164/6 Đường Thới Tam Thôn 17, Xã Thới Tam Thôn, Huyện Hóc Môn, Hồ Chí Minh, Việt Nam",
            "longitude": 106.61824,
            "latitude": 10.87523,
            "longitudeDelta": 0.005,
            "latitudeDelta": 0.005
          },
          "exist": true,
          "create_by": {
            "_id": "669225710e3001246d117608",
            "avatar": "http://res.cloudinary.com/dyqb9wx4r/image/upload/v1728787253/1000001680_jzekcd.jpg",
            "name": "Nguyen Xuan Quynh",
            "tagName": "quynh_64"
          },
          "create_at": "1720854074279",
          "update_at": "1721744845653",
          "fire": 5,
          "comments": 29,
          "isFire": true
        }
      }
    ]
  }
];

const Advertisement = () => {
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
    // Refresh data
    setRefreshing(true);
    setRefreshing(false);
  };

  const onLoadMore = () => {
    // Load more data
  };

  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("setting.advertisement")}>
      <View flex bg-white>
        <>
          <Animated.FlatList
            showsVerticalScrollIndicator={false}
            style={styles.scrollview}
            scrollEnabled
            data={sampleData[0].data}  // Chỉ sử dụng phần data trong sampleData
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyExtractor={(item) => item.post._id}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.6}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            renderItem={({ item }) => (
              <View style={styles.postContainer}>
                <Text style={styles.dateText}>06/10/2024 - 06/12/2024</Text>
                <RenderPost
                  item={item.post}
                  handleOpenComment={handleOpenComment}
                  openModalFollow={openModalFollow}
                />
              </View>
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
                // Handle save post
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

export default Advertisement;

const styles = StyleSheet.create({
  scrollview: {
    paddingHorizontal: 10,
  },
  postContainer: {
    alignItems: 'center', // Center items in the container
    marginBottom: 20, // Add spacing between posts
  },
  dateText: {
    fontSize: 16, // Set font size
    fontWeight: 'bold', // Make the text bold
    marginBottom: 10, // Space between date and post
    textAlign: 'center', // Center the text
    color: Colors.black, // Set text color
  },
});
