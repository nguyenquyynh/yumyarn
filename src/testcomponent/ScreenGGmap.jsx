import { Alert, Dimensions, StyleSheet, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { AnimatedRegion, MarkerAnimated } from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { Button, Image, TouchableOpacity, View } from 'react-native-ui-lib'
import IconCustom from 'components/IconCustom'
const ScreenGGmap = ({
  defaultlocation = {
    latitude: 10.853970547367098,
    longitude: 106.62585228681564,
  },
  ...props
}) => {

  var innitlocation = {
    latitude: defaultlocation.latitude,
    longitude: defaultlocation.longitude,
  }
  const [loaction, setloaction] = useState(innitlocation);
  const [address, setAddress] = useState('address')
  const [name, setName] = useState('name')
  const [search, setSearch] = useState('66/5C Tổ 128 ấp Đông')

  const revversLoacation = async (loaction) => {
    await fetch(`https://revgeocode.search.hereapi.com/v1/revgeocode?at=${loaction?.latitude},${loaction?.longitude}&lang=vi-VN&apiKey=${process.env.MAPAPI_KEY}`, {
      method: 'GET',
    }).then(async (response) => {
      const a = await response.json()
      if (a.items?.[0]) {
        setAddress(a.items[0]?.address?.label);
      }
    }
    )
      .catch(err => console.log(err));
  }
  //chọn địa điểm msker trên bản đồ
  const handlePoiLocation = (point) => {
    if (point?.coordinate) {
      const duration = 500
      setName(point?.name || '')
      if (innitlocation.latitude !== point.coordinate.latitude) {
        setloaction({
          latitude: point.coordinate.latitude,
          longitude: point.coordinate.longitude,
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
    var keysearch = keyvalue.trim()
    // search.split('').map(char => urlEncoding[char] || char).join('');

    const locationsearch = `${loaction.latitude, loaction.longitude}&radius=2000`
    const url = `${process.env.URL_SEARCH}?query=${keysearch}&location=${locationsearch}&key=${process.env.SEARCHAPI_KEY}`

    try {
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.log(error);
    }

  }
  //Tạo đánh dấu địa điểm đã chọn
  var coordinate = new AnimatedRegion({
    latitude: loaction.latitude,
    longitude: loaction.longitude,
  })
  return (
    <View style={[styles.container, StyleSheet.absoluteFillObject]}>
      <MapView
        style={[styles.map, StyleSheet.absoluteFillObject]}
        region={{
          latitude: loaction.latitude,
          longitude: loaction.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        moveOnMarkerPress
        showsUserLocation={true}
        onPress={loaction => handlePoiLocation(loaction.nativeEvent)}
        onPoiClick={el => handlePoiLocation(el.nativeEvent)}
        showsMyLocationButton
        provider='google'
      >
        <MarkerAnimated
          ref={marker => { this.marker = marker }}
          coordinate={coordinate}
        />
      </MapView>
      <View style={{ position: 'absolute', width: '100%', top: 0, left: 0, padding: 20 }}>
        <View centerV row bg-white>
          <View flex-6>
            <TextInput style={{
              backgroundColor: 'white',
              color: 'black'
            }}
              value={search}
              onChangeText={setSearch} />
          </View>
          <TouchableOpacity flex-1 center onPress={handlerSearch}>
            <IconCustom size={30} name={'search'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ScreenGGmap

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
})