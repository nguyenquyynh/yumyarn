import { FlatList, Pressable, ScrollView, StyleSheet } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { Colors, Icon, Text, View } from 'react-native-ui-lib'
import { useNavigation } from '@react-navigation/native'
import MediaPost from 'components/posts/MediaPost'
import HearDetailPost from 'components/posts/HearDetailPost'
import FooterDetailPost from 'components/posts/FooterDetailPost'
import numberFormat from 'configs/ui/format'
import { firePost } from 'src/hooks/api/fire'
import { useSelector } from 'react-redux'
import { watchPost } from 'src/hooks/api/post'

const PostDetail = ({
    id = '666d1a1d9aade859d65619e5',
}) => {
    const navigation = useNavigation()
    const user = useSelector(state => state.auth._id)
    const [post, setPost] = useState(null)
    const [isfire, setIsfire] = useState(false)
    const [iscomment, setiscomment] = useState(false)
    const [ismore, setIsmore] = useState(false)

    const getPost = async (query) => {
        const reponse = await watchPost(query)
        if (reponse.status) {
            setPost(reponse.data[0])
        }
        console.log(reponse.data[0]);
    }
    useEffect(() => {
        getPost({
            u: user,
            p: id
        })
    }, [])
    useEffect(() => {
        setIsfire(post?.isfire)
    }, [post])
    

    const handlerPressFire = async () => {
        const fire = await firePost(user, id)
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
                    <Text text80BO color={'white'}>{numberFormat(!isfire ? post?.fires : (post?.fires + 1))}</Text>
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
    if (post == null) {

    }
    else
        return (
            <View flex right>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    pagingEnabled={true}
                    snapToAlignment='center'
                    data={post.media}
                    renderItem={item => <MediaPost data={item} />}
                    key={item => item.id}
                />
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