import {
  Alert,
  FlatList,
  ImageBackground,
  LayoutAnimation,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Colors,
  Icon,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import { t } from 'lang';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { auth_logout } from 'reducers/auth';
import languageFormat from 'configs/ui/languages';
import { setting_changelanguage } from 'reducers/setting';
import TextApp from 'components/commons/TextApp';
import OptionSetting from 'components/settings/OptionSetting';
import { logout } from 'src/hooks/api/profile';
import Avatar from 'components/Avatar';
import NotificationModalApp from 'components/commons/NotificationModalApp';

const Setting = () => {
  const auth = useSelector(state => state.auth.user);
  const socket = useSelector(state => state.fcm.socket);
  const setting = useSelector(state => state.setting);
  const isfocus = useIsFocused()
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showlanguage, setshowlanguage] = useState(false);
  const [showLogout, setshowLogout] = useState(false);

  const handlerSignout = async () => {
    await logout(auth?._id)
    socket.emit('logout', { id: auth?._id });
    await dispatch(auth_logout());
  };

  const renderLanguage = (item) => {
    const handlerChangeLanguage = async (key) => {
      if (setting.language === key) return
      await dispatch(setting_changelanguage(key))
      await setshowlanguage(false)
    }
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

  useEffect(() => {
    if (showlanguage) setshowlanguage(false)
  }, [isfocus])
  return (
    <View flex bg-puper padding-x>
      <ImageBackground
        source={{ uri: 'https://cdn.pixabay.com/photo/2021/02/12/18/14/wallpaper-6009269_640.png' }}
        resizeMode="cover"
        style={styles.card_logout}>
        <View br100 marginL-x style={{ borderWidth: 2, borderColor: 'white' }}>
          <Avatar source={{ uri: auth.avatar }} size={50} />
        </View>
        <TouchableOpacity marginR-xx onPress={() => setshowLogout(true)}>
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
              renderItem={({ item }) => renderLanguage(item)}
            />
          </View>
        )}
      </View>
      <OptionSetting navigation={navigation} showlanguage={showlanguage} />
      <NotificationModalApp asseticon={"dont"} modalVisible={showLogout} modalhiden={setshowLogout} funt={() => { handlerSignout() }} content={t("app.Logout_check")} title={t("app.Logout_check")} />
    </View>
  );
};

export default Setting;

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
  { key: 'vi', name: 'Viet Nam' },
  { key: 'cn', name: 'China' },
  { key: 'jp', name: 'Japan' },
  { key: 'en', name: 'English' },
];
