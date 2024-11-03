import { LayoutAnimation, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Home from './Home'
import Profile from './Profile'
import Setting from './Setting'
import Animated from 'react-native-reanimated'
import { t } from 'lang'
import TextApp from 'components/commons/TextApp'
import ShakePost from 'containers/extentions/ShakePost'
import { useSelector } from 'react-redux'

const Main = () => {
    const Toptab = createMaterialTopTabNavigator()
    const setting = useSelector(state => state.setting)
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
                                // LayoutAnimation.easeInEaseOut()
                            }
                        };

                        return (
                            <Animated.View key={route.key}>
                                <TouchableOpacity
                                    row
                                    backgroundColor={isFocused ? 'black' : 'white'}
                                    br100
                                    paddingH-x
                                    paddingV-ii
                                    spread
                                    center
                                    onPress={onPress}>
                                    <Icon assetName={route.name} size={15} tintColor={!isFocused ? 'black' : 'white'} marginR-v />
                                    <TextApp size={14} text={isFocused ? t(`app.${route.name}`) : ''} color={'white'} />
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
            {setting?.rollpost && <ShakePost isShake={isShake} setIsShake={setIsShake} />}
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
