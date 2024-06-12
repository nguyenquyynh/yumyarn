import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { Extrapolation, interpolate, runOnJS, useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import { Image, View } from 'react-native-ui-lib';
import { Camera, useCameraDevice, useCameraFormat } from 'react-native-vision-camera';
import CameraView from './CameraView';

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
