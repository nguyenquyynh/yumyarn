import { ImageBackground, StyleSheet } from 'react-native'
import React from 'react'
import { Text, View, Colors, Image, Button } from 'react-native-ui-lib'
import { t } from 'lang'

const Login = () => {
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
                        style={{ left: 20 }}
                    />
                </View>
                <Button style={styles.button}>
                    <Image
                        source={require("../../assets/icon/gg.png")}
                    />
                    <Text xviiText>{t("login.google")}</Text>
                </Button>
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
    textCenter: {
        alignSelf: 'center',
        marginTop: 80
    },
    button:{
        width:322,
        height:55,
        justifyContent:'space-evenly',
        backgroundColor:'#FFFFFF',
        alignSelf:'center',
        marginTop:43,
        borderRadius:20
      },
})