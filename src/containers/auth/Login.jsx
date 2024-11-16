import { Alert, FlatList, ImageBackground, Pressable, StyleSheet, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import { B, R, SBI } from 'configs/fonts'
import { useNavigation } from '@react-navigation/native'

const Login = () => {
    const navigation = useNavigation()
    const dishpatch = useDispatch()
    const setting = useSelector(state => state.setting)
    const fcm = useSelector(state => state.fcm);

    const [showNotifi, setShowNotifi] = useState(false)
    const [notifycontent, setNotifycontent] = useState('')
    const [isShowModal, setIsShowModal] = useState(false)
    const [policy, setPolicy] = useState(false)
    const [lang, setLang] = useState(0)

    useEffect(() => {
        setLang(language.findIndex(item => item.value === setting?.language))
    }, [])

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
        { id: 0, title: 'English', value: 'en', icon: 'english' },
        { id: 1, title: 'Vietnamese', value: 'vi', icon: 'vietnam' },
        { id: 2, title: 'Chinese', value: 'cn', icon: 'china' },
        { id: 3, title: 'Japanese', value: 'jp', icon: 'japan' },
    ]
    const renderItemLanguage = (item) => {
        const handlerChangeLanguage = () => {
            dishpatch(setting_changelanguage(item.value))
            setLang(item?.id)
            setIsShowModal(false)
        }
        return (<TouchableOpacity row centerV paddingH-x onPress={handlerChangeLanguage}>
            <View padding-x row flex >
                <IconApp assetName={item?.icon} size={25} />
                <Text left marginL-xx text80BO>{item?.title}</Text>
            </View>
            <View flex right>
                <Checkbox
                    color={Colors.yellow}
                    value={item.value == setting.language} />
            </View>
        </TouchableOpacity>)
    }

    return (
        <View flex>
            <View flex>
                <Image source={{ uri: 'https://images.pexels.com/photos/744780/pexels-photo-744780.jpeg' }} style={styles.bg_image} />
                <View absB spread centerH padding-xx bg-white style={styles.bg_content}>
                    <View center>
                        <View padding-10 style={{ elevation: 100 }}>
                            <Icon assetName='logoapp' size={100} />
                        </View>
                        <Text text40BO color={Colors.yellow} style={styles.shadown}>{t('app.name_app')}</Text>
                        <View row style={{ width: '100%', flexWrap: 'wrap', gap: 5 }} marginT-xx>
                            <TextApp style={styles.slogan} text={"login.slogan1"} />
                            <TextApp style={styles.slogan} text={"login.slogan2"} />
                        </View>
                    </View>
                    <TouchableOpacity style={{ position: 'absolute', top: 20, left: 20 }} onPress={() => { setIsShowModal(true) }} >
                        <View center row>
                            <Icon assetName={language[lang].icon} size={25} />
                        </View>
                    </TouchableOpacity>
                    <View centerH bottom>
                        <Animated.View sharedTransitionTag='btn_auth' style={{ width: 350, alignSelf: 'center' }}>
                            <TouchableOpacity bg-yellow paddingV-xiii paddingH-xx row br30 centerV spread style={styles.shadown} onPress={handlerAuthenSignin}>
                                <Icon assetName='google' size={28} />
                                <View flex center>
                                    <TextApp color='white' size={18} style={{ fontFamily: B }} text={"login.google"} />
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                        <View style={styles.viewpolicy} center row margin-20>
                            <TextApp text={"login.i_read"} />
                            <TextApp funt={() => navigation.navigate('Policy')} onPress text={"login.policy"} color={Colors.yellow} />
                            <View marginL-x>
                                <Checkbox color={Colors.yellow} value={policy} onValueChange={() => { setPolicy(!policy) }} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <Modals modalVisible={isShowModal} modalhiden={setIsShowModal}>
                <View>
                    <Text color={Colors.yellow} marginH-10 xviiiText text60BO marginB-x style={styles.language}>Select language</Text>
                    <FlatList
                        data={language}
                        renderItem={({ item }) => renderItemLanguage(item)}
                    />
                </View>
            </Modals>
            <NotificationModalApp asseticon={"done"} modalVisible={showNotifi} modalhiden={setShowNotifi} funt={() => { setPolicy(true); setShowNotifi(false) }} content={notifycontent} title={t("app.success")} />
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
    },
    slogan: { textAlign: 'center', fontSize: 18, fontFamily: SBI }
})