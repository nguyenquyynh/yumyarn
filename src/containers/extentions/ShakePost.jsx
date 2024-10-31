import { ImageBackground, LayoutAnimation, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon, Image, TouchableOpacity, View } from 'react-native-ui-lib'
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map } from 'rxjs/operators';
import LottieView from 'lottie-react-native'
import lottie from 'configs/ui/lottie'
import { getRandom } from 'src/hooks/api/post'
import { fetchThumbnail } from 'configs/ui/components/thumbnail';

const ShakePost = ({
    isShake, setIsShake
}) => {
    const [random, setRandom] = useState(null)

    const getRandomPost = async () => {
        setIsShake(true)
        await getRandom().then(async resault => {
            await setTimeout(() => { setRandom(resault.data) }, 3000)
        }
        )
            .catch(err => console.log(err))
            .finally(() => {
                // setIsShake(false)
            })
        LayoutAnimation.easeInEaseOut()
    }
    const randomrota = (index) => {
        return ((index % 2 !== 1 ? '-' : '') + Math.floor(Math.random() * 20).toString() + 'deg')
    }

    useEffect(() => {
        // Thiết lập khoảng thời gian cập nhật cho cảm biến
        setUpdateIntervalForType(SensorTypes.accelerometer, 2000); // 100ms

        const subscription = accelerometer
            .pipe(
                map(({ x, y, z }) => Math.sqrt(x * x + y * y + z * z)) // Tính độ lớn
            )
            .subscribe((acceleration) => {
                if (acceleration > 12) {
                    getRandomPost()
                }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, []);
    useEffect(() => {
      console.log(random);
      
    }, [random])
    
    return (
        <>
            {isShake && <View absF flex bg-tr_black center>
                {!random ? <View>
                    <LottieView loop autoPlay source={lottie.Shake} style={{ width: 250, height: 250 }} />
                </View> :
                    <ImageBackground source={require('assets/icon/brush.png')} style={[styles.content]}>
                        {random?.media?.map(async (media, index) => (
                            <View style={[styles.imagerandom, { transform: [{ rotate: randomrota(index) }] }]}>
                                <Image source={{ uri: await fetchThumbnail(media) }} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
                            </View>
                        ))}
                    </ImageBackground>}
                <TouchableOpacity onPress={() => { setIsShake(); setRandom(null) }}>
                    <Icon assetName='cancel' size={30} />
                </TouchableOpacity>

            </View>}
        </>
    )
}

export default ShakePost

const styles = StyleSheet.create({
    content: { width: '100%', height: 350, justifyContent: 'center', alignItems: 'center' },
    imagerandom: { width: 200, height: 200, position: 'absolute', borderWidth: 3, borderColor: 'white', borderRadius: 5, overflow: 'hidden' }
})