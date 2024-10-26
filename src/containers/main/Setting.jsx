import {
  Alert,
  FlatList,
  ImageBackground,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {memo, useState} from 'react';
import {
  Avatar,
  Colors,
  Icon,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import {t} from 'lang';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {auth_logout} from 'reducers/auth';
import languageFormat from 'configs/ui/languages';
import {setting_changelanguage} from 'reducers/setting';
import TextApp from 'components/commons/TextApp';
import OptionSetting from 'components/settings/OptionSetting';
import { logout } from 'src/hooks/api/profile';

const Setting = () => {
  const auth = useSelector(state => state.auth.user);
  const socket = useSelector(state => state.fcm.socket);
  const setting = useSelector(state => state.setting);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showlanguage, setshowlanguage] = useState(false);

  const handlerSignout = async () => {
    await logout(auth?._id)
    socket.emit('logout', {id: auth?._id});
    await dispatch(auth_logout());
  };

  const renderLanguage = item => {
    const handlerChangeLanguage = key => {
      dispatch(setting_changelanguage(key));
      setshowlanguage(false);
    };
    return (
      <TouchableOpacity
        left
        padding-v
        row
        centerV
        onPress={() => handlerChangeLanguage(item.key)}>
        <Text margin-v style={styles.title} marginR-xx>
          {item.name}
        </Text>
        {item.key == setting.language && (
          <Icon assetName="check" tintColor={Colors.yellow} size={18} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View flex bg-puper padding-x>
      <ImageBackground
        source={{uri: auth.avatar}}
        resizeMode="cover"
        style={styles.card_logout}>
        <View br100 marginL-x style={{borderWidth: 2, borderColor: 'white'}}>
          <Avatar source={{uri: auth.avatar}} />
        </View>
        <TouchableOpacity marginR-xx onPress={handlerSignout}>
          <Icon assetName="log_out" size={24} />
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.language}>
        <TouchableOpacity
          padding-x
          row
          spread
          onPress={() => {
            setshowlanguage(!showlanguage);
            LayoutAnimation.easeInEaseOut()
          }}>
          <View row center>
            <Icon assetName="languages" size={25} />
            <TextApp style={styles.title} text={'setting.language'} />
          </View>
          <View row center>
            <Text marginH-x style={styles.title}>
              {languageFormat(setting.language)}
            </Text>
            <Icon
              assetName={!showlanguage ? 'arrow_down' : 'tickCamera'}
              size={15}
            />
          </View>
        </TouchableOpacity>
        {showlanguage && (
          <View>
            <FlatList
              key={item => item.key}
              data={languages}
              renderItem={({item}) => renderLanguage(item)}
            />
          </View>
        )}
      </View>
      <OptionSetting navigation={navigation} />
    </View>
  );
};

export default memo(Setting);

const styles = StyleSheet.create({
  card_logout: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 10,
  },
  language: {
    marginTop: 20,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
  },
  title: {
    fontSize: 16,
    marginLeft: 10,
  },
});

var languages = [
  {key: 'vi', name: 'Viet Nam'},
  {key: 'cn', name: 'China'},
  {key: 'jp', name: 'Japan'},
  {key: 'en', name: 'English'},
];
