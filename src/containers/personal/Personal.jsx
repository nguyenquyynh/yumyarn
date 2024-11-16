import { Dimensions, StyleSheet, ScrollView, Pressable, ActivityIndicator, FlatList } from 'react-native'

import React, { useState, useEffect } from 'react'
import { t } from 'lang';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native-ui-lib';
import Avatar from 'components/Avatar';
import IconApp from 'components/IconApp';
import ImageAndVideoLibary from 'containers/camera/ImageAndVideoLibary';
import Modals from 'components/BottomSheetApp';
import CameraApp from 'containers/camera/CameraApp';
import { changeCoverPhoto, changeAvatar, getPost, checkFollowerProfile, getIdUser, countFollower, follower, unFollower } from 'src/hooks/api/profile'
import RenderPost from 'components/homes/RenderPost';

const screenheight = Dimensions.get('window').height
const screenwidth = Dimensions.get('window').width
const Personal = () => {
    const navigation = useNavigation()
    const [open_library, setopen_library] = useState(false)
    const [open_camera, setopen_camera] = useState(false);
    const [modelshow, setModelshow] = useState(false);
    const [isfollower, setisfollower] = useState()
    const [myAcount, setmyAcount] = useState(true)
    const [dataUser, setdataUser] = useState()
    const [dataUserFollower, setdataUserFollower] = useState()
    const [dataPost, setdataPost] = useState([])
    const [loading, setLoading] = useState(true);
    const [loadingAvatar, setloadingAvatar] = useState(false)
    const [loadingCoverPhoto, setloadingCoverPhoto] = useState(false)
    const [checkUpdata, setcheckUpdata] = useState()
    const [loadingEffect, setloadingEffect] = useState(false)

    //ví dụ user lấy id từ localstorage
    const idLocalstorage = "665c11ebfc13ae2944c633f9"
    //ví dụ gửi id của người dùng khi chuyển trang 
    const idProps = "665c11ebfc13ae2944c633f9"

    const checkMyAccount = async () => {
        if (idLocalstorage == idProps) {
            setmyAcount(true)
        } else {
            setmyAcount(false)
            checkfollower()
        }
    }

    const getProfile = async () => {
        try {
            const response = await getIdUser(idLocalstorage == idProps ? idLocalstorage : idProps);
            if (response) {
                setdataUser(response.data);
            } else {
                // console.log("Error getIdUser");
            }
        } catch (error) {
            console.log(`Error checkfollower : ${error}`);
        }
    };

    const checkfollower = async () => {
        try {
            const body = {
                user: idLocalstorage,
                follower: idProps,
            }
            const response = await checkFollowerProfile(body)
            setisfollower(response.status)
        } catch (error) {
            console.log(`Error checkfollower : ${error}`)
        }
    }

    const getcountFollower = async () => {
        try {
            const response = await countFollower(idProps)
            setdataUserFollower(response.data)
        } catch (error) {
            console.log(`Error getcountFollower : ${error}`)
        }
    }

    const btnFollower = async (isfollower) => {
        try {
            const body = {
                user: idLocalstorage,
                follower: idProps,
            }
            if (!isfollower) {
                const response = await follower(body)
                if (response.status) {
                    setisfollower(true)
                }
            } else {
                const response = await unFollower(body)
                if (response.status) {
                    setisfollower(false)
                }
            }
        } catch (error) {
            console.log(`Error btnFollower : ${error}`)
        }
    }

    const getUserPost = async () => {
        try {
            const body = {
                "_id": idProps,
                "page": 1,
                "limit": 10
            }
            const response = await getPost(body)
            setdataPost(response.data)
        } catch (error) {
            console.log(`Error getPost : ${error}`)
        }
    }

    const loadingSuccess = async () => {
        setLoading(false) // Dừng trạng thái loading sau khi hoàn tất
        if (loadingAvatar || loadingCoverPhoto) { // tắt trạng thái loading của avatar và coverphoto khi cập nhật ảnh
            setloadingAvatar(false)
            setloadingCoverPhoto(false)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await checkMyAccount(); //kiểm tra tk cá nhân hay tk người khác
            await getProfile(); //lấy dữ liệu profile
            await getcountFollower(); //lấy số lượng người follower, following, post
            await getUserPost() //lấy dữ liệu bài viết
            await loadingSuccess(); // lấy dữ liệu thành công tắt loading bắt đầu hiển thị giao diện 
        };
        fetchData();
    }, [loadingEffect]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    const onUploadMedia = async (file) => {
        const { uri, type, name } = file
        try {
            const data = new FormData();
            data.append('file', { uri, type, name });
            data.append('upload_preset', 'ml_default');
            data.append('cloud_name', 'dnodsjqql');

            const response = await fetch('https://api.cloudinary.com/v1_1/dnodsjqql/upload', {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                },
                body: data
            });

            const newData = await response.json();
            return newData.url
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    const updateAvatar = async (one_media) => {
        try {
            setloadingAvatar(true)
            const uploadedUrl = await onUploadMedia(one_media);
            if (uploadedUrl) {
                const body = {
                    _id: idProps,
                    avatar: uploadedUrl
                }
                const result = await changeAvatar(body)
                if (result.status) {
                    setloadingEffect(!loadingEffect)
                }
            } else {
                // console.log("Upload failed");
            }


        } catch (error) {
            console.log(`Error updateAvatar: ${error}`);
            return null;
        }
    }

    const updateCoverPhoto = async (one_media) => {
        try {
            setloadingCoverPhoto(true)
            const uploadedUrl = await onUploadMedia(one_media);
            if (uploadedUrl) {
                const body = {
                    _id: idProps,
                    photo: uploadedUrl
                }
                const result = await changeCoverPhoto(body)
                if (result.status) {
                    setloadingEffect(!loadingEffect)
                }
            } else {
                // console.log("Upload failed");
            }
        } catch (error) {
            console.log(`Error updateCoverPhoto: ${error}`);
            return null;
        }
    }

    // Hàm show model
    const handlerAddImage = (check) => {
        if (check == "camera") {
            setcheckUpdata(true)
        } else {
            setcheckUpdata(false)
        }
        setModelshow(true);
    };

    //Modal camera
    const rendermodalCamera = (checkUpdata) => {
        return (<Modal visible={open_camera} animationType="slide" statusBarTranslucent>
            <CameraApp
                closeModal={() => setopen_camera(false)}
                updateListMedia={(medias) => {

                    if (medias != null) {
                        const filename = medias.path.split('/').pop()
                        var one_media = {
                            type: medias.path.endsWith('.mp4') ? "video/mp4" : "image/jpeg",
                            uri: "file://" + medias.path,
                            name: filename
                        }

                        checkUpdata ? updateAvatar(one_media) : updateCoverPhoto(one_media)
                    }
                    setModelshow(!modelshow)
                }}
            />
        </Modal>)
    }

    //Modal pick Media
    const renderModalPickImage = () => {
        return (<Modals modalhiden={setModelshow} modalVisible={modelshow}>
            <View style={styles.modals}>
                <TouchableOpacity
                    centerH
                    centerV
                    onPress={() => setopen_camera(true)}>
                    <IconApp assetName={"diaphragm"} size={50} />
                    <Text style={styles.textcamera}>{t("app.camera")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    centerH
                    centerV
                    onPress={() => setopen_library(true)}
                >
                    <IconApp assetName={"library"} size={50} />
                    <Text style={styles.textlibrary}>{t("app.library")}</Text>
                </TouchableOpacity>
            </View>
        </Modals>)
    }

    //Modal Library
    const renderModalLibrary = (checkUpdata) => {
        return (<Modal visible={open_library} animationType="slide">
            <ImageAndVideoLibary
                closeModal={() => setopen_library(false)}
                updateListMedia={(medias) => {
                    if (medias.length > 0) {
                        medias.forEach(ele => {
                            if (ele != null) {
                                var one_media = {
                                    type: ele.type,
                                    uri: ele.uri,
                                    name: ele.fileName
                                }
                                checkUpdata ? updateAvatar(one_media) : updateCoverPhoto(one_media)
                            }
                        });
                    }
                    setModelshow(!modelshow)
                }}
            />
        </Modal>)
    }

    const renderHeader = () => (
        <View flex-1 bg-white>
            <View height={screenheight / 3}>
                <View style={{ height: "80%" }}>
                    {
                        !loadingCoverPhoto ?
                            <Image
                                source={{ uri: `${dataUser.coverPhoto}` }}
                                style={styles.coverImg}
                                resizeMode="cover"
                            />
                            :
                            <View flex-1 centerV centerH >
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                    }


                    {
                        myAcount
                        &&
                        <View absB absR>
                            <TouchableOpacity bg-white padding-3 paddingH-12 br30 margin-10
                                style={styles.border}
                                onPress={() => handlerAddImage("library")}>
                                <IconApp assetName={"gallery"} size={screenheight / 35} />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                {
                    myAcount
                    &&
                    <View style={{ height: "20%" }} row right centerV >
                        <TouchableOpacity marginR-20>
                            <IconApp assetName={"settings"} size={screenheight / 31} />
                        </TouchableOpacity>
                    </View>
                }
                <View bg-white br100 absB marginL-20 style={{padding:screenheight/150}}>
                    {
                        !loadingAvatar ?
                            <Avatar
                                source={{ uri: `${dataUser.avatar}` }}
                                size={screenheight / 8}
                                resizeMode="cover"
                            />
                            :
                            <View height={screenheight / 8} width={screenheight / 8} centerV centerH>
                                <ActivityIndicator size="large" color="#0000ff" />
                            </View>
                    }

                    {
                        myAcount
                        &&
                        <View absB absR style={{margin:screenheight/150}}>
                            <TouchableOpacity bg-white br100
                                style={styles.border}
                                onPress={() => handlerAddImage("camera")}>
                                <IconApp assetName={"camera"} size={screenheight / 40} />
                            </TouchableOpacity>
                        </View>

                    }
                </View>
            </View>
            <View>
                <View paddingH-10>
                    <Text text60BO marginV-8>{dataUser.name}</Text>
                    <Text text90T>@{dataUser.tagName}</Text>

                    {
                        !myAcount
                        &&
                        <View width={'100%'} centerH paddingV-5>
                            {
                                !isfollower ?
                                    <TouchableOpacity style={styles.follwer} bg-red paddingV-10 br30 centerH
                                        onPress={() => btnFollower(isfollower)}>
                                        <Text style={{ fontWeight: "bold" }} color="white" text80L center>Theo dõi</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.follwer} bg-yellow20 paddingV-10 br30 centerH
                                        onPress={() => btnFollower(isfollower)}>
                                        <Text style={{ fontWeight: "bold" }} color="white" text80L center >Đang theo dõi</Text>
                                    </TouchableOpacity>
                            }
                        </View>
                    }

                    <View row marginV-10 style={{ justifyContent: "space-evenly" }}>
                        <View centerH width={screenwidth / 3.5}>
                            <Text text60BO color="black">{dataUserFollower.follower}</Text>
                            <Text text70L color="black">{t("profile.followers")}</Text>
                        </View>
                        <View centerH width={screenwidth / 7}>
                            <Text text60BO color="black">{dataUserFollower.post}</Text>
                            <Text text70L color="black">{t("profile.postting")}</Text>
                        </View>
                        <View centerH width={screenwidth / 3.5}>
                            <Text text60BO color="black">{dataUserFollower.following}</Text>
                            <Text text70L color="black">{t("profile.following")}</Text>
                        </View>
                    </View>
                </View>
                <View height={1} bg-gray marginB-5></View>
                {
                    myAcount
                    &&
                    <View paddingV-5 paddingH-10>
                        <Text text70BO>{t("create_post.title")}</Text>
                        <TouchableOpacity row centerV marginV-5>
                            <View bg-white padding-4 br100>
                                <Avatar
                                    source={{ uri: `${dataUser.avatar}` }}
                                    size={screenheight / 30}
                                    resizeMode="cover"
                                />
                            </View>
                            <Text text70L marginL-5 marginL-10>{t("profile.post")}</Text>
                        </TouchableOpacity>
                    </View>
                }
                {
                    myAcount
                    &&
                    <View height={1} bg-gray ></View>

                }
                <View paddingH-10 paddingB-15 paddingT-10>
                    <Text text70BO>{t("profile.postting")}</Text>
                </View>

            </View>
        </View>

    )

    return (
        <View flex-1>
            <FlatList
                data={dataPost}
                renderItem={({ item }) => <RenderPost item={item} />}
                keyExtractor={item => item._id}
                ListHeaderComponent={renderHeader}
                // ListHeaderComponentStyle={{
                //     height: screenheight / 1.5
                // }}
                contentContainerStyle={{
                    flexGrow: 1
                }}
            />
            {renderModalPickImage()}
            {rendermodalCamera(checkUpdata)}
            {renderModalLibrary(checkUpdata)}
        </View>



    )
}

export default Personal

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    follwer: {
        width: screenwidth / 3,
    },
    modals: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
    },
    textcamera: {
        marginTop: 10,
        fontSize: 16,
        color: 'black'
    },
    textlibrary: {
        marginTop: 10,
        fontSize: 16,
        color: 'black'
    },
    border: {
        borderWidth: 1,
        borderColor: '#000000', // Màu đen
        padding:screenheight/150
    },
    coverImg: {
        flex: 1,
        height: "100%",
        width: "100%",

    }
})