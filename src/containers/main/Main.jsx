import { StyleSheet } from 'react-native'
import React from 'react'
import { Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Home from './Home'
import Profile from './Profile'
import Setting from './Setting'
import Animated from 'react-native-reanimated'
import { t } from 'lang'
import TextApp from 'components/commons/TextApp'

const Main = () => {
    const Toptab = createMaterialTopTabNavigator()
    const CustomTabBar = ({ state, descriptors, navigation
    }) => {
        return (
            <View row centerV style={styles.header}>
                <Text style={styles.text} >{t("app.name_app")}</Text>
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
                            }
                        };

                        return (
                            <Animated.View key={route.key}>
                                <TouchableOpacity
                                    row
                                    backgroundColor={isFocused ? 'black' : 'white'}
                                    br100
                                    paddingH-v
                                    paddingV-iv
                                    spread
                                    center
                                    onPress={onPress}>
                                    <Icon assetName={route.name} size={15} tintColor={!isFocused ? 'black' : 'white'} marginR-v/>
                                    <TextApp text={route.name} color={!isFocused ? 'black' : 'white'} size={14} style={styles.font}/>
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
            <Toptab.Navigator tabBar={props => <CustomTabBar {...props} />}>
                <Toptab.Screen name='Home' component={Home} />
                <Toptab.Screen name='Profile' component={Profile} />
                <Toptab.Screen name='Settings' component={Setting} />
            </Toptab.Navigator>
        </View>
    )
}

export default Main

const styles = StyleSheet.create({
    text: { fontSize: 32, fontFamily: "Inter-ExtraBoldItalic" },
    header: {width: '100%', justifyContent: 'space-between'},
    font: { fontFamily: 'Inter-Regular' }
})