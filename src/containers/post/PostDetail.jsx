import { Pressable, ScrollView, StyleSheet } from 'react-native'
import React, { memo, useState } from 'react'
import { Colors, Icon, Text, View } from 'react-native-ui-lib'
import { useNavigation } from '@react-navigation/native'
import MediaPost from 'components/posts/MediaPost'
import Swiper from 'react-native-swiper'
import HearDetailPost from 'components/posts/HearDetailPost'
import FooterDetailPost from 'components/posts/FooterDetailPost'
import numberFormat from 'configs/ui/format'
import { firePost } from 'src/hooks/api/fire'
import { useSelector } from 'react-redux'

const PostDetail = ({
    post = {
        "_id": "6692270cc5ca6be5dc29c1cb",
        "content": "Trải nghiệm tuyệt vời tại #Rỏeples #quan2 Bếp trưởng Sam Aisbett sáng tạo ra những món ăn không biên giới, Trải nghiệm tuyệt vời tại #Rỏeples #quan2 Bếp trưởng Sam Aisbett sáng tạo ra những món ăn không biên giới, lấy cảm hứng từ chất liệu văn hoá Việt và nguyên liệu hảo hạng từ quốc tế. Cho ra một trại nghiệm mới lạ lại vô c lấy cảm hứng từ chất liệu văn hoá Việt và nguyên liệu hảo hạng từ quốc tế. Cho ra một trại nghiệm mới lạ lại vô cTrải nghiệm tuyệt vời tại #Rỏeples #quan2 Bếp trưởng Sam Aisbett sáng tạo ra những món ăn không biên giới, Trải nghiệm tuyệt vời tại #Rỏeples #quan2 Bếp trưởng Sam Aisbett sáng tạo ra những món ăn không biên giới, lấy cảm hứng từ chất liệu văn hoá Việt và nguyên liệu hảo hạng từ quốc tế. Cho ra một trại nghiệm mới lạ lại vô c lấy cảm hứng từ chất liệu văn hoá Việt và nguyên liệu hảo hạng từ quốc tế. Cho ra một trại nghiệm mới lạ lại vô c",
        "hashtags": [
            "#Bien", "#Cat", "#Dulich"
        ],
        "media": [
            "https://cdn.pixabay.com/video/2024/07/19/221962_tiny.mp4",
            "https://cdn.pixabay.com/video/2024/02/28/202246-917718587_tiny.mp4",
            "https://cdn.pixabay.com/photo/2017/03/13/13/39/pancakes-2139844_640.jpg",
            "https://cdn.pixabay.com/photo/2016/05/31/06/08/fresh-1426257_640.jpg",
            "https://cdn.pixabay.com/photo/2014/08/14/14/21/shish-kebab-417994_1280.jpg"
        ],
        "fire": 1900000,
        "comments": 2375,
        "address": {
            "detail": "164/6 Đường Thới Tam Thôn 17, Xã Thới Tam Thôn, Huyện Hóc Môn, Hồ Chí Minh, Việt Nam",
            "longitude": 106.61824,
            "latitude": 10.87523,
            "longitudeDelta": 0.005,
            "latitudeDelta": 0.005
        },
        "exist": true,
        "create_by": {
            "_id": "665c11ebfc13ae2944c633f0",
            "name": "Ngọc Linh",
            "avatar": "https://cdn.pixabay.com/photo/2020/05/05/11/01/girl-5132631_1280.jpg"
        },
        "create_at": "1720854074279",
        "isfollow": false,
        "isfire": true,
    }
}) => {
    const navigation = useNavigation()
    const user = useSelector(state => state.auth)

    const [isfire, setIsfire] = useState(post?.isfire)
    const [iscomment, setiscomment] = useState(false)
    const [ismore, setIsmore] = useState(false)

    const handlerPressFire = async () => {
        const fire = await firePost(user._id, post?._id)
        if (fire?.status) {
            setIsfire(!isfire)
        }

    }
    const handlerPressComment = () => { }
    const handlerPressMore = () => {
        setIsmore(!ismore)
    }
    const handlerPressReport = () => { }

    const optionPost = () => {
        return (
            <View style={styles.options} center>
                <View center marginB-xx>
                    <Pressable onPress={handlerPressFire}>
                        <Icon tintColor={!isfire && 'white'} assetName={isfire ? 'fire' : 'fire_black'} size={40} />
                    </Pressable>
                    <Text text80BO color={'white'}>{numberFormat(!isfire ? post?.fire : (post?.fire + 1))}</Text>
                </View>
                <View center marginB-xxx>
                    <Pressable onPress={handlerPressComment}>
                        <Icon tintColor='white' assetName='comment' size={40} />
                    </Pressable>
                    <Text text80BO color={'white'}>{numberFormat(post?.comments)}</Text>
                </View>
                {ismore && <View center marginB-xx>
                    <Pressable onPress={handlerPressReport}>
                        <Icon tintColor='white' assetName={'flag'} size={35} />
                    </Pressable>
                </View>}
                <View center marginB-x>
                    <Pressable onPress={handlerPressMore}>
                        <Icon tintColor='white' assetName='more' size={30} />
                    </Pressable>
                </View>
            </View>
        )
    }
    return (
        <View flex right>
            <Swiper showsPagination={false}>
                {
                    post.media.map((media, index) => <MediaPost data={media} key={index} />)
                }
            </Swiper>
            <HearDetailPost _id={post?._id} name={post?.create_by?.name} follow={post?.isfollow} back={() => navigation.goBack()} avatar={post?.create_by?.avatar} />
            <View style={styles.scroll} paddingR-lx>
                <ScrollView showsVerticalScrollIndicator={false} >
                    <FooterDetailPost content={post?.content} hashtags={post?.hashtags} />
                </ScrollView>
            </View>
            <View absB >
                {optionPost()}
            </View>
        </View>
    )
}

export default memo(PostDetail)
const styles = StyleSheet.create({
    options: {
        width: 60,
    },
    bottom: {
        width: '100%',
        alignItems: 'flex-end',
        right: 0,
    },
    scroll: { position: 'absolute', bottom: 0, maxHeight: '55%' }
})