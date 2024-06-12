import { FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import Wapper from 'components/Wapper';
import { t } from 'lang';
import { Colors, Image, TouchableOpacity } from 'react-native-ui-lib';
import ButtonApp from 'components/ButtonApp';
import IconApp from 'components/IconApp';
import Modals from 'components/BottomSheetApp';
import { useNavigation } from '@react-navigation/native';
import CameraApp from 'components/CameraApp';
import Video from 'react-native-video';
import ImageAndVideoLibary from 'containers/camera/ImageAndVideoLibary';

const MainPost = () => {
  const [modelshow, setModelshow] = useState(false);
  const [open_camera, setopen_camera] = useState(false);
  const [open_library, setopen_library] = useState(false)
  const navigation = useNavigation()
  const [images, setImages] = useState([
    { id: '1', uri: 'https://via.placeholder.com/150' },
    { id: '2', uri: 'https://via.placeholder.com/150' },
    { id: '3', uri: 'https://via.placeholder.com/150' },
    { id: '4', uri: 'https://via.placeholder.com/150' }
  ]);

  // Hàm xóa ảnh
  const handleRemoveImage = (id) => {
    setImages(images.filter(image => image.id !== id));
  };

  // Hàm show model
  const handlerAddImage = () => {
    setModelshow(true);
  };

  // Hàm chuyển component
  const gotoScreen = (screen) => {
    navigation.navigate(screen)
  }
  const buttonright = () => {
    return (
      <ButtonApp
        iconleft={"search"}
        iconright={"notifycation"}
        color={Colors.white}
        padding={'padding-10'}
        title={t("create_post.post")}
      />
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.imageWrapper}>
      { item.uri?.endsWith('.mp4') ?
        <Video source={{ uri: item.uri }} style={styles.imageitem} paused controls                             /> :
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
              placeholder={t("create_post.content_hint")}
              placeholderTextColor="black"
              multiline
            />
            <TextInput
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
              {t("create_post.loacation_hint")}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modals modalhiden={setModelshow} modalVisible={modelshow}>
        <View style={styles.modals}>
          <TouchableOpacity
            // style={styles.contentcamera} 
            onPress={() => setopen_camera(true)}>
            <IconApp assetName={"diaphragm"} size={50} />
            <Text style={styles.textcamera}>{t("app.camera")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
          // style={styles.contentlibrary}
          onPress={() => setopen_library(true)}
          >
            <IconApp assetName={"library"} size={50} />
            <Text style={styles.textlibrary}>{t("app.library")}</Text>
          </TouchableOpacity>
        </View>
      </Modals>

      <Modal visible={open_camera} animationType="slide">
        <CameraApp
          closeModal={() => setopen_camera(false)}
          updateListMedia={(medias) => {
            if(medias != null){
              var one_media = {
                id: images.length + 1,
                uri: medias
              }
              
              images.push(one_media)
            }         
          }}
        />
      </Modal>

      <Modal visible={open_library} animationType="slide">
        <ImageAndVideoLibary
          closeModal={() => setopen_library(false)}
          updateListMedia={(medias) => {
            if(medias.length > 0) {
              medias.forEach(ele => {
                if(ele != null){
                  var one_media = {
                    id: images.length + 1,
                    uri: ele.uri
                  }
                  
                  images.push(one_media)
                } 
              });
            }
                    
          }}
        />
      </Modal>
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
    justifyContent: 'center'
  },
  modals: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    alignItems: 'center',
    justifyContent: 'center'
  },
  textloctation: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 20
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
