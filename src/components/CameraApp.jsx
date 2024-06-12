import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, PermissionsAndroid, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Reanimated, { Extrapolation, interpolate, runOnJS, useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import {Image } from 'react-native-ui-lib';
import { Camera, useCameraDevice, useCameraFormat, useCameraPermission } from 'react-native-vision-camera';

Reanimated.addWhitelistedNativeProps({
    zoom: true,
})

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)

const CameraApp = () => {
    const { hasPermission, requestPermission } = useCameraPermission();
    const [check_flash, setcheck_flash] = useState(false);
    const [switch_tick, setswitch_tick] = useState(true)
    const [front_camera, setfront_camera] = useState(false)
    const [video_status, setvideo_status] = useState(false)
    const [recording_time, setrecording_time] = useState(0); // State để theo dõi thời gian quay video
    const [intervalId, setintervalId] = useState(null); // State để lưu interval ID
    const [listiamge, setlistiamge] = useState(null)
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

    const tick_item_camera = (id) => {
        // Cập nhật trạng thái của mảng listCamera
        const updatestatus = listCamera.map((item) => (
            {
                ...item,
                status: item.id == id
            }
        ))
        if (id == 1) {
            setvideo_status(true)
        } else {
            setvideo_status(false)
        }
        setlistCamera(updatestatus)
    }


    useEffect(() => {
        async function checkAndRequestMicrophonePermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                    {
                        title: "Ứng dụng cần quyền sử dụng Microphone",
                        message:
                            "Ứng dụng cần quyền sử dụng Microphone để ghi âm video.",
                        buttonNeutral: "Hỏi lại sau",
                        buttonNegative: "Hủy",
                        buttonPositive: "OK"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Quyền Microphone đã được cấp!");
                } else {
                    console.log("Quyền Microphone bị từ chối!");
                }
            } catch (err) {
                console.warn(err);
            }
        }
        checkAndRequestMicrophonePermission();
    }, []);

    if (!hasPermission)
        return (
            <View style={styles.container}>
                <Text>Ứng dụng cần quyền truy cập camera để hoạt động.</Text>
                <Button title="Xác nhận" onPress={requestPermission} />
            </View>
        )
    else {
        const [is_capturing, setis_capturing] = useState(false); // State để kiểm tra xem có đang chụp hình hay không

        const device = useCameraDevice(front_camera ? "front" : "back");

        if (device == null) return (
            <View>
                <Text>Lỗi</Text>
            </View>
        )

        const format = useCameraFormat(device, [
            { photoHdr: true },
            { videoHdr: true },
          ])


        const zoom = useSharedValue(device?.neutralZoom);
        const exposure = useSharedValue(device?.neutralExposure);
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

        const focus = useCallback((point) => {
            const c = camera_ref?.current
            if (c == null) return
            c.focus(point)
        }, [])

        const tapGesture = Gesture.Tap()
            .onEnd((event) => {
                const { x, y } = event;
                runOnJS(focus)({ x, y })
            });

        const animated_props = useAnimatedProps(
            () => ({ zoom: zoom.value, exposure: exposure.value }),
            [zoom, exposure]
        )

        const camera_ref = useRef(null);

        const handleCapture = async () => {
            if (video_status) {
                await videoCapture()
            } else {
                await camera_capture()
            }
            setswitch_tick(!switch_tick)
        };

        const startRecordingTimer = () => {
            setrecording_time(0);
            const id = setInterval(() => {
                setrecording_time(prevTime => prevTime + 1);
            }, 1000);
            setintervalId(id);
        };

        const stopRecordingTimer = () => {
            clearInterval(intervalId);
            setintervalId(null);
        };

        const videoCapture = async () => {
            if (!is_capturing) {
                await camera_ref.current.startRecording({
                    onRecordingError: function (error) {
                        console.log(error)
                    },
                    onRecordingFinished: function (video) {
                        console.log(video)
                        setlistiamge(video.path)
                    },
                    flash: check_flash && !front_camera ? "on" : "off",
                    fileType: "mp4",
                });

                setis_capturing(true);
                startRecordingTimer();
            } else {
                await camera_ref.current?.stopRecording();
                setis_capturing(false);
                stopRecordingTimer();
            }
        }

        const camera_capture = async () => {
            if (!is_capturing) {
                setis_capturing(true); // Đặt is_capturing thành true để ngăn chặn việc nhấn nút nhiều lần trong quá trình chụp hình

                // Thực hiện chụp hình ở đây, ví dụ:
                try {
                    // Lấy ảnh từ camera
                    const photo = await camera_ref.current?.takePhoto({
                        flash: check_flash && !front_camera ? "on" : "off",
                        enableAutoDistortionCorrection: true,
                        enableAutoRedEyeReduction: true,
                        enableShutterSound: true
                    });

                    console.log(photo)
                    // Xử lý ảnh đã chụp ở đây, có thể lưu vào bộ nhớ hoặc hiển thị trên màn hình
                } catch (error) {
                    console.log('Lỗi khi chụp ảnh:', error);
                }
                setswitch_tick(!switch_tick)
                setis_capturing(false); // Đặt is_capturing thành false sau khi hoàn thành việc chụp hình
            }
        }

        return (
            <View style={{ flex: 1 }}>
                <View style={styles.headerCamera}>
                    <Pressable>
                        <Image assetName='arrow_back' width={24} height={24} />
                    </Pressable>
                    <TouchableOpacity onPress={() => setcheck_flash(!check_flash)}>
                        {
                            check_flash ?
                                <Image assetName='flash' width={24} height={24} />
                                :
                                <Image assetName='un_flash' width={24} height={24} />
                        }
                    </TouchableOpacity>
                    <Pressable>
                        <Image assetName='clock' width={24} height={24} />
                    </Pressable>
                </View>

                <View style={{ flex: 7 }}>
                    <GestureHandlerRootView>
                        <GestureDetector gesture={Gesture.Exclusive(gesture, tapGesture)}>
                            <ReanimatedCamera
                                style={styles.camera}
                                device={device}
                                format={format}
                                isActive={true}
                                photo={true}
                                audio={true}
                                video={video_status}
                                videoHdr={format.supportsVideoHdr}
                                photoHdr={format.supportsPhotoHdr}
                                ref={camera_ref}
                                videoStabilizationMode={'cinematic-extended'}
                                animatedProps={animated_props}
                            />
                        </GestureDetector>
                    </GestureHandlerRootView>
                    {is_capturing && video_status &&
                        <Text style={styles.recordingTimeText}>
                            {recording_time}
                        </Text>
                    }
                </View>

                <View style={{ flex: 2 }}>
                    <View style={styles.viewItem}>
                        {
                            listCamera.map((item) => (
                                <View key={item.id}>
                                    <Pressable onPress={() => {
                                        if (!is_capturing) {
                                            tick_item_camera(item.id)
                                        }
                                    }}>
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
                        <View style={{ width: 70, height: 70 }}></View>
                        {
                            switch_tick & !video_status ?
                                <Pressable
                                    style={styles.tickCamera}
                                    onPress={async () => {
                                        await handleCapture()
                                    }}
                                    disabled={is_capturing} // Ngăn chặn việc nhấn nút khi đang trong quá trình chụp
                                ></Pressable>
                                :
                                switch_tick & video_status ?
                                    <Pressable
                                        style={styles.outlinebuttonvideo}
                                        onPress={async () => {
                                            await handleCapture()
                                        }}
                                        disabled={is_capturing} // Ngăn chặn việc nhấn nút khi đang trong quá trình chụp
                                    >
                                        <View style={styles.clickvideo}>

                                        </View>
                                    </Pressable>
                                    :
                                    !switch_tick & video_status ?
                                        <Pressable
                                            style={styles.outlinebuttonvideo}
                                            onPress={async () => {
                                                await handleCapture()
                                            }}// Ngăn chặn việc nhấn nút khi đang trong quá trình chụp
                                        >
                                            <View style={styles.stopvideo}>

                                            </View>
                                        </Pressable>
                                        :
                                        <Pressable onPress={() => {
                                            if (!is_capturing) {
                                                setswitch_tick(!switch_tick)
                                            }
                                        }}>
                                            <Image assetName='tickCamera' width={70} height={70} />
                                        </Pressable>
                        }
                        {
                            !switch_tick & !video_status ?
                                <Pressable style={styles.cutCamera}>
                                    <Image assetName='crop' width={30} height={30} />
                                </Pressable>
                                :
                                <Pressable style={styles.switchCamera} onPress={() => {
                                    if (!is_capturing) {
                                        setfront_camera(!front_camera)
                                    }
                                }}>
                                    <Image assetName='switch_camera' width={30} height={30} />
                                </Pressable>
                        }
                    </View>

                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    recordingTimeText: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        color: 'white',
        fontSize: 18,
    },
    outlinebuttonvideo: {
        width: 72,
        height: 72,
        padding: 5,
        borderRadius: 90,
        borderColor: "#FE5200",
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
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
    clickvideo: {
        width: '100%',
        height: '100%',
        backgroundColor: "#FE5200",
        borderRadius: 100,
        alignSelf: 'center'
    },
    tickCamera: {
        height: 70,
        width: 70,
        backgroundColor: "#FE5200",
        borderRadius: 100,
        alignSelf: 'center'
    },
    stopvideo: {
        height: 30,
        width: 30,
        backgroundColor: "#FE5200",
        alignSelf: 'center',
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