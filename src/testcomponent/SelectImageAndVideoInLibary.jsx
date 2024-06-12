import React from 'react';
import {Button, View, Text, Image} from 'react-native';
import Video from 'react-native-video';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

const ImageAndVideoLibary = () => {
  const [mediaUri, setMediaUri] = React.useState(null);
  const [mediaType, setMediaType] = React.useState(null);

  const selectMedia = () => {
    let options = {
      mediaType: 'mixed', // 'photo' cho chỉ ảnh, 'video' cho chỉ video, 'mixed' cho cả hai
      selectionLimit: 5,
      storageOptions: {
        skipBackup: true,
      }
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled media picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        console.log(response);
        setMediaUri(response.assets[0].uri);
        setMediaType(response.assets[0].type);
      }
    });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="Chọn Ảnh/Video" onPress={selectMedia} />
      {mediaUri && mediaType?.includes('video') && (
        <Video
          source={{uri: mediaUri}}
          style={{width: 300, height: 300, marginTop: 20}}
          controls={true}
        />
      )}
      {mediaUri && mediaType?.includes('image') && (
        <Image
          source={{uri: mediaUri}}
          style={{width: 300, height: 300, marginTop: 20}}
        />
      )}
    </View>
  );
};

export default ImageAndVideoLibary;