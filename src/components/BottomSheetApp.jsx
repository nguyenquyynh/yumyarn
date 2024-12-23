import {Image, View} from 'react-native-ui-lib';
import {Dimensions, Modal, Pressable, StyleSheet} from 'react-native';
import React, {Children, useEffect} from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const {height: SCREEN_HEIGHT} = Dimensions.get('screen');
const Modals = ({
  modalVisible = true, // show bottomsheet
  modalhiden, // function dissmis bottomsheet
  children, // render your component,
}) => {
  const offset = useSharedValue(0);
  const width = useSharedValue(0);
  const onLayout = event => {
    width.value = event.nativeEvent.layout.width;
  };

  const pan = Gesture.Pan()
    .onChange(event => {
      offset.value += event.changeY;
    })
    .onFinalize(event => {
      if (offset.value >= 30) {
        runOnJS(modalhiden)(false);
        offset.value = withSpring(SCREEN_HEIGHT - 100, {damping: 100});
      } else {
        offset.value = withSpring(0, {damping: 15});
      }
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateY: offset.value}],
  }));

  useEffect(() => {
    if (modalVisible) {
      offset.value = 0;
    }
  }, [modalVisible]);

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent={true}
      visible={modalVisible}>
      <View flex absF>
        {modalVisible && (
          <View flex bg-tr_black>
            <GestureHandlerRootView style={styles.container}>
              <GestureDetector gesture={pan}>
                <Animated.View style={[styles.containerCotent, animatedStyles]}>
                  <View flex bottom onLayout={onLayout}>
                    <Pressable
                      style={styles.conttainerOutside}
                      onPress={() => {
                        runOnJS(modalhiden)(false);
                      }}></Pressable>
                    <View paddingT-x bg-white style={styles.viewModal}>
                      <View flex center>
                        <Image
                          assetName="line"
                          tintColor="gray"
                          width={60}
                          height={10}
                        />
                      </View>
                      <View paddingT-x>{children}</View>
                    </View>
                  </View>
                </Animated.View>
              </GestureDetector>
            </GestureHandlerRootView>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default Modals;

const styles = StyleSheet.create({
  viewModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    flex: 1,
  },
  containerCotent: {
    flex: 1,
  },
  conttainerOutside: {
    flex: 1,
  },
});
