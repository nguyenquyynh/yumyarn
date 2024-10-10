import { StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { Text, View, Image, Button } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import UserRender from 'components/searchs/UserRender'

const data1 = [
  {
    "status": true,
    "data": [
      {
        "_id": "670299985244f74aa31194d5",
        "create_at": "1728223386557",
        "post": {
          "_id": "667f9fbbfc13ae1fdb234928",
          "content": "Banh u",
          "hashtags": [
            "Quận 1"
          ],
          "media": [
            "https://videos.pexels.com/video-files/4057920/4057920-sd_506_960_25fps.mp4"
          ],
          "address": {
            "detail": "Quận 12",
            "longitude": 123.123,
            "latitude": 123.123,
            "longitudeDelta": 123.123,
            "latitudeDelta": 123.123
          },
          "exist": true,
          "create_by": {
            "_id": "669225710e3001246d117608",
            "name": "Nguyen Xuan Quynh",
            "tagName": "quynh_64"
          },
          "create_at": "1720854074279",
          "update_at": "1720854074285",
          "fire": 1,
          "comments": 3,
          "isFire": true
        }
      }
    ]
  }
]

const FollowingList = () => {
  const navigation = useNavigation()

  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("profile.following")}>
      <View flex bg-white>
        <UserRender />

      </View>
    </Wapper>
  )
}

export default FollowingList

const styles = StyleSheet.create({


})