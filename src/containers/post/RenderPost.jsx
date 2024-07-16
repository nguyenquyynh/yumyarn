
import IconApp from 'components/IconApp'
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Avatar, Image, Text, View } from 'react-native-ui-lib'
import ReadMore from 'react-native-read-more-text';
import Swiper from 'react-native-swiper';
import NumberApp from 'components/commons/NumberApp';
import Video from 'react-native-video';

const RenderPost = () => {
    const content = "Duy nhất 2 ngày 1 đêm tại #HaLong đi tất tần tật các địa điểm mà tui mới săn được nè đi thử nha 🌊 Duy nhất 2 ngày 1 đêm tại #HaLong đi tất tần tật các địa điểm mà tui mới săn được nè đi thử nha 🌊 Duy nhất 2 ngày 1 đêm tại #HaLong đi tất tần tật các địa điểm mà tui mới săn được nè đi thử nha 🌊 Duy nhất 2 ngày 1 đêm tại #HaLong đi tất tần tật các địa điểm mà tui mới săn được nè đi thử nha 🌊"
    const listImage = [
        "https://cdn.pixabay.com/photo/2017/06/14/03/00/coffe-2400874_640.jpg",
        "https://res.cloudinary.com/dnodsjqql/video/upload/v1718267205/aztd9kgncwda8obdm19r.mp4",
        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
    ];
    const countFire = 120000000;
    const countComment = 130312;
    const address = "93 Đ. Thạnh Lộc 15, Thạnh Lộc, Quận 12, Thành phố Hồ Chí Minh, Việt Nam"

    const renderRevealedFooter = (handlePress) => {
        return (
            <View  >
                <View row>
                    <IconApp assetName={"location"} size={15} props={{ alignSelf: "center"}}/>
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
        <View paddingH-12 paddingB-40 marginT-20 bg-white>
            <View row spread marginB-28 paddingH-11 style={[Style.line]} paddingT-10>
                <View row center>
                    <IconApp assetName={"english"} size={50} />
                    <View marginL-15>
                        <Text xviText text60BO>
                            Vũ Vân
                        </Text>

                        <Text xiitext>
                            30p
                        </Text>
                    </View>
                </View>

                <View row center>
                    <View marginR-10 paddingH-7 paddingV-7 style={Style.outline}>
                        <Text text text70BO>
                            Đang theo dõi
                        </Text>
                    </View>

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
                <Swiper>
                    {listImage.map((item, index) => (
                        <View key={index}  >
                            {
                                item.endsWith(".mp4") ? 
                                <Video source={{ uri: item }} style={Style.styleImage} paused controls/> :
                                <Image source={{ uri: item }} style={Style.styleImage} />
                            }
                        </View>
                    ))}
                </Swiper>
            </View>

            <View row>
                <View row marginR-15>
                    <IconApp assetName={"english"} size={27} props={{ marginRight: 10 }} />
                    <NumberApp number={countFire} />
                </View>

                <View row>
                    <IconApp assetName={"comment"} size={27} props={{ marginRight: 10 }} />
                    <NumberApp number={countComment} />
                </View>
            </View>
        </View>
    )
}

export default RenderPost


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
        height: 500
    },
    styleImage: {
        width: "100%",
        height: "100%",
        borderRadius: 10,

    }
})