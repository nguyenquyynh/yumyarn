import { ImageBackground, StyleSheet } from 'react-native'
import React from 'react'
import { Text, View, Colors, Image, Button, Icon, Checkbox } from 'react-native-ui-lib'
import { t } from 'lang'
import IconApp from 'components/IconApp'
import { userLogin } from 'src/hooks/api/auth'
import { useDispatch } from 'react-redux'
import { auth_login } from 'reducers/auth'

const Login = () => {
    const dispatch = useDispatch()
    const handlerAuthenSignin = async () => {
        console.log("login...............")
        const reponse =  await userLogin()
        await dispatch(auth_login(reponse))
    }
    return (
        <ImageBackground
            source={require("../../assets/icon/login.png")}
            style={styles.imageBackground}>
            <View flex>
                <Text xlText color={Colors.orange} style={styles.textCenter}>{t("app.name_app")}</Text>
                <View style={{ justifyContent: 'center', flexDirection: 'row', marginTop: 272 }}>
                    <Text largeText>Tiếng việt</Text>
                    <Image
                        source={require("../../assets/icon/down_arrow.png")}
                        style={styles.image}
                    />
                </View>
                <Button style={styles.button} onPress={handlerAuthenSignin}>
                    <IconApp assetName={"google"} />
                    <Text xviiText>{t("login.google")}</Text>
                </Button>
                <View style={styles.viewpolicy} >

                    <Text xviiText>{t("login.i_read")} <Text xviiText color={Colors.white} >{t("login.policy")}</Text></Text>

                    <Checkbox />
                </View>
            </View>
        </ImageBackground>

    )
}

export default Login

const styles = StyleSheet.create({
    imageBackground: {
        width: '100%',
        height: '100%',
    },
    image: {
        left: 20
    },
    textCenter: {
        alignSelf: 'center',
        marginTop: 80,
        fontWeight:'bold'
    },
    
    viewpolicy: {
        padding: 40,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    button: {
        width: 322,
        height: 55,
        justifyContent: 'space-evenly',
        backgroundColor: '#FFFFFF',
        alignSelf: 'center',
        marginTop: 43,
        borderRadius: 20
    },
})