import { Alert, FlatList, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import Wapper from 'components/Wapper';
import { t } from 'lang';
import { Colors, Image, TouchableOpacity } from 'react-native-ui-lib';
import ButtonApp from 'components/ButtonApp';
import IconApp from 'components/IconApp';
import Modals from 'components/BottomSheetApp';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import ImageAndVideoLibary from 'containers/camera/ImageAndVideoLibary';
import { createpost } from 'src/hooks/api/post';
import CameraApp from 'containers/camera/CameraApp';
import NotificationModalApp from 'components/commons/NotificationModalApp';

const MainPost = ({ route }) => {
  const navigation = useNavigation()
  const { locationname, location_lat, loaction_lng } = route.params || { locationvalue: null, locationlatitude: null, locationlongitude: null };
  const [modelshow, setModelshow] = useState(false);
  const [open_camera, setopen_camera] = useState(false);
  const [open_library, setopen_library] = useState(false)
  const [isnotifiy, setIsnotifiy] = useState(false)
  const [notifycontent, setNotifycontent] = useState("")
  const [notifytitle, setNotifytitle] = useState("")
  const [images, setImages] = useState([]);
  const [is_loading, setis_loading] = useState(false);
  const [content, setcontent] = useState("")
  const [hashtag, sethashtag] = useState("")
  // Hàm xóa ảnh
  const handleRemoveImage = (id) => {
    setImages(images.filter(image => image.id !== id));
  };

  // Hàm show model
  const handlerAddImage = () => {
    setModelshow(true);
  };

  // Hàm chuyển component
  const gotoScreen = (screen, props) => {
    navigation.navigate(screen, props)
  }
  const buttonright = () => {
    return (
      <ButtonApp
        iconleft={"search"}
        iconright={"notifycation"}
        color={Colors.white}
        padding={'padding-10'}
        sizeText={14}
        title={t("create_post.post")}
        onclick={checkCreatePost}
      />
    );
  };

  const onUploadMedia = async (file) => {
    const { uri, type, name } = file
    try {
      const data = new FormData();
      data.append('file', { uri, type, name });
      data.append('upload_preset', 'ml_default');
      data.append('cloud_name', 'dnodsjqql');

      const response = await fetch('https://api.cloudinary.com/v1_1/dnodsjqql/upload', {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: data
      });

      const newData = await response.json();
      return newData.url
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  const checkCreatePost = async () => {
    if (content.trim() === '') {
      setNotifytitle(t("title_model.content_error"))
      setNotifycontent(t("title_model.post_faile"))
      setIsnotifiy(true)
    }
    else if (images.length <= 0) {
      setNotifytitle(t("title_model.image_error"))
      setNotifycontent(t("title_model.post_faile"))
      setIsnotifiy(true)
    } else if (locationname == null || loaction_lng == null || location_lat == null) {
      setNotifytitle(t("title_model.address_error"))
      setNotifycontent(t("title_model.post_faile"))
      setIsnotifiy(true)
    }
    else {
      createPost()
    }
  }

  const extractHashtags = (inputString) => {
    const words = inputString.split(' ');
    const result = [];
    for (let ele of words) {
      if (ele.startsWith('#')) {
        // Loại bỏ dấu # và thêm dấu cách ở cuối
        result.push(ele.substring(1) + ' ');
      }
    }

    return result;
  }

  const createPost = async () => {
    try {
      setis_loading(true)
      const uploadPromises = images.map(image => onUploadMedia(image))
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter(url => url !== null);

      const body = {
        media: validUrls,
        address: {
          detail: locationname,
          longitude: loaction_lng,
          latitude: location_lat,
          longitudeDelta: 0.005,
          latitudeDelta: 0.005
        },
        create_by: "665c11ebfc13ae2944c633f0",
        hashtags: extractHashtags(hashtag),
        content: content,
      }
      const response = await createpost(body)
      if (response.status) {
        console.log(response.data)
        setImages([])
        sethashtag("")
        setcontent("")

        setNotifytitle(t("title_model.success"))
        setNotifycontent(t("title_model.post_success"))
        setIsnotifiy(true)
      } else {
        setNotifytitle(t("title_model.error"))
        setNotifycontent(t("title_model.post_faile"))
        setIsnotifiy(true)
      }
      setis_loading(false)
    } catch (error) {
      console.log(error)
      setis_loading(false)
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.imageWrapper}>
      {item.uri?.endsWith('.mp4') ?
        <Video source={{ uri: item.uri }} style={styles.imageitem} paused controls /> :
        <Image source={{ uri: item.uri }} style={styles.imageitem} />
      }
      <TouchableOpacity
        style={styles.removeIcon}
        onPress={() => handleRemoveImage(item.id)}
      >
        <IconApp assetName={"cancel"} size={32} color={"red"} />
      </TouchableOpacity>
    </View>
  );

  //Modal pick Media
  const renderModalPickImage = () => {
    return (<Modals modalhiden={setModelshow} modalVisible={modelshow}>
      <View style={styles.modals}>
        <TouchableOpacity
          centerH
          centerV
          onPress={() => setopen_camera(true)}>
          <IconApp assetName={"diaphragm"} size={50} />
          <Text style={styles.textcamera}>{t("app.camera")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          centerH
          centerV
          onPress={() => setopen_library(true)}
        >
          <IconApp assetName={"library"} size={50} />
          <Text style={styles.textlibrary}>{t("app.library")}</Text>
        </TouchableOpacity>
      </View>
    </Modals>)
  }
  //Modal camera
  const rendermodalCamera = () => {
    return (<Modal visible={open_camera} animationType="slide">
      <CameraApp
        closeModal={() => setopen_camera(false)}
        updateListMedia={(medias) => {

          if (medias != null) {
            const filename = medias.path.split('/').pop()
            var one_media = {
              id: images.length + 1,
              type: medias.path.endsWith('.mp4') ? "video/mp4" : "image/jpeg",
              uri: "file://" + medias.path,
              name: filename
            }

            images.push(one_media)
          }
          setModelshow(!modelshow)
        }}
      />
    </Modal>)
  }
  //Modal Library
  const renderModalLibrary = () => {
    return (<Modal visible={open_library} animationType="slide">
      <ImageAndVideoLibary
        closeModal={() => setopen_library(false)}
        updateListMedia={(medias) => {
          if (medias.length > 0) {
            medias.forEach(ele => {
              if (ele != null) {
                var one_media = {
                  id: images.length + 1,
                  type: ele.type,
                  uri: ele.uri,
                  name: ele.fileName
                }

                images.push(one_media)
              }
            });
          }

          setModelshow(!modelshow)
        }}
      />
    </Modal>)
  }
  //Modal notify
  const renderNotification = () => {
    return (<NotificationModalApp
      modalhiden={setIsnotifiy}
      modalVisible={isnotifiy}
      title={notifytitle}
      asseticon={"logoapp"}
      content={notifycontent} />)
  }
  if (is_loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: "Black" }}>Đang tải ảnh và video lên cloud</Text>
      </View>
    )
  }

  return (
    <Wapper
      gadient
      renderleft
      funtleft={() => { navigation.goBack() }}
      iconleft={"back"}
      title={t("create_post.title")}
      customright={buttonright}
    >
      <View style={styles.container} >
        <View style={styles.body}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              style={styles.input}
              value={content}
              onChangeText={setcontent}
              placeholder={t("create_post.content_hint")}
              placeholderTextColor="black"
              multiline
            />
            <TextInput
              value={hashtag}
              onChangeText={sethashtag}
              style={styles.hashtagHint}
              placeholder={t("create_post.hashtag_hint")}
              placeholderTextColor="black"
              multiline
            />
            <FlatList
              scrollEnabled={false}
              style={styles.imageListContainer}
              data={images}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
            <View style={styles.contentImage}>
              <TouchableOpacity
                onPress={handlerAddImage}
                style={styles.image}
              >
                <View style={styles.imagePlaceholder}>
                  <IconApp assetName={"plus"} size={45} />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.foodter} onPress={() => { gotoScreen("Addadress") }}>
          <View style={styles.contentlocation}>
            <IconApp assetName={"location"} size={34} />
            <Text numberOfLines={1} style={styles.textloctation}>
              {locationname || t("create_post.loacation_hint")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {renderModalPickImage()}
      {rendermodalCamera()}
      {renderModalLibrary()}
      {renderNotification()}
    </Wapper>
  );
};

export default MainPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    flex: 2,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    margin: 10
  },
  foodter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modals: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  textcamera: {
    marginTop: 10,
    fontSize: 16,
    color: 'black'
  },
  textlibrary: {
    marginTop: 10,
    fontSize: 16,
    color: 'black'
  },
  contentlocation: {
    width: '100%',
    borderWidth: 1,
    borderTopColor: 'black',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    padding: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textloctation: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10
  },
  imageListContainer: {
    padding: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  imageitem: {
    marginTop: 16,
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
  },
  removeIcon: {
    position: 'absolute',
    top: 26,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 2,
  },
  input: {
    minHeight: 100,  // Giữ chiều cao tối thiểu
    borderColor: '#ccc',
    paddingHorizontal: 8,
    paddingTop: 8,
    textAlignVertical: 'top',
    color: 'black',
  },
  hashtagHint: {
    minHeight: 30,  // Giữ chiều cao tối thiểu
    paddingHorizontal: 8,
    textAlignVertical: 'top',
    color: 'black',
  },
  contentImage: {
    padding: 10
  },
  image: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#D9D9D9',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plus: {
    fontSize: 48,
    color: '#ccc',
    width: 50,
    height: 50,
  },
  locationHintContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  locationHint: {
    color: '#f00',
  },
});
