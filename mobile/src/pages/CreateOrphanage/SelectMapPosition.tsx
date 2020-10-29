import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, Text, Image, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import MapView, { MapEvent, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import Spinner from 'react-native-loading-spinner-overlay'

import mapMarker from '../../images/map-marker.png'

export default function SelectMapPosition() {
    const navigation = useNavigation()
    const [location, setLocation] = useState<Location.LocationObject>()
    const [position, setPosition] = useState({ latitude: 0, longitude: 0 })

    useEffect(() => {
        ;(async () => {
            let { status } = await Location.requestPermissionsAsync()
            if (status !== 'granted') {
                navigation.navigate('OrphanagesMap')
            }

            let location = await Location.getCurrentPositionAsync({})

            console.log(location)

            setLocation(location)
        })()
    }, [])

    function handleNextStep() {
        navigation.navigate('OrphanageData', { ...position })
    }

    function handleSelectMapPosition(event: MapEvent) {
        setPosition(event.nativeEvent.coordinate)
    }

    if (!location) {
        return (
            <View style={styles.containerLoading}>
                <Spinner visible={true} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.mapStyle}
                initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008,
                }}
                onPress={handleSelectMapPosition}
            >
                {position.latitude !== 0 && (
                    <Marker
                        icon={mapMarker}
                        coordinate={{
                            latitude: position.latitude,
                            longitude: position.longitude,
                        }}
                    ></Marker>
                )}
            </MapView>

            {position.latitude !== 0 && (
                <RectButton style={styles.nextButton} onPress={handleNextStep}>
                    <Text style={styles.nextButtonText}> Próximo </Text>
                </RectButton>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },

    containerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },

    nextButton: {
        backgroundColor: '#15C3D6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 40,
    },

    nextButtonText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: '#FFF',
    },
})
