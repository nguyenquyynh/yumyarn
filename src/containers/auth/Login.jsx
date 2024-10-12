import { Alert, FlatList, ImageBackground, Pressable, StyleSheet, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { Text, View, Colors, Image, Button, Icon, Checkbox, RadioGroup, RadioButton, TouchableOpacity } from 'react-native-ui-lib'
import { t } from 'lang'
import IconApp from 'components/IconApp'
import { userLogin } from 'src/hooks/api/auth'
import { useDispatch, useSelector } from 'react-redux'
import { auth_login } from 'reducers/auth'
import Modals from 'components/BottomSheetApp'
import { setting_changelanguage } from 'reducers/setting'
import TextApp from 'components/commons/TextApp'
import NotificationModalApp from 'components/commons/NotificationModalApp'
import Animated from 'react-native-reanimated'

const Login = () => {
    const dishpatch = useDispatch()
    const setting = useSelector(state => state.setting)
    const fcm = useSelector(state => state.fcm);

    const [showNotifi, setShowNotifi] = useState(false)
    const [notifycontent, setNotifycontent] = useState('')
    const [isShowModal, setIsShowModal] = useState(false)
    const [policy, setPolicy] = useState(false)
    const [lang, setLang] = useState('Language')

    const handlerAuthenSignin = async () => {
        if (policy) {
            const reponse = await userLogin(fcm.fcmtoken)
            if (reponse.status) {
                ToastAndroid.show("Login success", ToastAndroid.SHORT)
                await dishpatch(auth_login({
                    user: reponse.data.data,
                    token: reponse.data.token,
                    isLogin: true,
                }))
            } else {
                setShowNotifi(true)
                setNotifycontent(reponse.data)
            }
        } else {
            setNotifycontent(t("login.agree"))
            setShowNotifi(true)
        }
    }
    const language = [
        { title: 'English', value: 'en', icon: 'english' },
        { title: 'Vietnamese', value: 'vi', icon: 'vietnam' },
        { title: 'Chinese', value: 'cn', icon: 'china' },
        { title: 'French', value: 'fr', icon: 'france' },
        { title: 'Japanese', value: 'jp', icon: 'japan' },
    ]
    const renderItemLanguage = (item) => {
        const handlerChangeLanguage = () => {
            dishpatch(setting_changelanguage(item.value))
            setLang(item?.title)
            setIsShowModal(false)
        }
        return (<View row centerV paddingH-x>
            <View padding-x row flex >
                <IconApp assetName={item?.icon} size={25} />
                <Text left marginL-xx text80BO>{item?.title}</Text>
            </View>
            <View flex right>
                <Checkbox
                    color={Colors.yellow}
                    value={item.value == setting.language}
                    onValueChange={handlerChangeLanguage} />
            </View>
        </View>)
    }

    return (
        <View flex>
            <View flex>
                <Image source={{ uri: 'https://images.pexels.com/photos/744780/pexels-photo-744780.jpeg' }} style={styles.bg_image} />
                <View absB spread centerH padding-xx bg-white style={styles.bg_content}>
                    <View center>
                        <Icon assetName='logoapp' size={100} />
                        <Text text40BO color={Colors.yellow} style={styles.shadown}>{t('wellcome.greeting')}</Text>
                        <Text text40BO color={Colors.yellow} style={styles.shadown}>{t('app.name_app')}</Text>
                        <Text text60L marginT-xx>{t("login.slogan")}</Text>
                    </View>

                    <Pressable onPress={() => { setIsShowModal(true) }} >
                        <View center row>
                            <Text text70BO>{lang}</Text>
                            <IconApp assetName={"right_arrow"} size={12} />
                        </View>
                    </Pressable>
                    <Animated.View sharedTransitionTag='btn_auth' style={{ width: 350, alignSelf: 'center' }}>
                        <TouchableOpacity bg-yellow paddingV-xiii paddingH-xx row br30 centerV spread style={styles.shadown} onPress={handlerAuthenSignin}>
                            <Icon assetName='google' size={28} />
                            <View flex center>
                                <Text color='white' text65BO>{t("login.google")}</Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                    <View style={styles.viewpolicy} center row >
                        <TextApp text={"login.i_read"} />
                        <TextApp text={"login.policy"} color={Colors.yellow} />
                        <View marginL-x>
                            <Checkbox color={Colors.yellow} value={policy} onValueChange={() => { setPolicy(!policy) }} />
                        </View>
                    </View>
                </View>
            </View>
            <Modals modalVisible={isShowModal} modalhiden={setIsShowModal}>
                <View>
                    <Text color={Colors.yellow} xviiiText text60BO marginB-x style={styles.language}>Select language</Text>
                    <FlatList
                        data={language}
                        renderItem={({ item }) => renderItemLanguage(item)}
                    />
                </View>
            </Modals>
            <NotificationModalApp asseticon={"dont"} modalVisible={showNotifi} modalhiden={setShowNotifi} content={notifycontent} title={t("app.warning")} />
        </View>

    )
}

export default Login

const styles = StyleSheet.create({
    bg_image: { with: '100%', height: '50%' },
    bg_content: { width: '100%', height: '60%', borderTopLeftRadius: 20, borderTopRightRadius: 20, },
    shadown: {
        elevation: 5,
        textShadowColor: 'lightgray',
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 10,
    }
})