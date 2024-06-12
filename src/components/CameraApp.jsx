import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { Extrapolation, interpolate, runOnJS, useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import { Image } from 'react-native-ui-lib';
import { Camera, useCameraDevice, useCameraFormat } from 'react-native-vision-camera';

const CameraApp = (props) => {
    const { updateListMedia, closeModal } = props;
    const [permissionChecked, setPermissionChecked] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [hasMicrophonePermission, setHasMicrophonePermission] = useState(false);

    useEffect(() => {
        async function checkAndRequestPermissions() {
            try {
                const cameraGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA
                );
                const microphoneGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
                );

                if (cameraGranted === PermissionsAndroid.RESULTS.GRANTED) {
                    setHasCameraPermission(true);
                } else {
                    console.log("Quyền Camera bị từ chối!");
                }

                if (microphoneGranted === PermissionsAndroid.RESULTS.GRANTED) {
                    setHasMicrophonePermission(true);
                } else {
                    console.log("Quyền Microphone bị từ chối!");
                }
            } catch (err) {
                console.warn(err);
            } finally {
                setPermissionChecked(true);
            }
        }

        checkAndRequestPermissions();
    }, []);

    if (!permissionChecked) {
        return (
            <View style={styles.container}>
                <Text>Đang kiểm tra quyền...</Text>
            </View>
        );
    }

    if (!hasCameraPermission || !hasMicrophonePermission) {
        return (
            <View style={styles.container}>
                <Text>Quyền sử dụng camera hoặc microphone bị từ chối!</Text>
            </View>
        );
    }

    return (
        <CameraView updateListMedia={updateListMedia} closeModal={closeModal} />
    );
};

