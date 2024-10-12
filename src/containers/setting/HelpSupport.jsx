import { StyleSheet, ScrollView } from 'react-native'
import { StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { Icon, Image, Text, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import { red } from 'react-native-reanimated/lib/typescript/reanimated2/Colors'


const HelpSupport = () => {
  const navigation = useNavigation()
  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("setting.help")}>
      <ScrollView>
        <View flex bg-white>
          <View style={styles.vienlon}>
            <Text style={styles.textt}> 1 {t("helping.Introduce")}</Text>
            <View style={styles.rim}>
            <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Introduce1")} </Text>
            </View>
            <View style={styles.rim}>
              <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Introduce2")} </Text>
            </View>
            <Text style={styles.textt}> 2 {t("helping.Prohibited_Actions")} </Text>
            <View style={styles.rim}>
              <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Prohibited_Actions1")} </Text>
            </View>
            <View style={styles.rim}>
              <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Prohibited_Actions2")} </Text>
            </View>
            <Text style={styles.textt}> 3 {t("helping.Inappropriate_content")} </Text>
            <View style={styles.rim}>
              <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Inappropriate_content1")} </Text>
            </View>
            <View style={styles.rim}>
              <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Inappropriate_content2")} </Text>
            </View>
            <Text style={styles.textt}> 4 {t("helping.Identity_and_Privacy")} </Text>
            <View style={styles.rim}>
              <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Identity_and_Privacy1")} </Text>
            </View>
            <View style={styles.rim}>
              <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Identity_and_Privacy2")} </Text>
            </View>
            <Text style={styles.textt}> 5 {t("helping.Slanderous_content")} </Text>
            <View style={styles.rim}>
              <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Slanderous_content1")} </Text>
            </View>
            <View style={styles.rim}>
              <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Slanderous_content2")} </Text>
            </View>
            <Text style={styles.textt}> 6 {t("helping.Violation_of_law_and_ethics")} </Text>
            <View style={styles.rim}>
              <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Violation_of_law_and_ethics1")} </Text>
            </View>
            <Text style={styles.textt}> 7 {t("helping.Advertising_and_commerce")} </Text>
            <View style={styles.rim}>
              <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Advertising_and_commerce1")} </Text>
            </View>
            <Text style={styles.textt}> 8 {t("helping.Spam_and_Malware")} </Text>
            <View style={styles.rim}>
              <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Spam_and_Malware")} </Text>
            </View>
            <Text style={styles.textt}> 9 {t("helping.Intervention_and_management")} </Text>
            <View style={styles.rim}>
              <Icon assetName='dot' style={styles.ciercle}/>
              <Text>{t("helping.Intervention_and_management1")} </Text>
            </View>
          </View>
        </View>
      </ScrollView>

    </Wapper>
  )
}

export default HelpSupport

const styles = StyleSheet.create({
  vienlon: {
    paddingHorizontal: 20,
    marginRight:20
  },
  textt: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold'
  },
  rim: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  ciercle: {
    width: 10,
    height: 10,
    marginRight: 10
  }
})