import { ActivityIndicator, Dimensions, Image, ImageBackground, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, TextInput } from 'react-native'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Avatar, Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { t } from 'lang'
import numberFormat from 'configs/ui/format'
import ListMediaProfile from 'components/profile/ListMediaProfile'
import { changeAvatar, changeCoverPhoto, getTimeline, updateInfor } from 'src/hooks/api/profile'
import Modals from 'components/BottomSheetApp'
import { BI, I, SBI } from 'configs/fonts'
import Animated from 'react-native-reanimated'
import Wapper from 'components/Wapper'
import IconApp from 'components/IconApp'
import CameraApp from 'containers/camera/CameraApp'
import ImageAndVideoLibary from 'containers/camera/ImageAndVideoLibary'
import { changeAvatarRedux, changeCoverPhotoRedux, deleteStory, updateInforRedux } from 'reducers/auth'
import LoadingApp from 'components/commons/LoadingApp'


const EditProfile = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const auth = useSelector(state => state.auth.user);
  const [loading, setloading] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [modelshow, setModelshow] = useState(false);
  const [checkUpdataImg, setCheckUpdataImg] = useState();

  const [open_library, setopen_library] = useState(false);
  const [open_camera, setopen_camera] = useState(false);

  const [name, setName] = useState(auth?.name)
  const [tagName, setTagName] = useState(auth?.tagName)
  const [story, setStory] = useState(auth?.story)
  const [statusStory, setStatusStory] = useState(false)

  const [statusConfirmDelete, setStatusConfirmDelete] = useState(false)

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadTimeline('refress')
      setRefreshing(false);
    }, 1000)
  }

  // Hàm show model
  const handlerAddImage = (check) => {
    if (check == "avatar") {
      setCheckUpdataImg(true)
    } else {
      setCheckUpdataImg(false)
    }
    setModelshow(true);
  };

  const onUploadMedia = async (file) => {
    setloading(true)
    const { uri, type, name } = file
    try {
      const data = new FormData();
      data.append('file', { uri, type, name });
      data.append('upload_preset', 'ml_default');
      data.append('cloud_name', 'dyqb9wx4r');

      const response = await fetch('https://api.cloudinary.com/v1_1/dyqb9wx4r/upload', {
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

  const updateAvatar = async (one_media) => {
    setloading(true)
    try {
      const uploadedUrl = await onUploadMedia(one_media);
      if (uploadedUrl) {
        const body = {
          _id: auth._id,
          avatar: uploadedUrl
        }
        const result = await changeAvatar(body)
        if (result.status) {
          dispatch(changeAvatarRedux(uploadedUrl))

        }
      } else {
        console.log("Upload failed");
      }
    } catch (error) {
      console.log(`Error updateAvatar: ${error}`);
      return null;
    } finally {
      setloading(false)
    }
  }

  const updateInforAccount = async (name, tagName, story) => {
    setloading(true)
    try {
      const body = {
        _id: auth._id,
        name: name || auth.name,
        tagName: tagName || auth.tagName,
        story: story || auth.story
      }
      const result = await updateInfor(body)
      if (result) {
        console.log("update success")
        dispatch(updateInforRedux({
          name: name || auth.name,
          tagName: tagName || auth.tagName,
          story: story || auth.story
        }))
        if (statusConfirmDelete) {
          dispatch(deleteStory())
          setStatusConfirmDelete(false)
        }
        navigation.goBack();
      }
    } catch (error) {
      console.log(`Error updateInforAccount: ${error}`);
      return null;
    } finally {
      setloading(false)
    }
  }

  const updateCoverPhoto = async (one_media) => {
    setloading(true)
    try {
      const uploadedUrl = await onUploadMedia(one_media);
      if (uploadedUrl) {
        const body = {
          _id: auth._id,
          photo: uploadedUrl
        }
        const result = await changeCoverPhoto(body)
        if (result.status) {
          dispatch(changeCoverPhotoRedux(uploadedUrl))
        }
      } else {
        console.log("Upload failed");
      }
    } catch (error) {
      console.log(`Error updateCoverPhoto: ${error}`);
      return null;
    } finally {
      setloading(false)
    }
  }

  //Modal camera
  const rendermodalCamera = (checkUpdataImg) => {
    return (<Modal visible={open_camera} animationType="slide">
      <CameraApp
        closeModal={() => setopen_camera(false)}
        updateListMedia={(medias) => {

          if (medias != null) {
            const filename = medias.path.split('/').pop()
            var one_media = {
              type: medias.path.endsWith('.mp4') ? "video/mp4" : "image/jpeg",
              uri: "file://" + medias.path,
              name: filename
            }
            console.log(checkUpdataImg)
            checkUpdataImg ? updateAvatar(one_media) : updateCoverPhoto(one_media)
          }
          setModelshow(!modelshow)
        }}
      />
    </Modal>)
  }

  //Modal pick Media
  const renderModalPickImage = () => {
    return (<Modals modalhiden={setModelshow} modalVisible={modelshow}>
      <View style={{ flexDirection: 'row' }} spread paddingH-80 paddingV-15 >
        <TouchableOpacity

          onPress={() => setopen_camera(true)}>
          <IconApp assetName={"diaphragm"} size={50} />
          <Text style={styles.textcamera}>{t("app.camera")}</Text>
        </TouchableOpacity>
        <TouchableOpacity

          onPress={() => setopen_library(true)}
        >
          <IconApp assetName={"library"} size={50} />
          <Text style={styles.textlibrary}>{t("app.library")}</Text>
        </TouchableOpacity>
      </View>
    </Modals>)
  }

  //Modal Library
  const renderModalLibrary = (checkUpdataImg) => {
    return (<Modal visible={open_library} animationType="slide">
      <ImageAndVideoLibary
        closeModal={() => setopen_library(false)}
        updateListMedia={(medias) => {
          if (medias.length > 0) {
            medias.forEach(ele => {
              if (ele != null) {
                var one_media = {
                  type: ele.type,
                  uri: ele.uri,
                  name: ele.fileName
                }
                console.log(checkUpdataImg)
                checkUpdataImg ? updateAvatar(one_media) : updateCoverPhoto(one_media)
              }
            });
          }
          setModelshow(!modelshow)
        }}
      />
    </Modal>)
  }

  const rightButton = () => {
    return (
      <TouchableOpacity bg-yellow br60 onPress={() => updateInforAccount(name, tagName, story)} paddingH-xv paddingV-v>
        <Text text80BO color='white'>
          {t("app.done")}
        </Text>
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    if (auth.story) {
      setStatusStory(true)
    }
  }, [])

  if (loading) {
    return <LoadingApp />
  }
  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("profile.edit_profile")} customright={rightButton}>
      <View flex bg-white>
        <TouchableOpacity>
          <Image style={{ height: 210 }} source={{ uri: auth?.coverPhoto || 'https://cdn.pixabay.com/photo/2020/01/07/16/41/vietnam-4748105_1280.jpg' }} />
        </TouchableOpacity>

        <ScrollView scrollEnabled={false} style={styles.scroll} showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={(state) => handleScroll(state)}
        >

          <View centerH>
            <Pressable height={120} width={'100%'} backgroundColor='transparent' style={{ zIndex: -1 }} onPress={() => handlerAddImage("coverPhoto")}></Pressable>
            <Animated.View style={{ zIndex: 1 }}>
              <TouchableOpacity onPress={() => handlerAddImage("avatar")}>
                <Avatar source={{ uri: auth?.avatar }} size={100} imageStyle={styles.avatar} />
              </TouchableOpacity>
            </Animated.View>
            <View bg-puper style={styles.background}>
              <View row spread padding-x>
                <TouchableOpacity flex center onPress={() => navigation.navigate('FollowerList')} >
                  <Text text70BO style={styles.numbercard}>{numberFormat(auth.follower)}</Text>
                  <Text ixtext style={styles.numbercard}>{t("profile.followers")}</Text>
                </TouchableOpacity>
                <View flex />
                <TouchableOpacity flex center onPress={() => navigation.navigate('FollowerList')} >
                  <Text text70BO style={styles.numbercard}>{numberFormat(auth.following)}</Text>
                  <Text ixtext style={styles.numbercard}>{t("profile.following")}</Text>
                </TouchableOpacity>
              </View>
              <View paddingH-l centerH height={600} >
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={auth.name}
                  placeholderTextColor={'black'}
                  multiline={true}
                  style={styles.name}
                />
                <View row center>
                  <Text style={styles.tagName}>@</Text>
                  <TextInput
                    value={tagName}
                    onChangeText={setTagName}
                    placeholder={auth.tagName}
                    placeholderTextColor={'black'}
                    multiline={true}
                    style={styles.tagName}
                  />
                </View>
                <View>
                  <TextInput
                    value={story}
                    onChangeText={setStory}
                    style={styles.story}
                    multiline={true}
                    textAlignVertical={'center'}
                    placeholder={statusStory ? auth.story : "Tạo ghi chú mới"}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        {renderModalPickImage()}
        {rendermodalCamera(checkUpdataImg)}
        {renderModalLibrary(checkUpdataImg)}
      </View>
    </Wapper>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  scroll: { width: '100%', height: '100%', position: "absolute" },
  background: {
    width: '100%',
    position: 'relative',
    top: -50,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  avatar: {
    borderColor: 'white',
    borderWidth: 3,
  },
  tagName: {
    fontFamily: BI,
    padding: 0,
    fontSize: 14,
    color: 'black',
  },
  name: {
    fontFamily: BI,
    padding: 0,
    fontSize: 18,
    width: 300,
    color: 'black',
    textAlign: 'center'
  },
  story: {
    fontFamily: I,
    color: 'black',
    textAlign: 'center',
    width: 350,
  },
  numbercard: {
    fontFamily: SBI,
    color: 'black',
  },
})