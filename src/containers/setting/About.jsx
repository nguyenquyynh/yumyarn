import { StyleSheet } from 'react-native'
import React from 'react'
import { Image, Text, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import { EB, SBI } from 'configs/fonts'

const About = () => {
  const navigation = useNavigation()
  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("setting.about_us")}>
      <View flex bg-white>
        <Image
          source={require("../../assets/icon/logoyumyarn.png")}
          style={styles.image}
        />
        <Text style={styles.textlogo}>Yumyarn</Text>

        <View style={styles.padding20}>

          <Text style={styles.textvi}>{t("about.Profile")}</Text>

          <Text style={styles.textvi}>{t("about.manage")}</Text>

          <View style={styles.rim}>

            <Image
              source={require("../../../src/assets/icon/circle.png")}
              style={styles.ciercle}
            />
            <Text style={styles.textvi}>Lê Đình thái </Text>
          </View>

          <View style={styles.rim}>

            <Image
              source={require("../../../src/assets/icon/circle.png")}
              style={styles.ciercle}
            />
            <Text style={styles.textvi}>Nguyễn Văn Hoàng </Text>
          </View>

          <Text style={styles.textvi}>{t("about.hotline")} 02871095879</Text>

          <Text style={styles.textvi}>Số 244 Cống Quỳnh, Phạm Ngũ Lão Q1</Text>

          <Text style={styles.textvi}>support@yumyarn.vn</Text>

        </View>
      </View>
    </Wapper>
  )
}

export default About

const styles = StyleSheet.create({
  image: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    marginTop: 20
  },
  textlogo: {
    fontFamily: EB,
    alignSelf: 'center',
    fontSize: 32,
    marginTop: 24
  },
  padding20: {
    paddingHorizontal: 30,

  },
  textvi: {
    fontFamily: SBI,
    fontSize: 16,
    marginTop: 20
  },
  rim: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },

  ciercle: {
    width: 10,
    height: 10,
    marginRight: 10,
    marginTop: 20
  }


})