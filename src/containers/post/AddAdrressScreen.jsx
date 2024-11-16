import { Keyboard, StyleSheet, TextInput } from 'react-native'
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
const Adddrressscreen = ({ route }) => {
    const back = route.params?.back
    const { defaultlocation = locationdefault } = route.params
    const map = useRef(null)
    const navigation = useNavigation()
    const [loaction, setloaction] = useState(defaultlocation);
    const [marker, setMarker] = useState(defaultlocation)
    const [search, setSearch] = useState(defaultlocation?.detail)
    const [searchData, setSearchData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!route.params?.defaultlocation) getGeolocation()
    }, [])
    
    //Lấy vị trí nguời dùng
    const getGeolocation = () => {
        Geolocation.getCurrentPosition(location => {
            setloaction(new innitLocation(location.coords.latitude, location.coords.longitude, 0.005, 0.005))
        })
    }
    // chuyển về địa chỉ dạng chữ từ location
    const revversLoacation = async (loaction) => {
        const data = await reverLocation(loaction)
        if (data.items?.[0]) {
            setMarker({ ...loaction, name: data.items[0]?.address?.label })
        }
    }
    //chọn địa điểm marker trên bản đồ
    const handlePoiLocation = (el) => {
        // setSearchData([])
        const point = el.nativeEvent
        // console.log(point.coordinate);

        if (point?.coordinate) {
            const duration = 500
            revversLoacation({
                latitude: point.coordinate.latitude,
                longitude: point.coordinate.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            })
            // if (this.marker) {
            //     this.marker.animateMarkerToCoordinate(
            //         point.coordinate,
            //         duration
            //     );
            // }
        }
    }
    //Tìm kiếm địa điểm theo địa chỉ
    const handlerSearch = async () => {
        if (!search) {
            return
        }
        setLoading(true)
        var keysearch = search.trim()
        const locationsearch = `@${loaction.latitude},${loaction.longitude},16z`
        try {
            const data = await searchLocation(keysearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), locationsearch)
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
        return (<TouchableOpacity center style={{ width: 150 }}>
            <Text text100BO numberOfLines={2}>{item?.name || item?.detail}</Text>
            <IconApp assetName={"location"} size={25} />
        </TouchableOpacity>)
    }

    return (
        <View flex>
            <View flex style={StyleSheet.absoluteFillObject}>
                <MapView
                    ref={map}
                    style={[styles.mapSize, StyleSheet.absoluteFillObject]}
                    region={loaction}
                    showsMyLocationButton={false}
                    moveOnMarkerPress
                    onMarkerSelect={(e) => {
                        console.log(e.target);
                        
                    }}
                    scrollDuringRotateOrZoomEnabled
                    showsUserLocation={true}
                    onPress={handlePoiLocation}
                    provider='google'
                >
                    {marker && <MarkerAnimated
                        ref={marker => { this.marker = marker }}
                        coordinate={coordinate}
                    >{pointLocation(marker)}
                    </MarkerAnimated>}
                    {searchData.length ? searchData.map(element => {
                        const crood = {
                            latitude: element.latitude,
                            longitude: element.longitude,
                        }
                        return (<MarkerAnimated
                            
                            key={element.longitude}
                            ref={marker => { this.marker = marker }}
                            coordinate={crood}
                            onPress={() => {
                                setMarker({...defaultlocation, name: (element?.name + " " + element?.address), ...element})
                            }}
                        >{pointLocation(element)}</MarkerAnimated>)
                    }) : null}
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
                                    style={{color: 'black'}}
                                    placeholder={t("app.search")}
                                    value={search}
                                    onChangeText={setSearch} />
                            </View>
                            <TouchableOpacity margin-x center onPress={handlerSearch}>
                                <IconApp size={25} assetName={'search'} />
                            </TouchableOpacity>
                        </View>
                        <View bottom margin-v>
                            <TouchableOpacity br40 disabled={marker?.detail !== null ? false : true} bg-yellow padding-x onPress={() => {
                                navigation.navigate(back, {
                                    address: { ...marker }
                                })
                            }}>
                                <Text color='white'>Chọn</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={{ width: 42 }} center marginT-x bg-white padding-x br20 onPress={getGeolocation}>
                        <Icon size={22} assetName={"gps"} tintColor={Colors.yellow} />
                    </TouchableOpacity>
                </View>
            </View>
            {loading &&
                <View absF flex center bg-tr_black>
                    <LottieView loop autoPlay source={lottie.Search_location} style={{ width: 250, height: 250 }} />
                </View>
            }
        </View>
    )
}

export default Adddrressscreen

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
})