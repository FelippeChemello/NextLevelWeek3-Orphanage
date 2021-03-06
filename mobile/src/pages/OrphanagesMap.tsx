import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps'
import * as Location from 'expo-location'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Spinner from 'react-native-loading-spinner-overlay'

import mapMarker from '../images/map-marker.png'
import api from '../services/api'

interface Orphanage {
    id: number
    latitude: number
    longitude: number
    name: string
}

export default function OrphanagesMap() {
    const [location, setLocation] = useState<Location.LocationObject>()
    const [errorMsg, setErrorMsg] = useState('')
    const navigation = useNavigation()
    const [orphanages, setOrphanages] = useState<Orphanage[]>([])

    useEffect(() => {
        ;(async () => {
            let { status } = await Location.requestPermissionsAsync()
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied')
            }

            let location = await Location.getCurrentPositionAsync({})

            console.log(location)

            setLocation(location)
        })()
    }, [])

    useFocusEffect(() => {
        api.get('orphanages').then(response => {
            console.log('buscando dados')

            setOrphanages(response.data)
        })
    })

    function handleNavigateToOrphanageDetails(id: number) {
        navigation.navigate('OrphanageDetails', { id })
    }

    function handleNavigateToCreateOrphanage() {
        navigation.navigate('SelectMapPosition')
    }

    return (
        <View style={styles.container}>
            {errorMsg || !location ? (
                <View style={styles.containerLoading}>
                    <Spinner visible={true} />
                </View>
            ) : (
                <>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.008,
                            longitudeDelta: 0.008,
                        }}
                    >
                        {orphanages.map(orphanage => {
                            return (
                                <Marker
                                    key={orphanage.id}
                                    icon={mapMarker}
                                    coordinate={{
                                        latitude: orphanage.latitude,
                                        longitude: orphanage.longitude,
                                    }}
                                    calloutAnchor={{
                                        x: 2.7,
                                        y: 0.8,
                                    }}
                                >
                                    <Callout tooltip={true} onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
                                        <View style={styles.calloutContainer}>
                                            <Text style={styles.calloutText}>{orphanage.name}</Text>
                                        </View>
                                    </Callout>
                                </Marker>
                            )
                        })}
                    </MapView>
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>
                        <TouchableOpacity style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanage}>
                            <Feather name='plus' size={20} color='#fff'></Feather>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        textAlign: 'center',
        justifyContent: 'center',
    },
    containerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    calloutContainer: {
        width: 160,
        minHeight: 46,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        borderRadius: 16,
        justifyContent: 'center',
    },
    calloutText: {
        color: '#0089a5',
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
    },
    footer: {
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 32,

        backgroundColor: '#fff',

        borderRadius: 20,
        height: 56,
        paddingLeft: 24,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        elevation: 3,
    },
    footerText: {
        color: '#8fa7b3',
        fontFamily: 'Nunito_700Bold',
    },
    createOrphanageButton: {
        width: 56,
        height: 56,
        backgroundColor: '#15c3d6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
