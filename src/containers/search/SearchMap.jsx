import { FlatList, Keyboard, LayoutAnimation, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { AnimatedRegion, MarkerAnimated } from 'react-native-maps'
import { Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { t } from 'lang'
import IconApp from 'components/IconApp'
import Geolocation from "@react-native-community/geolocation";
import { useNavigation } from '@react-navigation/native'
import { reverLocation, searchLocation } from 'services/MapService'
import LottieView from 'lottie-react-native'
import lottie from 'configs/ui/lottie'
import { isCleanContent } from 'src/middleware/contentmiddleware'
import { CircleDot, Dot, ImageUpIcon, LocateFixed, MapPin, PanelBottomClose, Radar, Rss, Star, Utensils, UtensilsCrossed } from 'lucide-react-native'
import { getlocationpost } from 'src/hooks/api/search'
import numberFormat from 'configs/ui/format'
import Avatar from 'components/Avatar'
import RenderMedia from 'components/commons/RenderMedia'

class innitLocation {
    constructor(latitude, longitude, latitudeDelta, longitudeDelta) {
        this.latitude = latitude
        this.longitude = longitude
        this.latitudeDelta = latitudeDelta
        this.longitudeDelta = longitudeDelta
    }
}
const locationdefault = {
    detail: null,
    latitude: 108.43975632,
    longitude: 10.1946193,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005
}



const SearchMap = ({ route }) => {
    const { defaultlocation = locationdefault } = route.params
    const map = useRef(null)
    const navigation = useNavigation()
    const [loaction, setloaction] = useState(defaultlocation);
    const [marker, setMarker] = useState(defaultlocation)
    const [search, setSearch] = useState(defaultlocation?.detail)
    const [loading, setLoading] = useState(false)
    const [searchData, setSearchData] = useState([])
    const [nearhData, setNearData] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    useEffect(() => {
        if (!route.params?.defaultlocation) getGeolocation()
    }, [])

    //Lấy vị trí nguời dùng
    const getGeolocation = () => {
        Geolocation.getCurrentPosition(location => {
            setloaction(new innitLocation(location.coords.latitude, location.coords.longitude, 0.005, 0.005))

        })

    }
    //Lấy bài viết gần đây
    const getNearPosts = async () => {
        if (nearhData.length !== 0) {
            setNearData([])
            return
        }

        setLoading(true)
        setSearchData([])
        try {
            const data = await getlocationpost(marker.latitude, marker.longitude)
            if (data.status) {
                setNearData(data.data)
            }
        } catch (error) {

        } finally {
            setLoading(false)
        }

    }
    //làm sạch dũ liệu tìm kiếm
    const handleClear = () => {
        setSearch('')
        setSearchData([])
    }
    // chuyển về địa chỉ dạng chữ từ location
    const revversLoacation = async (loaction, name) => {
        const data = await reverLocation(loaction)
        if (data.items?.[0]) {
            setMarker({ ...loaction, name: name ? ` ${name}  ${data.items[0]?.address?.label}` : data.items[0]?.address?.label })
        }
    }
    //chọn địa điểm marker trên bản đồ
    const handlePoiLocation = (el, name) => {
        const point = el.nativeEvent
        if (point?.coordinate) {
            revversLoacation({
                latitude: point.coordinate.latitude,
                longitude: point.coordinate.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }, name)
        }
        setSearchData(prev => prev.filter((item) => item.name !== name))
    }
    //Tìm kiếm địa điểm theo địa chỉ
    const handlerSearch = async () => {
        if (!search || !isCleanContent(search)) {
            return
        }
        setNearData([])
        setLoading(true)
        var keysearch = search.trim()
        const locationsearch = `@${loaction.latitude},${loaction.longitude},16z`
        try {
            const data = await searchLocation(keysearch, locationsearch)
            if (data.length > 0) {
                const array = []
                for (const item of data) {
                    array.push({
                        name: item.title,
                        address: item.address,
                        latitude: item.gpsCoordinates.latitude,
                        longitude: item.gpsCoordinates.longitude,
                    })
                }
                setSearchData(array)
                if (array.length > 0) {
                    map.current?.fitToCoordinates(array, {
                        edgePadding: {
                            top: 50, left: 50, bottom: 50, right: 50
                        },
                        animated: true
                    })
                    Keyboard.dismiss()
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }
    //Tạo đánh dấu địa điểm đã chọn
    var coordinate = new AnimatedRegion({
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: marker.latitudeDelta,
        longitudeDelta: marker.longitudeDelta
    })
    // render địa điểm tìm kiếm
    const pointLocation = (item) => {
        return (<TouchableOpacity row center bg-white br30 padding-5 marginL-50>
            <IconApp assetName={"location"} size={20} />
            <Text style={{ width: 50 }} text100BO numberOfLines={2}>{item?.name || item?.detail}</Text>
        </TouchableOpacity>)
    }
    // render bài viêts gần đây
    const postNear = (item) => {
        return (
            <TouchableOpacity br30 row center style={{ backgroundColor: item?.isVip ? Colors.yellow : 'white' }} padding-5>
                <UtensilsCrossed size={15} color={Colors.red} />
                <Text marginL-4>{numberFormat(item?.fire)}</Text>
            </TouchableOpacity>)
    }
    const handlePointClick = (el) => {
        // setSearchData([])
        const point = el.nativeEvent
        if (point?.coordinate) {
            revversLoacation({
                latitude: point.coordinate.latitude,
                longitude: point.coordinate.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }, point.name)
        }

    }
    const renderPost = ({ item }) => {
        return (
            <View bg-white br30 padding-10 margin-5 style={{ width: 350, overflow: 'hidden' }}>
                <TouchableOpacity row height={30} onPress={() => navigation.navigate('PostDetail', { id: item?._id, defaultdata: item })}>
                    <View flex-8 row centerV>
                        <Avatar size={30} source={{ uri: item?.create_by?.avatar }} />
                        <Text marginL-10 text80BO>{item?.create_by?.name}</Text>
                    </View>
                    {item?.isVip && <Star color={Colors.yellow} />}
                </TouchableOpacity>
                <Text margin-5 numberOfLines={1}>{item?.content}</Text>
                <View br20 style={{ overflow: 'hidden' }} >
                    <RenderMedia item={item?.media[0]} />
                </View>
            </View>
        )
    }
    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50 // Item được coi là hiển thị khi 50% của nó nằm trong viewport
    };
    const onViewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    };
    const scrollToIndex = (index) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ animated: true, index });
        }
    }
    useEffect(() => {
        console.log(currentIndex);

    }, [currentIndex])

    return (
        <View flex>
            <View flex style={StyleSheet.absoluteFillObject}>
                <MapView
                    ref={map}
                    style={[styles.mapSize, StyleSheet.absoluteFillObject]}
                    region={loaction}
                    showsMyLocationButton={false}
                    moveOnMarkerPress
                    showsUserLocation={true}
                    onPress={handlePoiLocation}
                    onPoiClick={handlePointClick}
                    provider='google'
                >
                    {searchData.length ? searchData.map(element => {
                        const crood = {
                            latitude: element.latitude,
                            longitude: element.longitude,
                        }

                        return (<MarkerAnimated
                            key={element.longitude}
                            ref={marker => { this.marker = marker }}
                            coordinate={crood}
                            onPress={(e) => {
                                setMarker({ ...defaultlocation, name: (element?.name + " " + element?.address), ...element })
                            }}
                        >{pointLocation(element)}</MarkerAnimated>)
                    }) : null}
                    {nearhData.length ? nearhData.map(element => {
                        const crood = {
                            latitude: element.address.latitude,
                            longitude: element.address.longitude,
                        }

                        return (<MarkerAnimated
                            style={{ zIndex: 2 }}
                            key={element._id}
                            ref={marker => { this.marker = marker }}
                            coordinate={crood}
                            onPress={(e) => {
                                const index = nearhData.findIndex((item) => item?._id === element?._id)
                                scrollToIndex(index)
                            }}
                        >{postNear(element)}</MarkerAnimated>)
                    }) : null}
                    {marker && <MarkerAnimated
                        ref={marker => { this.marker = marker }}
                        coordinate={coordinate}
                    >{pointLocation(marker)}
                    </MarkerAnimated>}
                </MapView>
                {/* Top */}
                <View absH padding-x marginT-xxx right>
                    <View row flex>
                        <View bottom margin-v>
                            <TouchableOpacity br40 bg-yellow padding-x onPress={() => { navigation.goBack() }}>
                                <Icon assetName='arrow_back' size={20} tintColor='white' />
                            </TouchableOpacity>
                        </View>
                        <View centerV flex row bg-white br50 paddingL-x style={styles.shadow}>
                            <View flex>
                                <TextInput
                                    onSubmitEditing={handlerSearch}
                                    placeholderTextColor={'black'}
                                    style={{ color: 'black' }}
                                    placeholder={t("app.search")}
                                    value={search}
                                    onChangeText={setSearch} />
                            </View>
                            {searchData.length === 0 ? <TouchableOpacity margin-x center onPress={handlerSearch}>
                                <IconApp size={25} assetName={'search'} />
                            </TouchableOpacity> :
                                <TouchableOpacity margin-x center onPress={handleClear}>
                                    <IconApp size={25} assetName={'cancel'} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
            </View>
            <View width={42} style={styles.viewrightbutton}>
                <TouchableOpacity style={{ width: 42 }} center marginT-x bg-tr_black padding-x br20 onPress={getGeolocation}>
                    <LocateFixed color={Colors.yellow} />
                </TouchableOpacity>
                <TouchableOpacity style={{ width: 42 }} center marginT-x bg-tr_black padding-x br20 onPress={getNearPosts}>
                    {nearhData.length !== 0 ? <PanelBottomClose color={'white'} /> : <Radar color={Colors.yellow} />}
                </TouchableOpacity>
            </View>
            {nearhData.length !== 0 &&
                <View absB flex bg-tr_black centerH height={250} style={styles.width100}>
                    <FlatList style={styles.width100}
                        getItemLayout={(data, index) => (
                            { length: 360, offset: 360 * index, index }
                        )}
                        ref={flatListRef}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        pagingEnabled={true}
                        snapToAlignment="center"
                        data={nearhData}
                        initialNumToRender={1}
                        renderItem={(item) => renderPost(item)}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                    />
                </View>
            }
            {loading &&
                <View absF flex center bg-tr_black>
                    <LottieView loop autoPlay source={lottie.Search_location} style={styles.loading} />
                </View>
            }
        </View>
    )
}

export default SearchMap

const styles = StyleSheet.create({
    mapSize: {
        flex: 1
    },
    shadow: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 10,
    },
    button: {
        backgroundColor: Colors.yellow
    },
    loading: { width: 250, height: 250 },
    width100: { width: '100%' },
    viewrightbutton: { position: 'absolute', right: 10, top: 90 }
})