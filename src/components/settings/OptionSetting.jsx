import { FlatList, ScrollView, StyleSheet, ToastAndroid } from 'react-native'
import React from 'react'
import { Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import TextApp from 'components/commons/TextApp'
import Clipboard from '@react-native-clipboard/clipboard';
import { useSelector } from 'react-redux';

const OptionSetting = ({ navigation, showlanguage }) => {
    const user = useSelector(state => state.auth.user._id);
    const handlerClipboard = () => {
        ToastAndroid.show("Liên kế đã thêm vào bộ nhớ tạm !", ToastAndroid.SHORT)
        Clipboard.setString(`${process.env.BASEAPI_URL + "share/OtherProfile/" + user}/`);
    }
    const onShare = async (link) => {
        try {
          const result = await Share.share({
            message:
              link,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          Alert.alert(error.message);
        }
      };
    const optionsuser = [
        { id: 1, title: "setting.saved", icon: "crop", funt: () => { navigation.navigate('PostSaved') } },
        { id: 5, title: "setting.report", icon: "report", funt: () => { navigation.navigate('Report') } },
        { id: 2, title: "setting.advertisement", icon: "advertisement", funt: () => { navigation.navigate('Advertisement') } },
        { id: 3, title: "setting.payment", icon: "wallet", funt: () => { navigation.navigate('Payment') } },
        { id: 4, title: "setting.link", icon: "link", funt: handlerClipboard },
    ]
    const optionssetting = [
        { id: 10, title: "setting.privacy_policy", icon: "insurance", funt: () => { navigation.navigate('Policy') } },
        { id: 6, title: "setting.help", icon: "question", funt: () => { navigation.navigate('HelpSupport') } },
        { id: 7, title: "setting.setting_message", icon: "mailing", funt: () => { navigation.navigate('MessageSetting') } },
        { id: 9, title: "setting.setting_dice", icon: "dice", funt: () => { navigation.navigate('Extentions') } },
        { id: 8, title: "setting.about_us", icon: "info", funt: () => { navigation.navigate('About') } },
    ]

    return (
        <ScrollView scrollEnabled={!showlanguage}>
            <View flex marginT-x >
                <View style={styles.over}>
                    <FlatList
                        scrollEnabled={false}
                        data={optionsuser}
                        key={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity marginB-x disabled={showlanguage} padding-x row left onPress={item.funt}>
                                <Icon assetName={item.icon} size={25} marginR-x tintColor='black' />
                                <TextApp style={styles.title} text={item.title} />
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View marginT-x style={styles.over}>
                    <FlatList
                        scrollEnabled={false}
                        data={optionssetting}
                        key={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity marginB-x disabled={showlanguage} padding-x row left onPress={item.funt}>
                                <Icon assetName={item.icon} size={25} marginR-x tintColor='black' />
                                <TextApp style={styles.title} text={item.title} />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </ScrollView>

    )
}

export default OptionSetting

const styles = StyleSheet.create({
    over: {
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        elevation: 2,
    },
    title: {
        fontSize: 16,
    }
})