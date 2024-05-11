import React, { useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Reanimated, { Extrapolation, interpolate, useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import { Camera, CameraProps, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

Reanimated.addWhitelistedNativeProps({
  zoom: true,
})

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)

function App(): React.JSX.Element {
  const { hasPermission, requestPermission } = useCameraPermission();


  const [isCapturing, setIsCapturing] = useState(false); // State để kiểm tra xem có đang chụp hình hay không

  if (!hasPermission) return (
    <View style={styles.container}>
      <Text>Ứng dụng cần quyền truy cập camera để hoạt động.</Text>
      <Button title="Xác nhận" onPress={requestPermission} />
    </View>
  )

  const device = useCameraDevice('back');

  if (device == null) return (
    <View>
      <Text>Lỗi</Text>
    </View>
  )


  const zoom = useSharedValue(device?.neutralZoom);

  const zoomOffset = useSharedValue(0);

  const gesture = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value
    })
    .onUpdate(event => {
      const z = zoomOffset.value * event.scale
      zoom.value = interpolate(
        z,
        [1, 10],
        [device.minZoom, device.maxZoom],
        Extrapolation.CLAMP,
      )
    })

  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({ zoom: zoom.value }),
    [zoom]
  )


  const cameraRef = useRef<Camera>(null);

  const handleCapture = async () => {
    if (!isCapturing) {
      setIsCapturing(true); // Đặt isCapturing thành true để ngăn chặn việc nhấn nút nhiều lần trong quá trình chụp hình

      // Thực hiện chụp hình ở đây, ví dụ:
      try {
        // Lấy ảnh từ camera
        const photo = await cameraRef.current?.takePhoto();
        console.log(photo)
        // Xử lý ảnh đã chụp ở đây, có thể lưu vào bộ nhớ hoặc hiển thị trên màn hình
      } catch (error) {
        console.log('Lỗi khi chụp ảnh:', error);
      }

      setIsCapturing(false); // Đặt isCapturing thành false sau khi hoàn thành việc chụp hình
    }
  };

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gesture}>
        <View style={{ flex: 1 }}>
          <ReanimatedCamera
            style={styles.camera}
            device={device}
            isActive={true}
            photo={true}
            ref={cameraRef}
            animatedProps={animatedProps}
          />

          <View style={styles.captureButtonContainer}>
            <Button
              title="Chụp"
              onPress={handleCapture}
              disabled={isCapturing} // Ngăn chặn việc nhấn nút khi đang trong quá trình chụp
            />
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});

export default App;