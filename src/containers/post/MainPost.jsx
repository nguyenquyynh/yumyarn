import { Alert, FlatList, Modal, ScrollView, StatusBar, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import Wapper from 'components/Wapper';
import { t } from 'lang';
import { Avatar, Colors, Image, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import ButtonApp from 'components/ButtonApp';
import IconApp from 'components/IconApp';
import Modals from 'components/BottomSheetApp';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import ImageAndVideoLibary from 'containers/camera/ImageAndVideoLibary';
import { createpost } from 'src/hooks/api/post';
import CameraApp from 'containers/camera/CameraApp';
import NotificationModalApp from 'components/commons/NotificationModalApp';
import { useSelector } from 'react-redux';
import { B } from 'configs/fonts';
import LoadingApp from 'components/commons/LoadingApp';

const MainPost = ({ route }) => {
  const navigation = useNavigation()
  const user = useSelector(state => state.auth.user)
  const { address } = route.params || {}
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
  const [statusRequest, setStatusRequest] = useState(false)
  // Hàm xóa ảnh
  const handleRemoveImage = (id) => {
    setImages(images.filter(image => image.id !== id));
  };

  // Hàm show model
  const handlerAddImage = () => {
    setModelshow(true);
  };

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
    const { uri, type, name } = file;
    try {
      const data = new FormData();
      data.append('file', { uri, type, name });
      data.append('upload_preset', 'x1r3euwt');

      const response = await fetch(`https://api.cloudinary.com/v1_1/ddgmnqwtk/upload`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
        },
        body: data,
      });

      const newData = await response.json();
      console.log(newData);

      return newData.secure_url; // Use secure_url to get the HTTPS URL
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
    } else if (!address) {
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
        result.push(ele.substring(1));
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
          ...address, detail: address.name
        },
        create_by: user?._id,
        hashtags: extractHashtags(hashtag),
        content: content,
      }
      const response = await createpost(body)
      setStatusRequest(response.status)
      if (response.status) {
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
  // Render item media
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
        <IconApp assetName={"cancel"} size={20} color={"red"} />
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
      funt={() => {
        if (notifycontent == t("title_model.post_success")) {
          navigation.navigate('Main')
        } else {
          setIsnotifiy(false)
        }
      }}
      asseticon={statusRequest ? "done" : "dont"}
      content={notifycontent} />)
  }
  if (is_loading) {
    return (
      <LoadingApp />
    )
  }
  const onHashtagPress = (e) => {
    if (e.nativeEvent.key == ' ') {
      sethashtag(hashtag + '#')
    }

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
            <View row>
              <Avatar source={{ uri: user?.avatar }} size={40} />
              <View marginL-x>
                <Text text70BO>{user?.name}</Text>
                <Text text80T>@{user?.tagName}</Text>
              </View>
            </View>
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
              color={Colors.orange}
              placeholder={t("create_post.hashtag_hint")}
              placeholderTextColor="black"
              onFocus={() => { sethashtag('#') }}
              onKeyPress={onHashtagPress}
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
          </ScrollView>
        </View>
        <View bg-white style={styles.footer}>
          <TouchableOpacity style={{ width: '100%' }} onPress={handlerAddImage}>
            <View style={styles.contentlocation}>
              <IconApp assetName={"diaphragm"} size={25} />
              <Text numberOfLines={1} style={styles.textloctation}>
                {address?.title || t("create_post.image_hint")}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '100%' }} onPress={() => { navigation.navigate("Adddrressscreen", { back: "Post", defaultlocation: address }) }}>
            <View style={styles.contentlocation}>
              <IconApp assetName={"location"} size={25} />
              <View flex>
                <Text numberOfLines={1} style={styles.textloctation}>
                  {address?.name || t("create_post.loacation_hint")}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

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
    borderColor: "black",
    margin: 10
  },
  footer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingBottom: 5,
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
    borderTopWidth: 0.5,
    borderTopColor: 'black',
    flexDirection: 'row',
    padding: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  textloctation: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10
  },
  imageListContainer: {

  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  imageitem: {
    height: 200,
    borderColor: '#ccc',
    backgroundColor: '#D9D9D9',
    marginBottom: 10
  },
  removeIcon: {
    position: 'absolute',
    top: 10, right: 10,
    backgroundColor: 'red',
    borderRadius: 30,
  },
  input: {
    minHeight: 50,
    borderColor: '#ccc',
    paddingHorizontal: 8,
    marginTop: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    color: 'black',
  },
  hashtagHint: {
    fontFamily: B,
    minHeight: 30,
    paddingHorizontal: 8,
    textAlignVertical: 'top',
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
