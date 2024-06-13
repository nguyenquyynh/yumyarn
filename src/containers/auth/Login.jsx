import { Alert, FlatList, ImageBackground, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Text, View, Colors, Image, Button, Icon, Checkbox, RadioGroup, RadioButton } from 'react-native-ui-lib'
import { t } from 'lang'
import IconApp from 'components/IconApp'
import { userLogin } from 'src/hooks/api/auth'
import { useDispatch, useSelector } from 'react-redux'
import { auth_login } from 'reducers/auth'
import Modals from 'components/BottomSheetApp'
import { setting_changelanguage } from 'reducers/setting'
import TextApp from 'components/commons/TextApp'
import NotificationModalApp from 'components/commons/NotificationModalApp'

const Login = () => {
    const dishpatch = useDispatch()
    const setting = useSelector(state => state.setting)

    const [showNotifi, setShowNotifi] = useState(true)
    const [notifycontent, setNotifycontent] = useState('')
    const [isShowModal, setIsShowModal] = useState(false)
    const [policy, setPolicy] = useState(false)
    const [lang, setLang] = useState('Language')

    const handlerAuthenSignin = async () => {
        if (policy) {
            const reponse = await userLogin()
            if (reponse.status) {
                await dispatch(auth_login(reponse.data))
            } else {
                setShowNotifi(true)
                setNotifycontent(reponse.data)
            }
        } else {
            setNotifycontent("Please agree to the policy and privacy")
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
        <View bg-yellow flex>
            <View flex>
                <View centerH flex>
                    <Text margin-xl text20BO color={Colors.orange} center>{t("app.name_app")}</Text>
                    <IconApp assetName={"logoapp"} size={200} />
                </View>
                <View flex>
                    <Pressable onPress={() => { setIsShowModal(true) }} >
                        <View center row>
                            <Text text70BO>{lang}</Text>
                            <IconApp assetName={"arrow_down"} size={23} />
                        </View>
                    </Pressable>

                    <Button style={styles.button} onPress={handlerAuthenSignin}>
                        <View marginR-xx>
                            <IconApp assetName={"google"} />
                        </View>
                        <TextApp text={"login.google"} />
                    </Button>
                    <View style={styles.viewpolicy} center row padding-xl>
                        <TextApp text={"login.i_read"} />
                        <TextApp text={"login.policy"} color={Colors.white} />
                        <View marginL-x>
                            <Checkbox color='black' value={policy} onValueChange={() => { setPolicy(!policy) }} />
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
            <NotificationModalApp asseticon={"warning"} modalVisible={showNotifi} modalhiden={setShowNotifi} content={notifycontent} title={"Warning"}/>
        </View>

    )
}

export default Login

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 35,
        paddingVertical: 15,
        justifyContent: 'space-evenly',
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
        marginTop: 43,
        borderRadius: 20
    }
})