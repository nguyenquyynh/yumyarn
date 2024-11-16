import React from 'react';
import { View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const ImageAndVideoLibary = (props) => {
  const { updateListMedia, closeModal } = props

  const selectMedia = async () => {
    let options = {
      mediaType: 'mixed', // 'photo' cho chỉ ảnh, 'video' cho chỉ video, 'mixed' cho cả hai
      selectionLimit: 0,
      storageOptions: {
        skipBackup: true,
      }
    };

    await launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled media picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        console.log(response.assets);

        updateListMedia(response.assets)
      }
      closeModal(false)

    });


  };

  selectMedia()

  return (
    <View>
      
    </View>
  );
};

export default ImageAndVideoLibary;