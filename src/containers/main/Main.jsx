import { ImageBackground, LayoutAnimation, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Icon, Image, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Home from './Home'
import Profile from './Profile'
import Setting from './Setting'
import Animated from 'react-native-reanimated'
import { t } from 'lang'
import TextApp from 'components/commons/TextApp'
import ShakePost from 'containers/extentions/ShakePost'

const Main = () => {
    const Toptab = createMaterialTopTabNavigator()
    const [isShake, setIsShake] = useState(false)

    const CustomTabBar = ({ state, descriptors, navigation
    }) => {
        return (
            <View row centerV paddingH-iii style={styles.header}>
                <Text color={Colors.yellow} style={styles.text} >{t("app.name_app")}</Text>
                <View right row>
                    {state.routes.map((route) => {
                        const isFocused = state.index === state.routes.indexOf(route);
                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,

                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                                LayoutAnimation.easeInEaseOut()
                            }
                        };

                        return (
                            <Animated.View key={route.key}>
                                <TouchableOpacity
                                    row
                                    backgroundColor={isFocused ? 'black' : 'white'}
                                    br100
                                    paddingH-v
                                    paddingV-ii
                                    spread
                                    center
                                    onPress={onPress}>
                                    <Icon assetName={route.name} size={15} tintColor={!isFocused ? 'black' : 'white'} marginR-v />
                                    <TextApp text={route.name} color={!isFocused ? 'black' : 'white'} size={13} style={styles.font} />
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>
            </View>
        );
    };
    return (
        <View flex paddingT-xxx bg-white>
            <Toptab.Navigator screenOptions={{
                swipeEnabled: false
            }}
                initialRouteName='Home'
                tabBar={props => <CustomTabBar {...props} />}>
                <Toptab.Screen name='Home' component={Home} />
                <Toptab.Screen name='Profile' component={Profile} />

                <Toptab.Screen name='Settings' component={Setting} />
            </Toptab.Navigator>
            <ShakePost isShake={isShake} setIsShake={setIsShake} />
        </View>
    )
}

export default Main

const styles = StyleSheet.create({
    text: { fontSize: 32, fontFamily: "Inter-ExtraBoldItalic" },
    header: { width: '100%', justifyContent: 'space-between' },
    font: { fontFamily: 'Inter-Regular' },
    content: { width: '100%', height: 350, justifyContent: 'center', alignItems: 'center' },
    imagerandom: { width: 200, height: 200, position: 'absolute', borderWidth: 3, borderColor: 'white', borderRadius: 5, overflow: 'hidden' }
})

var abc = {
    "content": "Sốt cà chua nấu hoàn hảo thật tuyệt\n🤪🤪🤪",
    "hashtags": [
        "cachua",
        "y",
        "sot"
    ],
    "media": [
        "https://cdn.pixabay.com/photo/2016/12/06/18/27/tomatoes-1887240_640.jpg",
        "https://cdn.pixabay.com/photo/2016/12/06/18/27/tomatoes-1887240_640.jpg",
        "https://cdn.pixabay.com/photo/2016/12/06/18/27/tomatoes-1887240_640.jpg",
    ],
    "fire": [],
    "comments": [],
    "address": {
        "latitude": 10.8728926,
        "longitude": 106.6176021,
        "latitudeDelta": 0.005,
        "longitudeDelta": 0.005,
        "detail": "Hẻm 21 Đường Trung Mỹ Tây 16, Phường Trung Mỹ Tây, Quận 12, Hồ Chí Minh, Việt Nam"
    },
    "exist": false,
    "create_by": {
        "$oid": "669225710e3001246d117608"
    },
    "create_at": "1720854074280",
    "update_at": "1729321086117"
}