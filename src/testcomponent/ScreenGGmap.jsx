import { Dimensions, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { AnimatedRegion, MarkerAnimated } from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
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
  useEffect(() => {
    console.log("address", address)
  }, [address])
  useEffect(() => {
    console.log("name", name)
  }, [name])
  useEffect(() => {
    console.log("loaction", loaction)
  }, [loaction])

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
        <GooglePlacesAutocomplete
          GooglePlacesDetailsQuery={{ fields: "geometry" }}
          fetchDetails={true}
          placeholder="Search"
          query={{
            key: process.env.GOOGLE_PLACEHOLDERAUTOCOMPLETE,
            language: "vi",
          }}
          onPress={(data, details = null) => {
            console.log("data", data)
            setloaction({
              latitude: details?.geometry?.location?.lat,
              longitude: details?.geometry?.location?.lng
            })
          }}
        />
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