import { ActivityIndicator, Dimensions, FlatList, Pressable, RefreshControl, StyleSheet, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import Wapper from 'components/Wapper'
import { useNavigation } from '@react-navigation/native'
import { t } from 'lang'
import { Avatar, Colors, Icon, Image, Text, Toast, TouchableOpacity, View } from 'react-native-ui-lib'
import IconApp from 'components/IconApp'
import { BI, EBI, I } from 'configs/fonts'
import { changeTime, transDate } from 'components/commons/ChangeMiliTopDate'
import RenderVideo from 'components/homes/RenderVideo'
import { getReport, removeReport } from 'src/hooks/api/post'
const { width: MAX_WIDTH } = Dimensions.get('window');
const Report = () => {
    const navigation = useNavigation()
    const [dataPost, setDataPost] = useState([])
    useEffect(() => {
        const LoadList = async (page = 1, limit = 10) => {
            const resault = await getReport({ page: page, limit: limit })
            if (resault.status) {
                setDataPost(resault.data)
            }

        }
        LoadList()
    }, [])

    const handleRemove = async (id) => {
        const resault = await removeReport({ _id: id })
        if (resault.status) {
            ToastAndroid.show(t("app.success"), ToastAndroid.SHORT)
        } else {
            ToastAndroid.show(resault.data, ToastAndroid.SHORT)
        }
    }
    const renderPost = (item) => {
        return (
            <View paddingH-10 bg-white>
                <View row paddingT-10>
                    <View row left flex>
                        <Avatar
                            source={{ uri: item?.post.create_by?.avatar }}
                            size={35}
                            onPress={() => {
                                navigation.navigate('OtherProfile', {
                                    name: item?.post.create_by?.name,
                                    _id: item?.post.create_by?._id,
                                });
                            }}
                        />
                        <View marginL-15>
                            <View row centerV>
                                <Text
                                    text70BO
                                    numberOfLines={1}
                                    onPress={() => {
                                        navigation.navigate('OtherProfile', {
                                            name: item?.post.create_by?.name,
                                            _id: item?.post.create_by?._id,
                                        });
                                    }}>
                                    {item?.post.create_by?.name}
                                </Text>
                                {item?.repost_by && (
                                    <TouchableOpacity onPress={() => { navigation.navigate('OtherProfile', { name: item?.post.repost_by?.name, _id: item?.post.repost_by?._id }) }} row centerV>
                                        <Icon marginH-10 assetName="retweet" size={10} />
                                        <Text text80BO>@{item?.post.repost_by?.tagName}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <Text xiitext style={{ color: '#BEBEBE' }}>
                                {changeTime(transDate(item?.post.create_at))}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            handleRemove(item._id)
                        }}
                        row
                        center>
                        <IconApp assetName={'cancel'} size={20} />
                    </TouchableOpacity>
                </View>
                <Text
                    text
                    text85BO
                    onPress={() => {

                    }}>
                    {item?.post.content}
                </Text>
                {item?.post.hashtags.length != 0 && (
                    <View row>
                        {item?.post.hashtags.map(el => (
                            <Text
                                key={el}
                                onPress={() => {
                                    navigation.navigate('Search', { inputkey: el });
                                }}
                                style={{ fontFamily: EBI }}
                                color={Colors.yellow}>
                                #{el}{' '}
                            </Text>
                        ))}
                    </View>
                )}
                <View row top centerV>
                    <Icon assetName="location" size={12} marginR-v />
                    <Text
                        onPress={() => {
                            navigation.navigate('SearchMap', { defaultlocation: item?.post.address });
                        }}
                        text
                        text90BO
                        marginR-7>
                        {item?.post.address.detail}
                    </Text>
                </View>

                <View marginB-22 marginT-15 style={styles.borderRadiusSwiper}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        pagingEnabled={true}
                        snapToAlignment="center"
                        data={item?.post.media}
                        renderItem={data => (
                            <Pressable
                                onPress={() => {
                                    navigation.navigate('PostDetail', { id: id });
                                }}
                                style={{ overflow: 'hidden', borderRadius: 15 }}>
                                {data.item.endsWith('.mp4') ? (
                                    <RenderVideo urlvideo={data.item} />
                                ) : (
                                    <Image
                                        source={{ uri: data.item }}
                                        style={styles.styleImage}
                                        resizeMode="cover"
                                    />
                                )}
                            </Pressable>
                        )}
                        key={item => item.id}
                    />
                </View>
            </View>
        )
    }
    const renderUser = (item) => {
        return (
            <View padding-15 >
                <View row marginB-v paddingT-10>
                    <View row left flex>
                        <Avatar
                            source={{ uri: item?.user?.avatar }}
                            size={35}
                            onPress={() => {
                                navigation.navigate('OtherProfile', {
                                    name: item?.user?.name,
                                    _id: item?.user?._id,
                                });
                            }}
                        />
                        <View marginL-15>
                            <View row centerV>
                                <Text
                                    text70BO
                                    numberOfLines={1}
                                    onPress={() => {
                                        navigation.navigate('OtherProfile', {
                                            name: item?.user?.name,
                                            _id: item?.user?._id,
                                        });
                                    }}>
                                    {item?.user?.name}
                                </Text>
                            </View>
                            <Text xiitext >
                                {"@" + item?.user?.tagName}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            handleRemove(item._id)
                        }}
                        row
                        center>
                        <IconApp assetName={'cancel'} size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <Wapper title={t("setting.report")} renderleft funtleft={() => navigation.goBack()}>
            <FlatList
                showsVerticalScrollIndicator={false}
                data={dataPost}
                extraData={dataPost}
                key={({ index }) => index}
                onEndReached={() => {

                }}
                onEndReachedThreshold={0.6}
                initialNumToRender={10}
                renderItem={({ item, index }) =>
                (
                    <View>
                        {!item?.post?._id ? renderUser(item) : renderPost(item)}
                        <View backgroundColor={item?.status === 'PENDING' ? Colors.yellow : 'lightblue'}>
                            <Text center color='black' text90BO>{item?.content}</Text>
                        </View>
                    </View>
                )
                }
            />
        </Wapper >
    )
}

export default Report

const styles = StyleSheet.create({
    outline: {
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 10,
        padding: 7,
        marginRight: 10,
    },
    borderRadiusSwiper: {
        width: '100%',
        height: 210,
    },
    styleImage: {
        width: MAX_WIDTH - 20,
        width: MAX_WIDTH - 20,
        maxWidth: 480,
        height: '100%',
    },
    sizeContainer: {
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
        position: 'relative',
    },
})