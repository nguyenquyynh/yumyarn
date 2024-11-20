import { Image, Modal, ScrollView, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { t } from 'lang'
import { changeAvatar, changeCoverPhoto, updateInfor } from 'src/hooks/api/profile'
import Modals from 'components/BottomSheetApp'

import IconApp from 'components/IconApp'
import CameraApp from 'containers/camera/CameraApp'
import ImageAndVideoLibary from 'containers/camera/ImageAndVideoLibary'
import { changeAvatarRedux, changeCoverPhotoRedux, deleteStory, updateInforRedux } from 'reducers/auth'
import LoadingApp from 'components/commons/LoadingApp'
import { Upload } from 'src/libs/UploadImage'
import { isCleanContent } from 'src/middleware/contentmiddleware'
import { Camera, ChevronLeft } from 'lucide-react-native'

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setloading] = useState(false)
  const [modelshow, setModelshow] = useState(false);
  const [checkUpdataImg, setCheckUpdataImg] = useState();

  const [open_library, setopen_library] = useState(false);
  const [open_camera, setopen_camera] = useState(false);

  const auth = useSelector(state => state.auth.user)
  const [coverImage, setCoverImage] = useState(auth?.coverPhoto)
  const [profileImage, setProfileImage] = useState(auth?.avatar)
  const [name, setName] = useState(auth?.name)
  const [tagname, setTagname] = useState(auth?.tagName)
  const [story, setStory] = useState(auth?.story)

  const [statusConfirmDelete, setStatusConfirmDelete] = useState(false)

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
    const { uri, type, name } = file
    try {
      const newData = await Upload(uri, type, name)
      return newData
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
          setProfileImage(uploadedUrl)
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
    if (!isCleanContent(name) || !isCleanContent(story) || !isCleanContent(tagName)) return

    setloading(true)
    try {
      const body = {
        _id: auth._id,
        name: name || auth.name,
        tagName: tagName.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '') || auth.tagName.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ''),
        story: story || auth.story
      }
      const result = await updateInfor(body)
      if (result) {
        // console.log("update success")
        dispatch(updateInforRedux({
          name: name || auth.name,
          tagName: tagName || auth.tagName,
          story: story || auth.story
        }))
        if (statusConfirmDelete) {
          dispatch(deleteStory())
          setStatusConfirmDelete(false)
        }
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
          setCoverImage(uploadedUrl)
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
    return (<Modal visible={open_camera} animationType="slide" statusBarTranslucent>
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
    return (<Modal visible={open_library} animationType="slide" statusBarTranslucent>
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

  if (loading) {
    return <LoadingApp />
  }
  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: coverImage }}
            style={styles.coverImage}
          />
          <TouchableOpacity br20 bg-tr_black padding-5
            style={{ position: 'absolute', top: 40, left: 20 }}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft size={25} color={Colors.yellow} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.editCoverButton} onPress={() => handlerAddImage("coverPhoto")}>
            <Camera color="#FFFFFF" size={24} />
          </TouchableOpacity>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editProfileImageButton} onPress={() => handlerAddImage("avatar")}>
              <Camera color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tên</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nhập tên của bạn"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tagname</Text>
            <TextInput
              style={styles.input}
              value={tagname}
              onChangeText={setTagname}
              placeholder="Nhập tagname của bạn"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Story</Text>
            <TextInput
              style={[styles.input, styles.storyInput]}
              value={story}
              onChangeText={setStory}
              placeholder="Chia sẻ câu chuyện của bạn"
              multiline
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={() => updateInforAccount(name, tagname, story)}>
            <Text style={styles.submitButtonText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      {renderModalPickImage()}
      {rendermodalCamera(checkUpdataImg)}
      {renderModalLibrary(checkUpdataImg)}
    </>
  )
}


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
    height: 200,
  },
  editCoverButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editProfileImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 6,
  },
  form: {
    marginTop: 60,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: 'black'
  },
  storyInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#F8C630',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
})