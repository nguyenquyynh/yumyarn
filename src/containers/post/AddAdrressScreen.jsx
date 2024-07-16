import { Dimensions, Keyboard, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { AnimatedRegion, MarkerAnimated } from 'react-native-maps'
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import ButtonApp from 'components/ButtonApp'
import IconApp from 'components/IconApp'
import Geolocation from "@react-native-community/geolocation";
import { useNavigation } from '@react-navigation/native'

const WIDTH_DIMENSION = Dimensions.get('window').width;
const HEIGHT_DIMENSION = Dimensions.get('window').height;

const AddAdrressScreen = ({ route }) => {
    const { defaultlocation } = route.params || {
        defaultlocation: {
            latitude: 10.8728926,
            longitude: 106.6176021,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        }
    }
    class innitLocation {
        constructor(latitude, longitude, latitudeDelta, longitudeDelta) {
            this.latitude = latitude
            this.longitude = longitude
            this.latitudeDelta = latitudeDelta
            this.longitudeDelta = longitudeDelta
        }
    }
    const map = useRef(null)
    const navigation = useNavigation()
    const [loaction, setloaction] = useState(defaultlocation);
    const [marker, setMarker] = useState(defaultlocation)
    const [address, setAddress] = useState({})
    const [search, setSearch] = useState('')
    const [searchData, setSearchData] = useState([])
    //Hàm chuyển component
    const gotoScreen = (screen) => {
        navigation.navigate(screen)
    }
    //Lấy vị trí nguời dùng
    const getGeolocation = () => {
        Geolocation.getCurrentPosition(location => {
            setloaction(new innitLocation(location.coords.latitude, location.coords.longitude, 0.005, 0.005))
        })
    }
    useEffect(() => {
        getGeolocation()
    }, [])
    // chuyển về địa chỉ dạng chữ từ location
    const revversLoacation = async (loaction) => {
        await fetch(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${loaction?.latitude},${loaction?.longitude}&lang=vi-VN&apiKey=${process.env.MAPAPI_KEY}`, {
            method: 'GET',
        }).then(async (response) => {
            const a = await response.json()
            if (a.items?.[0]) {
                setAddress({
                    name: a.items[0]?.address?.label,
                    latitude: a.items?.[0].access?.[0].lat,
                    longitude: a.items?.[0].access?.[0].lng,
                });
            }


        }
        ).catch(err => console.log(err));
    }
    //chọn địa điểm marker trên bản đồ
    const handlePoiLocation = (el) => {
        const point = el.nativeEvent
        if (point?.coordinate) {
            const duration = 500
            if (loaction.latitude !== point.coordinate.latitude) {
                setMarker({
                    latitude: point.coordinate.latitude,
                    longitude: point.coordinate.longitude,
                    latitudeDelta: point.coordinate.latitudeDelta,
                    longitudeDelta: point.coordinate.longitudeDelta
                })
                revversLoacation({
                    latitude: point.coordinate.latitude,
                    longitude: point.coordinate.longitude,
                })
                if (Platform.OS === 'android') {
                    if (this.marker) {
                        this.marker.animateMarkerToCoordinate(
                            point.coordinate,
                            duration
                        );
                    }
                } else {
                    this.state.coordinate.timing({
                        ...nextProps.coordinate,
                        useNativeDriver: true,
                        duration
                    }).start();
                }
            }
        }
    }
    //Tìm kiếm địa điểm theo địa chỉ
    const handlerSearch = async () => {
        if (search.trim().length > 0) {
            var keysearch = search.trim()
            const locationsearch = `${loaction.latitude, loaction.longitude}&radius=2000`
            const url = `${process.env.URL_SEARCH}?query=${keysearch}&location=${locationsearch}&key=${process.env.SEARCHAPI_KEY}`
            try {
                const response = await fetch(url)
                const data = await response.json()
                if (data && data.results) {
                    const array = []
                    for (const item of data.results) {
                        array.push({
                            name: item.name,
                            address: item.formatted_address,
                            latitude: item.geometry.location.lat,
                            longitude: item.geometry.location.lng,
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
            }
        }
    }
    //Tạo đánh dấu địa điểm đã chọn
    var coordinate = new AnimatedRegion({
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: marker.latitudeDelta,
        longitudeDelta: marker.longitudeDelta
    })
    //Giao diện nút chọn góc phải
    const renderButtonRight = () => {
        return (
            <ButtonApp iconleft={"search"}
                iconright={"notifycation"}
                color={Colors.white}
                padding={'padding-10'}
                title={t("add_location.choose")}
                sizeText={13}
                onclick={() => {
                    navigation.navigate("Post", {
                        locationname: address?.name,
                        location_lat: address?.latitude,
                        loaction_lng: address?.longitude
                    })
                }}
            />
        )
    }
    //Thay đổi vùng chọn bản đồ
    const religionZoneChange = (religion) => {
        if (
            Math.abs(religion.latitude - loaction.latitude) > 0.0001 ||
            Math.abs(religion.longitude - loaction.longitude) > 0.0001 ||
            Math.abs(religion.latitudeDelta - loaction.latitudeDelta) > 0.0001 ||
            Math.abs(religion.longitudeDelta - loaction.longitudeDelta) > 0.0001
        ) {
            setloaction({
                latitude: religion.latitude,
                longitude: religion.longitude,
                latitudeDelta: religion.latitudeDelta,
                longitudeDelta: religion.longitudeDelta,
            });
        }
    }
    // render địa điểm tìm kiếm
    const pointLocation = () => {
        return (<TouchableOpacity>
            <IconApp assetName={"location"} size={25} />
        </TouchableOpacity>)
    }
    return (
        <Wapper gadient title={t('add_location.title')} renderleft customright={renderButtonRight} funtleft={() => { navigation.goBack() }}>
            <View flex style={StyleSheet.absoluteFillObject}>
                <MapView
                    ref={map}
                    style={[styles.mapSize, StyleSheet.absoluteFillObject]}
                    region={{
                        latitude: loaction.latitude,
                        longitude: loaction.longitude,
                        latitudeDelta: loaction.latitudeDelta,
                        longitudeDelta: loaction.longitudeDelta,
                    }}
                    onRegionChangeComplete={religionZoneChange}
                    moveOnMarkerPress
                    showsUserLocation={true}
                    onPress={handlePoiLocation}
                    provider='google'
                >
                    {marker && <MarkerAnimated
                        ref={marker => { this.marker = marker }}
                        coordinate={coordinate}
                    >{pointLocation()}
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
                                setAddress({
                                    name: `${element.name} ${element.address}`,
                                    longitude: element.longitude,
                                    latitude: element.latitude
                                })
                            }}
                        >{pointLocation()}</MarkerAnimated>)
                    }) : null}
                </MapView>
                <View absF padding-10 >
                    <View centerV row bg-white br50 paddingL-xx style={styles.shadow}>
                        <View flex-7>
                            <TextInput
                                placeholder={t("app.search")}
                                value={search}
                                onChangeText={setSearch} />
                        </View>
                        <TouchableOpacity flex-1 center onPress={handlerSearch}>
                            <IconApp size={22} assetName={'search'} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View flex absB right padding-xx row centerV>
                    <TouchableOpacity bg-white padding-x br20 onPress={getGeolocation}>
                        <IconApp size={22} assetName={"gps"} />
                    </TouchableOpacity>
                    {address && <View flex bg-white marginL-x br20 paddingH-v>
                        <Text vText >{address?.name}</Text>
                    </View>}
                </View>
            </View>
        </Wapper>
    )
}

export default AddAdrressScreen

const styles = StyleSheet.create({
    mapSize:
    {
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