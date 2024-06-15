import { Alert, Dimensions, Keyboard, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { AnimatedRegion, Marker, MarkerAnimated } from 'react-native-maps'
import { Colors, Shadows, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import ButtonApp from 'components/ButtonApp'
import IconApp from 'components/IconApp'
import Geolocation from "@react-native-community/geolocation";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useNavigation } from '@react-navigation/native'
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
        <Wapper gadient={true} title={t('add_location.title')} renderleft customright={renderButtonRight} funtleft={() => { navigation.goBack() }}>
            <View flex style={StyleSheet.absoluteFillObject}>
                <MapView
                    ref={map}
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
    },
})

// var data = [
//     { address: "01 Đ. Quang Trung, Phường 3, Gò Vấp, Thành phố Hồ Chí Minh 700000, Vietnam", latitude: 10.826334, longitude: 106.6792287, name: "McDonald's" },
//     { address: "683 Đ. Âu Cơ, Tân Thành, Tân Phú, Thành phố Hồ Chí Minh 700000, Vietnam", latitude: 10.7884856, longitude: 106.6405601, name: "McDonald’s" },
//     { address: "2-6Bis Đ. Điện Biên Phủ, Đa Kao, Quận 1, Thành phố Hồ Chí Minh 70000, Vietnam", latitude: 10.7924818, longitude: 106.6988354, name: "McDonald's Dakao" },
//     { address: "460 Đ. 3 Tháng 2, Phường 12, Quận 10, Thành phố Hồ Chí Minh, Vietnam", latitude: 10.768439, longitude: 106.6680117, name: "McDonald's" },
//     { address: "Phòng A1, Tầng trệt, Khu vực thương mại Nhà giữ xe Ga Quốc Nội, Tân Bình, 700000, Vietnam", latitude: 10.8132539, longitude: 106.6629848, name: "McDonald's Tân Sơn Nhất" },
//     { address: "TTTM Sài Gòn Centre, B2, 65 Đ. Lê Lợi, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh 700000, Vietnam", latitude: 10.7731883, longitude: 106.7009194, name: "McDonald's" },
//     { address: "242 Đ. Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh 700000, Vietnam", latitude: 10.8276003, longitude: 106.7212132, name: "McDonald's" },
//     { address: "Tầng trệt, Chung cư H3, 384 Hoàng Diệu, Quận 4, Ho Chi Minh City, Thành phố Hồ Chí Minh 700000, Vietnam", latitude: 10.7601771, longitude: 106.6989783, name: "McDonald's" },
//     { address: "TTTM Vincom megamall, 161 Đ. Võ Nguyên Giáp, Thảo Điền, Thủ Đức, Thành phố Hồ Chí Minh 700000, Vietnam", latitude: 10.8023307, longitude: 106.741712, name: "McDonald's" },
//     { address: "30 Đ. Tân Thắng, Sơn Kỳ, Tân Phú, Thành phố Hồ Chí Minh 700000, Vietnam", latitude: 10.8016988, longitude: 106.6175257, name: "McDonald's Aeon Mall Celadon Tân Phú" },
//     { address: "1 Đ. Trần Hưng Đạo, Phường Nguyễn Thái Bình, Quận 1, Thành phố Hồ Chí Minh, Vietnam", latitude: 10.7696618, longitude: 106.6977815, name: "Mc Cafe" },
//     { address: "425 Đ. Âu Cơ, Phú Trung, Tân Phú, Thành phố Hồ Chí Minh, Vietnam", latitude: 10.7780879, longitude: 106.6455019, name: "MC coffee" },
//     { address: "26 Bàu Cát, Phường 14, Tân Bình, Thành phố Hồ Chí Minh 700000, Vietnam", latitude: 10.7922117, longitude: 106.6413588, name: "MC Coffee" },
//     { address: "Tầng trệt, TTTM Centre Mall, C6/27 Đ. Phạm Hùng, Bình Hưng, Bình Chánh, Thành phố Hồ Chí Minh 700000, Vietnam", latitude: 10.7332423, longitude: 106.6742668, name: "McDonald's" },
//     { address: "242 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Thành phố Hồ Chí Minh 70000, Vietnam", latitude: 10.8378986, longitude: 106.6713175, name: "McDonald's Lotte Gò Vấp" },
//     { address: "34A Đ. 16, Linh Chiểu, Thủ Đức, Thành phố Hồ Chí Minh 70000, Vietnam", latitude: 10.8585607, longitude: 106.7610063, name: "MC coffe" },
//     { address: "10 Đường số 33, Tân Thông Hội, Củ Chi, Thành phố Hồ Chí Minh, Vietnam", latitude: 10.9702707, longitude: 106.5057716, name: "MC coffee" },
//     { address: "Tan Thanh, Tân Phú, Ho Chi Minh City, Vietnam", latitude: 10.7895096, longitude: 106.6339342, name: "Công Ty Cp Thời Trang Mc Việt Nam Tổng Đại Lý Phía Nam" },
//     { address: "13a Trần Văn Chẩm, Tân Thông Hội, Củ Chi, Thành phố Hồ Chí Minh, Vietnam", latitude: 10.9593163, longitude: 106.5106499, name: "MC COFFEE" },
//     { address: "502 Hà Huy Giáp, Thạnh Lộc, Quận 12, Thành phố Hồ Chí Minh, Vietnam", latitude: 10.8749805, longitude: 106.6769001, name: "Đại lý thời trang MC FASHION Quận 12-Thời trang nữ công sở" }
// ];