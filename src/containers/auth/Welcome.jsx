import { useNavigation } from '@react-navigation/native';
import { t } from 'lang';
import React, { useState } from 'react';
import { ImageBackground, LayoutAnimation, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';

const Welcome = () => {
  const navigation = useNavigation()
  const [page, setPage] = useState(0)

  const screenOption = [
    { key: 0, title: 'wellcome.diversity', description: 'wellcome.help_one', bg: 'https://cdn.pixabay.com/photo/2024/04/27/10/51/dish-8723519_1280.jpg', btn: 'app.next' },
    { key: 1, title: 'wellcome.reality', description: 'wellcome.help_two', bg: 'https://cdn.pixabay.com/photo/2022/02/25/04/11/restaurant-7033508_640.jpg', btn: 'app.get_started' },
  ]
  const handlePressWellcome = () => {
    if (page == screenOption.length -1) {
      navigation.navigate('Login')
    } else {
      setPage(page + 1)
    }
  }
  return (
    <ImageBackground source={{ uri: screenOption[page].bg }} style={styles.bg}>
      <View absB bottom style={styles.container}>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={[Colors.transparent, '#FFFFFF']} style={styles.fl}>
          <View flex bottom padding-xx >
            <Text text40BO>{t(screenOption[page].title)}</Text>
            <Text marginV-x text80R>{t(screenOption[page].description)}</Text>
            <Animated.View sharedTransitionTag='btn_auth' style={{width: 350, alignSelf: 'center'}}>
              <TouchableOpacity bg-yellow padding-xiii center br30 onPress={handlePressWellcome}>
                <Text color={Colors.white} text60BO>{t(screenOption[page].btn)}</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>
    </ImageBackground>
  )
};

export default Welcome;

const styles = StyleSheet.create({
  fl: {
    flex: 1
  },
  bg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    width: '100%',
    height: '50%'
  }
});