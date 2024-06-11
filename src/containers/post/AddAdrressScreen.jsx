import { Alert, Dimensions, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { AnimatedRegion, MarkerAnimated } from 'react-native-maps'
import { Colors, Shadows, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import ButtonApp from 'components/ButtonApp'
import IconApp from 'components/IconApp'
import Geolocation from "@react-native-community/geolocation";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
const AddAdrressScreen = ({
    defaultlocation = {
        latitude: 10.853970547367098,
        longitude: 106.62585228681564,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
    },
    ...props
}) => {
    class innitLocation {
        constructor(latitude, longitude, latitudeDelta, longitudeDelta) {
            this.latitude = latitude
            this.longitude = longitude
            this.latitudeDelta = latitudeDelta
            this.longitudeDelta = longitudeDelta
        }
    }
    const [loaction, setloaction] = useState(defaultlocation);
    const [marker, setMarker] = useState(defaultlocation)
    const [address, setAddress] = useState('address')
    const [search, setSearch] = useState('')

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
                setAddress(a.items[0]?.address?.label);
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
    const handlerSearch = async (keyvalue) => {
        const urlEncoding = {
            " ": "%20",
            "!": "%21",
            "\"": "%22",
            "#": "%23",
            "$": "%24",
            "%": "%25",
            "&": "%26",
            "'": "%27",
            "(": "%28",
            ")": "%29",
            "*": "%2A",
            "+": "%2B",
            ",": "%2C",
            "-": "%2D",
            ".": "%2E",
            "/": "%2F",
            ":": "%3A",
            ";": "%3B",
            "<": "%3C",
            "=": "%3D",
            ">": "%3E",
            "?": "%3F",
            "@": "%40",
            "[": "%5B",
            "\\": "%5C",
            "]": "%5D",
            "^": "%5E",
            "_": "%5F",
            "`": "%60",
            "{": "%7B",
            "|": "%7C",
            "}": "%7D",
            "~": "%7E"
        };
        var keysearch = search.split('').map(char => urlEncoding[char] || char).join('');

        await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&input=${keysearch}&inputtype=textquery&key=${process.env.SEARCHAPI_KEY}`)
            .then(async response => {
                const data = await response.json()
                console.log(data)
                if (data.status == 'OK') {
                    Alert.alert(data.candidates[0].formatted_address)
                    const location = data.candidates[0].geometry.location
                    setloaction({
                        latitude: location.lat,
                        longitude: location.lng,
                        longitudeDelta: loaction.longitudeDelta,
                        latitudeDelta: loaction.latitudeDelta
                    })

                    setMarker({
                        latitude: location.lat,
                        longitude: location.lng,
                        latitudeDelta: loaction.latitudeDelta,
                        longitudeDelta: loaction.longitudeDelta
                    });
                }
            })
            .catch(async error => {
                const data = await error.json
                console.log(data + "eror");
            })

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
            <ButtonApp 
            iconleft={"search"}
                iconright={"notifycation"}
                color={Colors.white}
                padding={'padding-10'}
                title={t("add_location.choose")}
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
    return (
        <Wapper gadient={true} title={t('add_location.title')} renderleft customright={renderButtonRight}>
            <View flex style={StyleSheet.absoluteFillObject}>
                <MapView
                    style={[styles.map, StyleSheet.absoluteFillObject]}
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
                    <MarkerAnimated
                        ref={marker => { this.marker = marker }}
                        coordinate={coordinate}
                    />
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


                {/* <GooglePlacesAutocomplete
                    placeholder='Search'
                    query={{
                        key: process.env.SEARCHAPI_KEY,
                        language: 'vi',
                        components: 'country:vn' 
                    }}
                    fetchDetails={true}
                    onPress={(data, details = null) => console.log(data, details)}
                    onFail={error => console.log(error)}
                    onNotFound={() => console.log('no results')}
                /> */}

                <View flex absB right padding-20 row centerV>
                    <TouchableOpacity bg-white padding-10 br20 onPress={getGeolocation}>
                        <IconApp size={22} assetName={"gps"} />
                    </TouchableOpacity>
                    <View flex bg-white marginL-x br20 paddingH-v>
                        <Text vText >{address}</Text>
                    </View>
                </View>
            </View>
        </Wapper>
    )
}

export default AddAdrressScreen

const styles = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    shadow: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 10,
    }
})