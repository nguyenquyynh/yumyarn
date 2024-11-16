import { LayoutAnimation, ScrollView, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import { Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import Wapper from 'components/Wapper';
import { t } from 'lang';
import { useNavigation } from '@react-navigation/native';
import TextApp from 'components/commons/TextApp';
import Modals from 'components/BottomSheetApp';
import { FlatList } from 'react-native-gesture-handler';
import { messageSetting, updateAutoMess } from 'src/hooks/api/profile';
import { useDispatch, useSelector } from 'react-redux';
import { udpateAutoChat, udpateMessageProfile } from 'reducers/auth';

const MessageSetting = () => {
  const profile = useSelector(state => state.auth.user);
  const socket = useSelector(state => state.fcm.socket);
  const navigation = useNavigation();

  const [showModal, setShowModal] = useState(false);
  const [showAutomes, setShowAutomes] = useState(false);
  const [automes, setAutomes] = useState(profile?.auto_messages);
  const [seleted, setSeleted] = useState(
    profile?.message_recive_status || 'ALL',
  );
  const [status, setStatus] = useState(profile?.message_active_status || false);
  const [seenstatus, setSeenStatus] = useState(
    profile?.message_reading_status || false,
  );
  const dispatch = useDispatch();
  const handlerSeleted = value => {
    updateMessage(value, status, seenstatus);
  };

  const updateMessage = async (selete, statu, seenstatu) => {
    try {
      const body = {
        message_recive_status: selete,
        message_active_status: statu,
        message_reading_status: seenstatu,
      };
      const response = await messageSetting(body);
      if (response.status) {
        if (response.data.message_recive_status != seleted)
          setSeleted(response.data.message_recive_status);
        if (response.data.message_active_status != status)
          setStatus(response.data.message_active_status);
        if (response.data.message_reading_status != seenstatus)
          setSeenStatus(response.data.message_reading_status);
        socket.emit('newOnlUser', {
          id: profile._id,
          message_recive_status: response?.data?.message_recive_status,
          message_active_status: response?.data?.message_active_status,
          message_reading_status: response?.data?.message_reading_status,
        });
        dispatch(
          udpateMessageProfile({
            message_recive_status: response.data.message_recive_status,
            message_active_status: response.data.message_active_status,
            message_reading_status: response.data.message_reading_status,
          }),
        );
      }
      LayoutAnimation.easeInEaseOut()
    } catch (error) {
      console.log(error);
    }
  };

  const handleAutoMes = () => {
    setShowAutomes(!showAutomes)
    LayoutAnimation.easeInEaseOut()
  }

  const handleSavedAutoMess = async () => {
    if ((automes?.trim().length === 0) || (automes?.trim() == profile?.auto_messages)) {
      return
    }

    await updateAutoMess({
      content_mess: automes
    }).then(() => {
      dispatch(udpateAutoChat(automes))
    }).catch(() => {

    }).finally(() => {
      setShowAutomes(false)
    })
  }

  return (
    <Wapper
      renderleft
      funtleft={() => navigation.goBack()}
      title={t('setting.setting_message')}>
      <View flex bg-light_grey padding-16>
        <View marginB-x style={styles.over}>
          <TouchableOpacity
            padding-x
            spread
            row
            left
            onPress={() => {
              setShowModal(true);
            }}>
            <TextApp style={styles.title} text={t('setting.exepctmes')} />
            <View centerV row>
              <Text marginH-5>{seleted}</Text>
              <Icon assetName="right_arrow" size={10} />
            </View>
          </TouchableOpacity>
        </View>
        <View marginB-x style={styles.over}>
          <TouchableOpacity
            padding-x
            spread
            row
            left
            onPress={() => {
              updateMessage(seleted, !status, seenstatus);
            }}>
            <TextApp style={styles.title} text={t('messenge.status')} />
            <View centerV row>
              <Icon assetName={status ? 'toggle_on' : 'toggle_off'} size={25} />
            </View>
          </TouchableOpacity>
        </View>
        <View marginB-x style={styles.over}>
          <TouchableOpacity
            padding-x
            left
            onPress={() => {
              updateMessage(seleted, status, !seenstatus);
            }}>
            <View centerV row>
              <View flex>
                <TextApp flex style={styles.title} text={t('messenge.seen')} />
              </View>
              <Icon
                assetName={seenstatus ? 'toggle_on' : 'toggle_off'}
                size={25}
              />
            </View>
            <Text>{t('messenge.seen_d')}</Text>
          </TouchableOpacity>
        </View>
        <View marginB-x style={[styles.over]}>
          <TouchableOpacity
            padding-x
            left
            onPress={handleAutoMes}>
            <View centerV row>
              <View flex>
                <TextApp flex style={styles.title} text={t('messenge.auto_mes')} />
              </View>
              <Icon
                assetName={'bot'}
                size={25}
              />
            </View>
            <Text>{t('messenge.auto_mes_d')}</Text>
          </TouchableOpacity>
          {showAutomes && <View padding-10>
            <TextInput multiline textAlignVertical='top' textBreakStrategy='simple' style={styles.input} value={automes} onChangeText={setAutomes} />
            <TouchableOpacity marginT-xx marginV-5 padding-5 bg-yellow br30 style={{ borderColor: Colors.yellow, borderWidth: 1 }} onPress={handleSavedAutoMess}>
              <Text center text70BO color='white'>{t("post.save")}</Text>
            </TouchableOpacity>
          </View>}
        </View>
      </View>
      <Modals modalVisible={showModal} modalhiden={setShowModal}>
        <View paddingH-16>
          <Text text70BO style={styles.Text}>
            {t('setting.mesOptions')}
          </Text>
          <Text text90R>{t('setting.whosend')}</Text>
          <FlatList
            data={listoptions}
            key={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                padding-5
                marginB-10
                row
                centerV
                onPress={() => {
                  handlerSeleted(item.value);
                }}>
                <View flex-9>
                  <Text text80BO>{t(item?.title)}</Text>
                  <Text>{t(item?.content)}</Text>
                </View>
                <View flex>
                  {item.value === seleted && (
                    <Icon
                      assetName="check"
                      tintColor={Colors.yellow}
                      size={20}
                    />
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modals>
    </Wapper>
  );
};
export default MessageSetting;

const styles = StyleSheet.create({
  Text: {
    textAlign: 'center',
  },
  over: {
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
    padding: 5,
  },
  title: {
    fontSize: 16,
  },
  input: { padding: 10, lineHeight: 20, color: 'black', width: '100%', height: 'auto', borderWidth: 1, borderRadius: 10, backgroundColor: 'white' }
});

var listoptions = [
  { id: 1, value: 'ALL', title: 'messenge.people', content: 'messenge.people_d' },
  {
    id: 2,
    value: 'FRIEND',
    title: 'messenge.friend',
    content: 'messenge.friend_d',
  },
  {
    id: 3,
    value: 'NOBODY',
    title: 'messenge.nobody',
    content: 'messenge.nobody_d',
  },
];
