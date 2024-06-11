import { ImageBackground, StyleSheet, } from 'react-native'
import React from 'react'
import { Button, Colors, Image, Text, View } from 'react-native-ui-lib'
import { t } from 'lang'

const Welcome02 = () => {
    return (
        <ImageBackground
        source={require("../../../assets/icon/welCome02.png")}
        style={styles.imageBackground}>
          <View flex >
            <Text marginT-xl xxiiText style={styles.textCenter}>{t("wellcome.greeting")}</Text>
            <Text xlText color={Colors.orange} style={styles.textCenter}>{t("app.name_app")}</Text>
            <Image
            source={require("../../../assets/icon/danhGia.png")}
            style={styles.gif}
            />
            <Text xxiiText style={styles.textCT} >{t("wellcome.reality")}</Text>
            <Text largeText style={styles.textCt1}>{t("wellcome.help_two")}</Text>
            <Image
            source={require("../../../assets/icon/Indicator1.png")}
            style={styles.imgae1}
            />
            <Button style={styles.button}>
              <Text xviiText>{t("app.next")}</Text>
            </Button>
    
        </View>
        </ImageBackground>
    
        
      )
}

export default Welcome02

const styles = StyleSheet.create({
    imageBackground:{
        width:'100%',
        height:'100%',
      },
      button:{
        width:312,
        height:50,
        backgroundColor:'#FE5200',
        alignSelf:'center',
        marginTop:87,
        borderRadius:10
      },
      imgae1:{
        with:24,
        height:5,
        alignSelf:'center',
        marginTop:20,
      },
      textCt1:{
        width:350,
        height:60,
        color:'white',
        alignSelf:'center',
        textAlign:'center',
        marginTop:20,
      },
      gif:{
        width:230,
        height:210,
        alignSelf:'center',
        marginTop:56,
      },
      textCT:{
      marginTop:65,
      alignSelf:'center',
      },
      textCenter:{
      alignSelf:'center',
      fontWeight:'bold',
      },
})