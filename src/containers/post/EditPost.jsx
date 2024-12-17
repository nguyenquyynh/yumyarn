import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Wapper from 'components/Wapper';
import { t } from 'lang';
import { Colors, Icon, Image, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import ButtonApp from 'components/ButtonApp';
import IconApp from 'components/IconApp';
import Modals from 'components/BottomSheetApp';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';
import ImageAndVideoLibary from 'containers/camera/ImageAndVideoLibary';
import { editmypost } from 'src/hooks/api/post';
import CameraApp from 'containers/camera/CameraApp';
import NotificationModalApp from 'components/commons/NotificationModalApp';
import { useSelector } from 'react-redux';
import { B } from 'configs/fonts';
import LoadingApp from 'components/commons/LoadingApp';
import Avatar from 'components/Avatar';
import LottieView from 'lottie-react-native';
import lottie from 'configs/ui/lottie';
import { launchImageLibrary } from 'react-native-image-picker';
import { isCleanContent } from 'src/middleware/contentmiddleware';
import { Upload } from 'src/libs/UploadImage';

const EditPost = ({ route }) => {
  const navigation = useNavigation();
  const user = useSelector(state => state.auth.user);
  const [post, setpost] = useState(route.params.post);
  const address = route.params?.address || route.params.post?.address;
  const [modelshow, setModelshow] = useState(false);
  const [statusAction, setStatusAction] = useState(false);
  const [open_camera, setopen_camera] = useState(false);
  const [isnotifiy, setIsnotifiy] = useState(false);
  const [notifycontent, setNotifycontent] = useState('');
  const [notifytitle, setNotifytitle] = useState('');
  const [images, setImages] = useState(post?.media || []);
  const [is_loading, setis_loading] = useState(false);
  const [content, setcontent] = useState(post?.content);
  const [hashtag, sethashtag] = useState('');
  const [showHashtag, setShowHashtag] = useState(false);
  const [hashtaglist, sethashtaglist] = useState(post?.hashtags || []);

  // Hàm xóa ảnh
  const handleRemoveImage = item => {
    setImages(images.filter(image => image !== item));
  };

  // Hàm show model 
  const handlerAddImage = () => {
    setModelshow(true);
  };

  const buttonright = () => {
    return (
      <ButtonApp
        iconleft={'search'}
        iconright={'notifycation'}
        color={Colors.white}
        padding={'padding-10'}
        sizeText={14}
        title={t('create_post.post')}
        onclick={checkCreatePost}
      />
    );
  };

  const onUploadMedia = async file => {
    const { uri, type, name } = file;
    try {
      const newData = await Upload(uri, type, name);
      return newData;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const checkCreatePost = async () => {
    if (!isCleanContent(content)) return

    if (content.trim() === '') {
      setNotifytitle(t('title_model.content_error'));
      setNotifycontent(t('title_model.post_faile'));
      setIsnotifiy(true);
    } else if (images.length <= 0) {
      setNotifytitle(t('title_model.image_error'));
      setNotifycontent(t('title_model.post_faile'));
      setIsnotifiy(true);
    } else if (!address) {
      setNotifytitle(t('title_model.address_error'));
      setNotifycontent(t('title_model.post_faile'));
      setIsnotifiy(true);
    } else {
      editPost();
    }
  };

  const extractHashtags = inputString => {
    const words = inputString.split(' ');
    const result = [];
    for (let ele of words) {
      if (ele.startsWith('#')) {
        result.push(ele.substring(1));
      }
    }
    return result;
  };

  const handleAddHashtag = () => {
    if (!isCleanContent(hashtag)) return;
    const key = validateHashtag(hashtag)
    if (hashtaglist.findIndex((item) => item === key) > -1) {
      ToastAndroid.show(t("error.duplicatetag"), ToastAndroid.SHORT)
      return;
    }

    if (key) {
      sethashtaglist(prev => [...prev, key]);
      sethashtag('');
    }
  };

  const hanldeRemoveHashtag = tag => {
    sethashtaglist(hashtaglist.filter(item => item != tag));
  };

  const editPost = async () => {
    if (!isCleanContent(content)) return

    try {
      setis_loading(true);
      const imageupclound = images.filter(
        item => typeof item === 'object' && item,
      );

      console.log(imageupclound);

      const imageuporigin = images.filter(
        item => typeof item === 'string' && item,
      );

      const upImage = async imageupclound => {
        const uploadPromises = imageupclound.map(image => onUploadMedia(image));
        const uploadedUrls = await Promise.all(uploadPromises);

        console.log('uploadedUrls', uploadedUrls);

        return uploadedUrls.filter(url => url !== null);
      };
      var validUrls = await upImage(imageupclound);

      console.log('validUrls', validUrls);

      const body = {
        _id: post?._id,
        media: [...imageuporigin, ...validUrls],
        address: {
          ...address,
          detail: address.name || address.detail,
        },
        create_by: user?._id,
        hashtags: hashtaglist,
        content: content,
      };

      const response = await editmypost(body);
      setStatusAction(response.status);
      if (response.status) {
        setImages([]);
        sethashtag('');
        setcontent('');

        setNotifytitle(t('title_model.success'));
        setNotifycontent(t('title_model.post_success'));
        setIsnotifiy(true);
      } else {
        setNotifytitle(t('title_model.error'));
        setNotifycontent(t('title_model.post_faile'));
        setIsnotifiy(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setis_loading(false);
    }
  };

  // Render item media
  const renderItem = ({ item }) => (
    <View style={styles.imageWrapper}>
      {item?.uri ? (
        item?.uri?.endsWith('.mp4') ? (
          <Video
            source={{ uri: item.uri || item }}
            style={styles.imageitem}
            paused
            controls
          />
        ) : (
          <Image source={{ uri: item.uri || item }} style={styles.imageitem} />
        )
      ) : item?.endsWith('.mp4') ? (
        <Video source={{ uri: item }} style={styles.imageitem} paused controls />
      ) : (
        <Image source={{ uri: item }} style={styles.imageitem} />
      )}
      <TouchableOpacity
        style={styles.removeIcon}
        onPress={() => handleRemoveImage(item)}>
        <IconApp assetName={'cancel'} size={20} color={'red'} />
      </TouchableOpacity>
    </View>
  );
  //Modal pick Media
  const renderModalPickImage = () => {
    return (
      <Modals modalhiden={setModelshow} modalVisible={modelshow}>
        <View style={styles.modals}>
          <TouchableOpacity
            centerH
            centerV
            onPress={() => setopen_camera(true)}>
            <IconApp assetName={'diaphragm'} size={50} />
            <Text style={styles.textcamera}>{t('app.camera')}</Text>
          </TouchableOpacity>
          <TouchableOpacity centerH centerV onPress={() => selectMedia()}>
            <IconApp assetName={'library'} size={50} />
            <Text style={styles.textlibrary}>{t('app.library')}</Text>
          </TouchableOpacity>
        </View>
      </Modals>
    );
  };
  //Modal camera
  const rendermodalCamera = () => {
    return (
      <Modal visible={open_camera} animationType="slide" statusBarTranslucent>
        <CameraApp
          closeModal={() => setopen_camera(false)}
          updateListMedia={medias => {
            if (medias != null) {
              const filename = medias.path.split('/').pop();
              var one_media = {
                id: images.length + 1,
                type: medias.path.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg',
                uri: 'file://' + medias.path,
                name: filename,
              };

              images.push(one_media);
            }
            setModelshow(!modelshow);
          }}
        />
      </Modal>
    );
  };

  const selectMedia = async () => {
    let options = {
      mediaType: 'mixed', // 'photo' cho chỉ ảnh, 'video' cho chỉ video, 'mixed' cho cả hai
      selectionLimit: 0,
      storageOptions: {
        skipBackup: true,
      },
    };

    await launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled media picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const abc = response.assets.map(ele => {
          if (ele != null) {
            return {
              id: images.length + 1,
              type: ele.type,
              uri: ele.uri,
              name: ele.fileName,
            };
          }
        });

        if (abc) {
          setImages(preved => [...preved, ...abc]);
        }
      }
    });

    setModelshow(false);
  };

  //Modal notify
  const renderNotification = () => {
    return (
      <NotificationModalApp
        modalhiden={setIsnotifiy}
        modalVisible={isnotifiy}
        funt={() => {
          if (notifycontent == t('title_model.post_success')) {
            navigation.navigate('Main');
          } else {
            setIsnotifiy(false);
          }
        }}
        title={notifytitle}
        asseticon={statusAction ? 'done' : 'dont'}
        content={notifycontent}
      />
    );
  };
  if (is_loading) {
    return (
      <View flex>
        <View flex bg-white>
          <View flex center>
            <LottieView
              source={lottie.UpLoading}
              autoPlay
              loop
              style={{ width: 100, height: 100 }}
            />
          </View>
        </View>
      </View>
    );
  }
  const renderHashtag = () => {
    return (
      <Modal
        transparent
        visible={showHashtag}
        statusBarTranslucent
        animationType="fade"
        onRequestClose={() => {
          setShowHashtag(false);
        }}>
        <View
          style={{
            backgroundColor: Colors.tr_black,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            flex
            onPress={() => {
              setShowHashtag(false);
            }}
          />
          <View
            bg-white
            padding-10
            style={{ width: '100%', minHeight: 150, maxHeight: 500 }}>
            <ScrollView>
              <View
                flex
                style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                {hashtaglist.map(item => (
                  <View key={item} bg-yellow row centerV paddingH-5 br40>
                    <Text marginR-5 color={Colors.white} text80BO>
                      {item}
                    </Text>
                    <TouchableOpacity
                      bg-red
                      br40
                      onPress={() => hanldeRemoveHashtag(item)}>
                      <Icon assetName="cancel" size={15} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </ScrollView>
            <View
              style={{ width: '100%' }}
              br20
              row
              paddingV-5
              marginV-5
              height={50}>
              <TextInput
                focusable={true}
                style={{
                  flex: 5,
                  backgroundColor: 'white',
                  borderRadius: 70,
                  fontWeight: 'bold',
                  fontSize: 12,
                  borderWidth: 1,
                  marginRight: 10,
                  paddingLeft: 10,
                }}
                value={hashtag?.trim()?.replace(/\s+/g, '')}
                onChangeText={sethashtag}
                color={Colors.yellow}
                onEndEditing={handleAddHashtag}
                placeholder={t('create_post.hashtag_hint')}
                placeholderTextColor="black"
                maxLength={40}
              />
              <TouchableOpacity
                flex-1
                bg-yellow
                center
                br50
                onPress={handleAddHashtag}>
                <Text text90BO>{t('app.add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            flex
            onPress={() => {
              setShowHashtag(false);
            }}
          />
        </View>
      </Modal>
    );
  };
  return (
    <Wapper
      gadient
      renderleft
      funtleft={() => {
        navigation.goBack();
      }}
      iconleft={'back'}
      title={t('post.edit')}
      customright={buttonright}>
      <View style={styles.container}>
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
              placeholder={t('create_post.content_hint')}
              placeholderTextColor="black"
              multiline
            />
            <View
              flex
              marginV-10
              style={{ flexWrap: 'wrap', flexDirection: 'row', gap: 5 }}>
              {hashtaglist.map(item => (
                <View bg-yellow row centerV paddingH-5 br40>
                  <Text marginR-5 color={Colors.white} text80BO>
                    {item}
                  </Text>
                  <TouchableOpacity
                    bg-red
                    br40
                    onPress={() => hanldeRemoveHashtag(item)}>
                    <Icon assetName="cancel" size={15} />
                  </TouchableOpacity>
                </View>
              ))}
              <View>
                <Text
                  text80BO
                  style={{ borderRadius: 20, paddingHorizontal: 10 }}
                  bg-yellow
                  onPress={() => setShowHashtag(true)}>
                  #Hashtag
                </Text>
              </View>
            </View>
            <FlatList
              scrollEnabled={false}
              style={styles.imageListContainer}
              data={images}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </ScrollView>
        </View>
        <View bg-white style={styles.footer}>
          <TouchableOpacity style={{ width: '100%' }} onPress={handlerAddImage}>
            <View style={styles.contentlocation}>
              <IconApp assetName={'diaphragm'} size={25} />
              <Text numberOfLines={1} style={styles.textloctation}>
                {address?.title || t('create_post.image_hint')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ width: '100%' }}
            onPress={() => {
              navigation.navigate('Adddrressscreen', {
                back: 'EditPost',
                defaultlocation: post?.address,
              });
            }}>
            <View style={styles.contentlocation}>
              <IconApp assetName={'location'} size={25} />
              <View flex>
                <Text numberOfLines={1} style={styles.textloctation}>
                  {address?.name || post?.address?.detail}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      {renderModalPickImage()}
      {rendermodalCamera()}
      {renderNotification()}
      {renderHashtag()}

    </Wapper>
  );
};

export default EditPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  body: {
    flex: 2,
    borderColor: 'black',
    margin: 10,
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
    color: 'black',
  },
  textlibrary: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
  },
  contentlocation: {
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: 'black',
    flexDirection: 'row',
    padding: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textloctation: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  imageListContainer: {},
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  imageitem: {
    height: 200,
    borderColor: '#ccc',
    backgroundColor: '#D9D9D9',
    marginBottom: 10,
  },
  removeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
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
    padding: 10,
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
