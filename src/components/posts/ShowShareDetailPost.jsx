import { Alert, Share, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { memo } from 'react'
import Modals from 'components/BottomSheetApp'
import { FlatList } from 'react-native-gesture-handler'
import RenderOptionModal from './common/RenderOptionModal'
import { t } from 'lang'
import { rePost } from 'src/hooks/api/post'
import { useSelector } from 'react-redux'
import Clipboard from '@react-native-clipboard/clipboard'

const ShowShareDetailPost = props => {
    const { disable, setDisable, post_id } = props
    const user = useSelector(state => state?.auth?.user)
    const handlerCopyLink = () => {
        setDisable(!disable)
        onShare(`${process.env.BASEAPI_URL+"share/PostDetail/"+post_id}/`)
        ToastAndroid.show(t("post.share"), ToastAndroid.SHORT)
        Clipboard.setString(`${process.env.BASEAPI_URL+"share/PostDetail/"+post_id}/`);
    }
    const onShare = async (link) => {
        try {
          const result = await Share.share({
            message:
              link,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          Alert.alert(error.message);
        }
      };
    const handlerRePost = async () => {
        setDisable(!disable)
        const body = {
            p: post_id,
            u: user?._id
        }
        const resault = await rePost(body)
        console.log(resault);
        
        if (resault.status) {
            ToastAndroid.show(t("app.success"), ToastAndroid.SHORT)
        } else {
            ToastAndroid.show(t("app.warning"), ToastAndroid.SHORT)
        }
    }
    const option = [
        { id: 1, img: "retweet", title: "post.retweet", disription: "post.retweet_d", funt: handlerRePost },
        { id: 2, img: "link", title: "post.copylink", disription: "post.copylink_d", funt: handlerCopyLink },
    ]

    return (
        <Modals modalVisible={disable} modalhiden={() => { setDisable(!disable) }}>
            <View>
                <FlatList
                    data={option}
                    key={(item) => item.id}
                    renderItem={({ item }) => <RenderOptionModal item={item} />}
                />
            </View>
        </Modals>
    )
}

export default memo(ShowShareDetailPost)

const styles = StyleSheet.create({})