const CameraView = React.memo((props) => {
    const { updateListMedia, closeModal } = props;
    Reanimated.addWhitelistedNativeProps({ zoom: true });
    const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

    const [check_flash, setcheck_flash] = useState(false);
    const [switch_tick, setswitch_tick] = useState(true);
    const [front_camera, setfront_camera] = useState(false);
    const [video_status, setvideo_status] = useState(false);
    const [recording_time, setrecording_time] = useState(0);
    const [intervalId, setintervalId] = useState(null);
    const [listiamge, setlistiamge] = useState(null);
    const [is_capturing, setis_capturing] = useState(false);
    const camera_ref = useRef(null);
    const device = useCameraDevice(front_camera ? "front" : "back");
    const format = useCameraFormat(device, [{ photoHdr: true }, { videoHdr: true }]);
    const zoom = useSharedValue(device?.neutralZoom);
    const exposure = useSharedValue(device?.neutralExposure);
    const zoomOffset = useSharedValue(0);

    const [listCamera, setlistCamera] = useState([
        { id: 1, name: "Video", status: false },
        { id: 2, name: "Máy ảnh", status: true }
    ]);

    const tick_item_camera = useCallback((id) => {
        const updatestatus = listCamera.map((item) => ({
            ...item,
            status: item.id === id
        }));
        setvideo_status(id === 1);
        setlistCamera(updatestatus);
    }, [listCamera]);

    const gesture = Gesture.Pinch()
        .onBegin(() => {
            zoomOffset.value = zoom.value;
        })
        .onUpdate(event => {
            const z = zoomOffset.value * event.scale;
            zoom.value = interpolate(z, [1, 10], [device.minZoom, device.maxZoom], Extrapolation.CLAMP);
        });

    const focus = useCallback((point) => {
        const c = camera_ref.current;
        if (c == null) return;
        c.focus(point);
    }, []);

    const tapGesture = Gesture.Tap()
        .onEnd((event) => {
            const { x, y } = event;
            runOnJS(focus)({ x, y });
        });

    const animated_props = useAnimatedProps(() => ({ zoom: zoom.value, exposure: exposure.value }), [zoom, exposure]);

    const handleCapture = useCallback(async () => {
        if (video_status) {
            await videoCapture();
        } else {
            await camera_capture();
        }

        if (!video_status || !is_capturing) {
            setswitch_tick(!switch_tick);
        }
    }, [video_status, is_capturing, switch_tick]);

    const startRecordingTimer = useCallback(() => {
        setrecording_time(0);
        const id = setInterval(() => {
            setrecording_time(prevTime => prevTime + 1);
        }, 1000);
        setintervalId(id);
    }, []);

    const stopRecordingTimer = useCallback(() => {
        clearInterval(intervalId);
        setintervalId(null);
    }, [intervalId]);

    const videoCapture = async () => {
        if (!is_capturing) {
            await camera_ref.current.startRecording({
                onRecordingError: (error) => console.log(error),
                onRecordingFinished: (video) => {
                    console.log(video);
                    setlistiamge(video.path);
                },
                flash: check_flash && !front_camera ? "on" : "off",
                fileType: "mp4"
            });

            setis_capturing(true);
            startRecordingTimer();
        } else {
            await camera_ref.current?.stopRecording();
            setis_capturing(false);
            stopRecordingTimer();
        }
    };

    const camera_capture = async () => {
        if (!is_capturing) {
            setis_capturing(true);

            try {
                const photo = await camera_ref.current?.takePhoto({
                    flash: check_flash && !front_camera ? "on" : "off",
                    enableAutoDistortionCorrection: true,
                    enableAutoRedEyeReduction: true,
                    enableShutterSound: true
                });

                console.log(photo);
                setlistiamge("file://" + photo.path);
            } catch (error) {
                console.log('Lỗi khi chụp ảnh:', error);
            }
            setswitch_tick(!switch_tick);
            setis_capturing(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.headerCamera}>
                <Pressable onPress={closeModal}>
                    <Image assetName='arrow_back' width={24} height={24} />
                </Pressable>
                <TouchableOpacity onPress={() => setcheck_flash(!check_flash)}>
                    {check_flash ? <Image assetName='flash' width={24} height={24} /> : <Image assetName='un_flash' width={24} height={24} />}
                </TouchableOpacity>
                <Pressable>
                    <Image assetName='clock' width={24} height={24} />
                </Pressable>
            </View>

            <View style={{ flex: 7 }}>
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
                {is_capturing && video_status &&
                    <Text style={styles.recordingTimeText}>
                        {recording_time}
                    </Text>
                }
            </View>

            <View style={{ flex: 2 }}>
                <View style={styles.viewItem}>
                    {listCamera.map((item) => (
                        <View key={item.id}>
                            <Pressable onPress={() => !is_capturing && tick_item_camera(item.id)}>
                                <Text style={item.status ? { color: 'black' } : { color: 'gray' }}>{item.name}</Text>
                            </Pressable>
                            {item.status && <Pressable style={styles.indicatorItem}></Pressable>}
                        </View>
                    ))}
                </View>
                <View style={styles.viewfeature}>
                    <View style={{ width: 70, height: 70 }}></View>
                    {switch_tick && !video_status ?
                        <Pressable
                            style={styles.tickCamera}
                            onPress={async () => await handleCapture()}
                            disabled={is_capturing}
                        ></Pressable>
                        : switch_tick && video_status ?
                            <Pressable
                                style={styles.outlinebuttonvideo}
                                onPress={async () => await handleCapture()}
                                disabled={is_capturing}
                            >
                                <View style={styles.clickvideo}></View>
                            </Pressable>
                            : is_capturing && video_status ?
                                <Pressable
                                    style={styles.outlinebuttonvideo}
                                    onPress={async () => await handleCapture()}
                                >
                                    <View style={styles.stopvideo}></View>
                                </Pressable>
                                :
                                <Pressable onPress={() => !is_capturing && setswitch_tick(!switch_tick) && closeModal() && updateListMedia(listiamge)}>
                                    <Image assetName='tickCamera' width={70} height={70} />
                                </Pressable>
                    }
                    {!switch_tick && !video_status ?
                        <Pressable style={styles.cutCamera}>
                            <Image assetName='crop' width={30} height={30} />
                        </Pressable>
                        :
                        <Pressable style={styles.switchCamera} onPress={() => !is_capturing && setfront_camera(!front_camera)}>
                            <Image assetName='switch_camera' width={30} height={30} />
                        </Pressable>
                    }
                </View>
            </View>
        </View>
    );
}, []);

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
