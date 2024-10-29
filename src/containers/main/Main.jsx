import { LayoutAnimation, StyleSheet, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Home from './Home'
import Profile from './Profile'
import Setting from './Setting'
import Animated from 'react-native-reanimated'
import { t } from 'lang'
import TextApp from 'components/commons/TextApp'
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map } from 'rxjs/operators';
import LottieView from 'lottie-react-native'
import lottie from 'configs/ui/lottie'

const Main = () => {
    const Toptab = createMaterialTopTabNavigator()
    const [isShake, setIsShake] = useState(false)

    useEffect(() => {
        // Thiết lập khoảng thời gian cập nhật cho cảm biến
        setUpdateIntervalForType(SensorTypes.accelerometer, 2000); // 100ms

        const subscription = accelerometer
            .pipe(
                map(({ x, y, z }) => Math.sqrt(x * x + y * y + z * z)) // Tính độ lớn
            )
            .subscribe((acceleration) => {
                // Kiểm tra nếu độ lớn lớn hơn một ngưỡng nhất định
                if (acceleration > 20) { // Ngưỡng có thể thay đổi
                    setIsShake(true)
                    setTimeout(() => {
                        setIsShake(false)
                    }, 2000);
                }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

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
            {isShake && <View absF flex bg-tr_black center>
                <View>
                    <LottieView loop autoPlay source={lottie.Shake} style={{width: 250, height: 250}} />
                </View>
                <TouchableOpacity>

                </TouchableOpacity>
            </View>}
        </View>
    )
}

export default Main

const styles = StyleSheet.create({
    text: { fontSize: 32, fontFamily: "Inter-ExtraBoldItalic" },
    header: { width: '100%', justifyContent: 'space-between' },
    font: { fontFamily: 'Inter-Regular' }
})