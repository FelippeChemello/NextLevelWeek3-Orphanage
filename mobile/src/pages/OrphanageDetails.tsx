import React, { useEffect, useState } from 'react'
import { Text, Image, View, ScrollView, StyleSheet, Dimensions, Linking } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { Feather, FontAwesome } from '@expo/vector-icons'
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler'
import { useRoute } from '@react-navigation/native'

import mapMarker from '../images/map-marker.png'
import api from '../services/api'
import Spinner from 'react-native-loading-spinner-overlay'

interface Orphanage {
    latitude: number
    longitude: number
    name: string
    about: string
    instructions: string
    openingHours: string
    openOnWeekends: boolean
    images: Array<{
        url: string
        id: number
    }>
}

interface RouteParams {
    id: number
}

export default function OrphanageDetails() {
    const route = useRoute()
    const routeParams = route.params as RouteParams
    const [orphanage, setOrphanage] = useState<Orphanage>()

    useEffect(() => {
        api.get(`orphanages/${routeParams.id}`).then(response => {
            setOrphanage(response.data)
        })
    }, [routeParams.id])

    if (!orphanage) {
        return (
            <View style={styles.containerLoading}>
                <Spinner visible={true} />
            </View>
        )
    }

    console.log(orphanage.images[0].url.replace('localhost', '192.168.0.9'))

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imagesContainer}>
                <ScrollView horizontal pagingEnabled>
                    {orphanage.images.map(image => {
                        console.log(image.url.replace('localhost', '192.168.0.9'))
                        return <Image key={image.id} style={styles.image} source={{ uri: image.url }} />
                    })}
                </ScrollView>
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.title}> {orphanage.name} </Text>
                <Text style={styles.description}> {orphanage.about} </Text>

                <View style={styles.mapContainer}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.mapStyle}
                        initialRegion={{
                            latitude: orphanage.latitude,
                            longitude: orphanage.longitude,
                            latitudeDelta: 0.008,
                            longitudeDelta: 0.008,
                        }}
                    >
                        <Marker
                            icon={mapMarker}
                            coordinate={{
                                latitude: orphanage.latitude,
                                longitude: orphanage.longitude,
                            }}
                        ></Marker>
                    </MapView>

                    <TouchableOpacity
                        style={styles.routesContainer}
                        onPress={() =>
                            Linking.openURL(`https://maps.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`)
                        }
                    >
                        <Text style={styles.routesText}> Ver rotas no Google Maps </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.separator} />

                <Text style={styles.title}> Instruções para visita </Text>
                <Text style={styles.description}> {orphanage.instructions} </Text>

                <View style={styles.scheduleContainer}>
                    <View style={[styles.scheduleItem, styles.scheduleItemBlue]}>
                        <Feather name='clock' size={40} color='#2aB5D1' />
                        <Text style={[styles.scheduleText, styles.scheduleTextBlue]}>De Segunda à Sexta {orphanage.openingHours}</Text>
                    </View>
                    {orphanage.openOnWeekends ? (
                        <View style={[styles.scheduleItem, styles.scheduleItemGreen]}>
                            <Feather name='info' size={40} color='#39CC83' />
                            <Text style={[styles.scheduleText, styles.scheduleTextGreen]}>Atendemos aos finais de semana</Text>
                        </View>
                    ) : (
                        <View style={[styles.scheduleItem, styles.scheduleItemRed]}>
                            <Feather name='info' size={40} color='#ff5795' />
                            <Text style={[styles.scheduleText, styles.scheduleTextRed]}>Não atendemos aos finais de semana</Text>
                        </View>
                    )}
                </View>

                {/* <RectButton style={styles.contactButton} onPress={() => alert('click')}>
                    <FontAwesome name='whatsapp' size={24} color='#FFF' />
                    <Text style={styles.contactButtonText}> Entrar em contato </Text>
                </RectButton> */}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    containerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    imagesContainer: {
        height: 240,
    },

    image: {
        width: Dimensions.get('window').width,
        height: 240,
        resizeMode: 'cover',
    },

    detailsContainer: {
        padding: 24,
    },

    title: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 30,
        color: '#4D6F80',
    },

    description: {
        fontFamily: 'Nunito_600SemiBold',
        color: '#5C8599',
        lineHeight: 24,
        marginTop: 16,
    },

    mapContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1.2,
        borderColor: '#B3DAE2',
        marginTop: 40,
        backgroundColor: '#E6F7FB',
    },

    mapStyle: {
        width: '100%',
        height: 150,
    },

    routesContainer: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    routesText: {
        fontFamily: 'Nunito_700Bold',
        color: '#0089a5',
    },

    separator: {
        height: 0.8,
        width: '100%',
        backgroundColor: '#D3E2E6',
        marginVertical: 40,
    },

    scheduleContainer: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    scheduleItem: {
        width: '47%',
        padding: 20,
    },

    scheduleItemBlue: {
        backgroundColor: '#E6F7F8',
        borderWidth: 1,
        borderColor: '#B3DAE2',
        borderRadius: 20,
    },

    scheduleItemGreen: {
        backgroundColor: '#EDFFF6',
        borderWidth: 1,
        borderColor: '#A1E9C5',
        borderRadius: 20,
    },

    scheduleItemRed: {
        backgroundColor: '#fdf0f5',
        borderWidth: 1,
        borderColor: '#ffbcd4',
        borderRadius: 20,
    },

    scheduleText: {
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 20,
    },

    scheduleTextBlue: {
        color: '#5C8599',
    },

    scheduleTextGreen: {
        color: '#37C77F',
    },

    scheduleTextRed: {
        color: '#ff3881',
    },

    contactButton: {
        backgroundColor: '#3CDC80',
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        marginTop: 40,
    },

    contactButtonText: {
        fontFamily: 'Nunito_800ExtraBold',
        color: '#FFF',
        fontSize: 16,
        marginLeft: 16,
    },
})
