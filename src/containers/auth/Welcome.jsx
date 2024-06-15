import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Button, Colors, Text, View } from 'react-native-ui-lib';
import Swiper from 'react-native-swiper';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Login from './Login';
import Welcome01 from './welcome/Welcome01';
import Welcome02 from './welcome/Welcome02';
import { t } from 'lang';
import IconApp from 'components/IconApp';
import ButtonApp from 'components/ButtonApp';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Welcome = () => {
  const [toggle, setToggle] = useState(false);
  const [indexswiper, setindexSwiper] = useState(0)
  const swiperRef = useRef(null);

  const translateXL = useSharedValue(0);
  const translateXR = useSharedValue(0);
  const translateBY = useSharedValue(0);
  const translateTY = useSharedValue(0);
  const scaleL = useSharedValue(1);
  const scaleR = useSharedValue(1);

  // Animated styles cho các hộp
  const animatedStylesL = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(translateXL.value) },
      { translateY: withSpring(translateTY.value) },
      { scale: withSpring(scaleL.value) },
    ],
  }));

  const animatedStylesR = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(translateXR.value) },
      { translateY: withSpring(translateBY.value) },
      { scale: withSpring(scaleR.value) },
    ],
  }));


  const handlePress = () => {
    if (!toggle) {
      translateXL.value = screenWidth - 100; // Di chuyển hộp đầu tiên tới rìa phải của màn hình
      translateXR.value = -(screenWidth - 100); // Di chuyển hộp thứ hai tới rìa trái của màn hình
    } else {
      translateXL.value = (screenWidth / 2) - 40; // Di chuyển hộp đầu tiên tới giữa phía trên màn hình
      translateXR.value = (screenWidth / 2) - 360; // Di chuyển hộp thứ hai tới giữa phía dưới màn hình
      translateBY.value = (screenWidth / 2) - 150;
      translateTY.value = (screenWidth / 2) - 220;
      scaleL.value = 2.3; // Tăng kích thước hộp đầu tiên
      scaleR.value = 1.38; // Tăng kích thước hộp thứ hai
    }
    setToggle(!toggle);
  };

  const renderWelCome = (index) => {
    return (
      <View flex center style={styles.contentWelcome}>
        <View flex center>
          <Text center color={Colors.black} text30BO>{index == 0 ? t("wellcome.greeting") : t("wellcome.greeting")}</Text>
          <Text color={Colors.orange} text20BO>{t("app.name_app")}</Text>
          <View margin-lx>
            <IconApp assetName={index == 0 ? "camera" : "logoapp"} size={250} />
          </View>
          <View paddingH-lx center>
            <Text center color={Colors.black} text30BO>{index == 0 ? t("wellcome.diversity") : t("wellcome.reality")}</Text>
            <Text center color={Colors.white} text60BO>{index == 0 ? t("wellcome.help_one") : t("wellcome.help_two")}</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View bg-yellow flex>
      <Animated.View style={[styles.box, styles.boxLeft, animatedStylesL]} />
      <Animated.View style={[styles.box, styles.boxRight, animatedStylesR]} />
      <View flex>
        {indexswiper >= 2 ? <Login /> : <View flex>
          <View flex-4>
            <Swiper scrollEnabled={false} index={indexswiper} activeDotColor={Colors.orange} activeDotStyle={styles.dot} dotStyle={styles.dot}>
              <View style={styles.slide1}>
                {renderWelCome(indexswiper)}
              </View>
              <View style={styles.slide2}>
                {renderWelCome(indexswiper)}
              </View>
            </Swiper>
          </View>

          <View flex-1 paddingH-xx>
            <ButtonApp background={Colors.orange} onclick={() => {
              setindexSwiper(indexswiper + 1)
              handlePress()
            }} title={indexswiper == 0 ? t("app.get_started") : t("app.next")} />
          </View>
        </View>}
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  dot: { width: 10, height: 5, borderRadius: 5 },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  box: {
    height: 350,
    width: 350,
    backgroundColor: 'white',
    borderRadius: 360,
    position: 'absolute',
  },
  boxLeft: {
    top: -130,
    left: -130,
  },
  boxRight: {
    bottom: -150,
    right: -130,
  },
  swiperContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
