import {Pressable, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Icon, Text, View} from 'react-native-ui-lib';
import {firePost} from 'src/hooks/api/fire';

const InteractPost = props => {
  const {id, handleOpenComment, countFire, countComment, isFire, idUser} =
    props;
  const [fireStatus, setFireStatus] = useState(isFire);
  const [countFireStatus, setCountFireStatus] = useState(countFire);
  const toggleFire = async () => {
    try {
      setFireStatus(!fireStatus);
      setCountFireStatus(fireStatus ? countFireStatus - 1 : countFireStatus + 1);
      const response = await firePost(idUser, id);
      if (!response.status) {
        setFireStatus(fireStatus);
        console.log(response.data);
        setCountFireStatus(countFireStatus);
      }
    } catch (error) {
      console.log(error);
      setFireStatus(fireStatus);
      setCountFireStatus(countFireStatus);
    }
  };

  return (
    <View bg-white row spread centerV paddingH-9 style={styles.container}>
      <Pressable style={styles.containerClick} onPress={toggleFire}>
        <Icon assetName={fireStatus ? 'fire' : 'fire_black'} size={19} />
        <Text text80BO>{countFireStatus}</Text>
      </Pressable>
      <Pressable
        style={styles.containerClick}
        onPress={() => handleOpenComment(id)}>
        <Icon assetName="comment" size={18} />
        <Text text80BO>{countComment}</Text>
      </Pressable>
      <Pressable style={styles.containerClick}>
        <Icon assetName="retweet" size={20} />
        <Text text80BO>Đăng lại</Text>
      </Pressable>
      <Pressable style={styles.containerClick}>
        <Icon assetName="send_white" size={20} />
        <Text text80BO>Chia sẻ</Text>
      </Pressable>
    </View>
  );
};

export default InteractPost;

const styles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: 30,
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
    alignSelf: 'center',
    gap: 15,
  },
  containerClick: {
    flexDirection: 'row',
    gap: 5,
  },
});
