import React, { useEffect, useRef, useState } from 'react';
import { Button, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Reanimated, { Extrapolation, interpolate, useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import { Image } from 'react-native-ui-lib';
import { Camera, CameraProps, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

Reanimated.addWhitelistedNativeProps({
    zoom: true,
})

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)

const CameraApp = () => {
    const { hasPermission, requestPermission } = useCameraPermission();
    const [checkflash, setcheckflash] = useState(false);
    const [switchTick, setswitchTick] = useState(true)
    const itemcamera = [
        {
            "id": 1,
            "name": "Video",
            "status": false
        },
        {
            "id": 2,
            "name": "Máy ảnh",
            "status": true,
        }
    ]
    const [listCamera, setlistCamera] = useState(itemcamera)

    const tickItemCamera = (id) => {
        // Cập nhật trạng thái của mảng listCamera
        const updatestatus = listCamera.map((item) => (
            {
                ...item,
                status: item.id == id
            }
        ))
        setlistCamera(updatestatus)
    }


    if (!hasPermission)
        return (
            <View style={styles.container}>
                <Text>Ứng dụng cần quyền truy cập camera để hoạt động.</Text>
                <Button title="Xác nhận" onPress={requestPermission} />
            </View>
        )
    else {
        const [isCapturing, setIsCapturing] = useState(false); // State để kiểm tra xem có đang chụp hình hay không

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

        const animatedProps = useAnimatedProps < CameraProps > (
            () => ({ zoom: zoom.value }),
            [zoom]
        )


        const cameraRef = useRef(null);

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



            <View style={{ flex: 1 }}>
                <View style={styles.headerCamera}>
                    <Pressable>
                        <Image assetName='arrow_back' width={24} height={24} />
                    </Pressable>
                    <TouchableOpacity onPress={() => setcheckflash(!checkflash)}>
                        {
                            checkflash ?
                                <Image assetName='flash' width={24} height={24} />
                                :
                                <Image assetName='un_flash' width={24} height={24} />
                        }
                    </TouchableOpacity>
                    <Pressable>
                        <Image assetName='clock' width={24} height={24} />
                    </Pressable>
                </View>
                <GestureDetector gesture={gesture}>
                    <View style={{ flex: 7 }}>
                        <ReanimatedCamera
                            style={styles.camera}
                            device={device}
                            isActive={true}
                            photo={true}
                            ref={cameraRef}
                            animatedProps={animatedProps}
                        />
                    </View>
                </GestureDetector>
                <View style={{ flex: 2 }}>
                    <View style={styles.viewItem}>
                        {
                            listCamera.map((item) => (
                                <View key={item.id}>
                                    <Pressable onPress={() => tickItemCamera(item.id)}>
                                        <Text style={item.status ? { color: 'black' } : { color: 'gray' }}>{item.name}</Text>
                                    </Pressable>
                                    {
                                        item.status && <Pressable style={styles.indicatorItem}></Pressable>
                                    }
                                </View>
                            ))
                        }
                    </View>
                    <View style={styles.viewfeature}>
                        <View style={{ height: 50, width: 50 }}></View>
                        {
                            switchTick ?
                                <Pressable
                                    style={styles.tickCamera}
                                    onPress={()=>{
                                        handleCapture()
                                        setswitchTick(!switchTick)
                                    }}
                                    disabled={isCapturing} // Ngăn chặn việc nhấn nút khi đang trong quá trình chụp
                                ></Pressable>
                                :
                                <Pressable onPress={()=>setswitchTick(!switchTick)}>
                                    <Image assetName='tickCamera' width={70} height={70} />
                                </Pressable>
                        }
                        {
                            switchTick ?
                            <Pressable style={styles.switchCamera}>
                            <Image assetName='switch_camera' width={30} height={30} />
                        </Pressable>
                        :
                        <Pressable style={styles.cutCamera}>
                            <Image assetName='crop' width={30} height={30} />
                        </Pressable>
                        }
                    </View>

                </View>

            </View>
        );
    }
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
        flex: 2,
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    headerCamera: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: "3%",
        paddingTop: "6%",
        alignItems: 'center'
    },
    viewItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: "25%",
        alignSelf: 'center',
        marginVertical: 20
    },
    indicatorItem: {
        height: 5,
        width: 5,
        backgroundColor: "black",
        alignSelf: 'center',
        marginTop: '6%',
        borderRadius: 10
    },
    tickCamera: {
        height: 70,
        width: 70,
        backgroundColor: "#FE5200",
        borderRadius: 100,
        alignSelf: 'center'
    },
    viewfeature: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    switchCamera: {
        backgroundColor: "#FEC7AD",
        padding: 15,
        borderRadius: 100,
    },
    cutCamera: {
        backgroundColor: "rgba(0,0,0,0)",
        padding: 15,
        borderRadius: 100,
    },
});

export default CameraApp;