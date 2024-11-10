import { FlatList, ImageBackground, LayoutAnimation, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon, Image, TouchableOpacity, View } from 'react-native-ui-lib'
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { map } from 'rxjs/operators';
import LottieView from 'lottie-react-native'
import lottie from 'configs/ui/lottie'
import { getRandom } from 'src/hooks/api/post'
import { fetchThumbnail } from 'configs/ui/components/thumbnail';
import RenderVideo from 'components/homes/RenderVideo';
const regex = /https?:\/\/[^\s]+?\.(jpg|jpeg|png|gif|bmp|webp|svg)/
const ShakePost = ({
    isShake, setIsShake
}) => {
    const [random, setRandom] = useState(null)
    const [medias, setMedias] = useState([])

    const getRandomPost = async () => {
        // if (isShake) { return }
        setIsShake(true)
        await getRandom().then(resault => {
            setTimeout(() => {
                setRandom(resault.data)
                setMedias(resault.data?.media)
            }, 1000)
        }
        )
            .catch(err => console.log(err))
        LayoutAnimation.easeInEaseOut()
    }
    const randomrota = (index) => {
        return ((index % 2 !== 1 ? '-' : '') + Math.floor(Math.random() * 20).toString() + 'deg')
    }

    const handleChangeImage = (image) => {
        setRandom(prev => {
            const updatedMedia = prev?.media?.filter(item => item !== image);
            return {
              ...prev,
              media: updatedMedia.length === 0 ? medias : updatedMedia
            };
          });
    }

    useEffect(() => {
        // Thiết lập khoảng thời gian cập nhật cho cảm biến
        setUpdateIntervalForType(SensorTypes.accelerometer, 2000); // 100ms

        const subscription = accelerometer
            .pipe(
                map(({ x, y, z }) => Math.sqrt(x * x + y * y + z * z)) // Tính độ lớn
            )
            .subscribe((acceleration) => {
                if (acceleration > 11) {
                    setRandom(null)
                    getRandomPost()
                }
            });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <>
            {isShake && <View absF flex bg-tr_black center>
                {(!random && isShake) ? <View>
                    <LottieView loop autoPlay source={lottie.Shake} style={{ width: 250, height: 250 }} />
                </View> :
                    <ImageBackground source={require('assets/icon/brush.png')} style={[styles.content]}>
                        {random?.media?.map(async (media, index) => (
                            <Pressable onPress={() => {handleChangeImage(media)}} style={[styles.imagerandom, { transform: [{ rotate: randomrota(index) }] }]}>
                                <Image source={{ uri: await fetchThumbnail(media) }} resizeMode='cover' style={{ width: '100%', height: '100%' }} />
                            </Pressable>
                        ))}
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            pagingEnabled={true}
                            key={item => item._id}
                            snapToAlignment='center'
                            data={random?.media}
                            renderItem={({ item, index }) =>
                                <View bg-white style={[styles.imagerandom, { transform: [{ rotate: randomrota(index) }] }]}>
                                    {regex.test(item) ? <Image source={{ uri: item }} resizeMode='cover' style={{ width: '100%', height: '100%' }} /> :
                                        <RenderVideo urlvideo={item} />
                                    }
                                </View>
                            }
                        />
                    </ImageBackground>}
                <TouchableOpacity onPress={() => { setRandom(null); setIsShake(false) }}>
                    <Icon assetName='cancel' size={30} />
                </TouchableOpacity>

            </View>}
        </>
    )
}

export default ShakePost

const styles = StyleSheet.create({
    content: { width: '100%', height: 350, justifyContent: 'center', alignItems: 'center' },
    imagerandom: { width: 220, height: 220, position: 'absolute', borderWidth: 3, borderColor: 'white', borderRadius: 5, overflow: 'hidden' }
})