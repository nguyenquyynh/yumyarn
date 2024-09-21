

import IconApp from 'components/IconApp'
import React, { memo, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Avatar, Image, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import ReadMore from 'react-native-read-more-text';
import Swiper from 'react-native-swiper';
import Video from 'react-native-video';
import ChangeTimeApp from 'components/commons/ChangeTimeApp';
import numberFormat from 'configs/ui/format';

const RenderPost = (props) => {
    const { item, handleOpenComment } = props;
    const content = item?.content;
    const listImage = item?.media || [];
    const countFire = item?.fire;
    const countComment = item?.comments;
    const address = item?.address?.detail;
    const id = item?._id;
    const dateNow = new Date();
    const datePast = new Date(parseInt(item?.update_at));
    const differenceInMilliseconds = dateNow - datePast;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);


    const renderRevealedFooter = (handlePress) => {
        return (
            <View>
                <View row>
                    <IconApp assetName={"location"} size={15} props={{ alignSelf: "center" }} />
                    <Text text text70BO marginL-2>
                        {address}
                    </Text>
                </View>
                <Text onPress={handlePress}>
                    Ẩn bớt
                </Text>
            </View>
        );
    };

    const renderTruncatedFooter = (handlePress) => {
        return (
            <Text onPress={handlePress}>
                Xem thêm
            </Text>
        );
    };

    return (
        <View paddingH-12 paddingB-40 marginT-20 bg-white style={Style.sizeContainer}>
            <View row spread marginB-28 paddingH-11 style={[Style.line]} paddingT-10>
                <View row center flex>
                    <Avatar source={{ uri: item?.create_by?.avatar }} size={50} />
                    <View marginL-15 flex>
                        <Text xviText text60BO numberOfLines={1}>
                            {item?.create_by?.name}
                        </Text>

                        <ChangeTimeApp second={differenceInSeconds} />
                    </View>
                </View>

                <View row center>
                    {item?.follow !== 'you' && (
                        <View marginR-10 paddingH-7 paddingV-7 style={Style.outline}>
                            <Text text text70BO>
                                {item?.follow ? 'Đang theo dõi' : 'Theo dõi'}
                            </Text>
                        </View>
                    )}
                    <IconApp assetName={"dots"} size={24} />
                </View>

            </View>

            <ReadMore
                numberOfLines={3}
                renderTruncatedFooter={renderTruncatedFooter}
                renderRevealedFooter={renderRevealedFooter}
            >
                <Text text text85BO>
                    {content}
                </Text>

            </ReadMore>

            <View marginB-8 marginT-12 style={Style.borderRadiusSwiper} >
                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    pagingEnabled={true}
                    snapToAlignment='center'
                    data={listImage}
                    renderItem={data =>
                        <View key={index}  >
                            {
                                data.item.endsWith(".mp4") ?
                                    <Video
                                        source={{ uri: data.item }}
                                        style={Style.styleImage}
                                        resizeMode='cover'
                                        paused
                                        controls
                                    /> :
                                    <Image source={{ uri: data.item }} style={Style.styleImage} />
                            }
                        </View>}
                    key={item => item.id}
                />
            </View>

            <View row>
                <View row marginR-15>
                    <IconApp assetName={"fire_black"} size={27} props={{ marginRight: 10 }} />
                    <Text text80BO>{numberFormat(countFire)}</Text>
                </View>

                <View row>
                    <TouchableOpacity
                        onPress={() => handleOpenComment(id)}>
                        <IconApp assetName={"comment"} size={27} props={{ marginRight: 10 }} />
                    </TouchableOpacity>
                    <Text text80BO>{numberFormat(countComment)}</Text>
                </View>
            </View>
        </View>
    )
}

export default memo(RenderPost)


const Style = StyleSheet.create({
    line: {
        borderTopWidth: 0.5,
        borderColor: "black",
        width: "100%",
    },
    outline: {
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 10
    },
    borderRadiusSwiper: {
        borderRadius: 10,
        width: "100%",
        height: 500,
    },
    styleImage: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        overflow: 'hidden',
    },
    sizeContainer: {
        width: "100%",
        maxWidth: 500,
        alignSelf: 'center',
    }
})