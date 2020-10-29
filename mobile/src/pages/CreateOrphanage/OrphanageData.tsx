import React, { useState } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { RectButton, ScrollView, Switch, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'

import api from '../../services/api'

interface RouteParams {
    latitude: number
    longitude: number
}

export default function CreateOrphanage() {
    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [instructions, setInstructions] = useState('')
    const [openingHours, setOpeningHours] = useState('')
    const [openOnWeekends, setOpenOnWeekends] = useState(true)
    const [images, setImages] = useState<string[]>([])

    const navigation = useNavigation()
    const route = useRoute()
    const position = route.params as RouteParams

    async function handleSelectImages() {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync()

        if (status !== 'granted') {
            alert('Por favor, permita o acesso à sua galeria de fotos para carregar imagens')
            return false
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        })

        if (result.cancelled) {
            return false
        }

        const { uri } = result

        setImages([...images, uri])
    }

    async function handleCreateOrphanage() {
        const formData = new FormData()

        formData.append('name', name)
        formData.append('about', about)
        formData.append('latitude', String(position.latitude))
        formData.append('longitude', String(position.longitude))
        formData.append('instructions', instructions)
        formData.append('openingHours', openingHours)
        formData.append('openOnWeekends', String(openOnWeekends))

        images.forEach(image =>
            formData.append('images', {
                type: 'image/jpg',
                uri: image,
                name: image,
            } as any)
        )

        api.post('orphanages', formData)
            .then(response => {
                alert('Cadastro realizado com sucesso.')

                navigation.navigate('OrphanagesMap')
            })
            .catch(err => console.log(err))
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
            <Text style={styles.title}> Dados </Text>

            <Text style={styles.label}> Nome </Text>
            <TextInput style={styles.input} value={name} onChangeText={text => setName(text)} />

            <Text style={styles.label}> Sobre </Text>
            <TextInput style={[styles.input, { height: 110 }]} multiline value={about} onChangeText={text => setAbout(text)} />

            {/* <Text style={styles.label}> WhatsApp </Text>
            <TextInput style={styles.input} /> */}

            <Text style={styles.label}> Fotos </Text>

            {images && (
                <View style={styles.uploadedImagesContainer}>
                    {images.map(image => (
                        <Image key={image} source={{ uri: image }} style={styles.uploadedImage} />
                    ))}
                </View>
            )}

            <TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
                <Feather name='plus' size={24} color='#15B6D6' />
            </TouchableOpacity>

            <Text style={styles.title}> Visitação </Text>

            <Text style={styles.label}> Instruções </Text>
            <TextInput style={[styles.input, { height: 110 }]} multiline value={instructions} onChangeText={text => setInstructions(text)} />

            <Text style={styles.label}> Horário de visitas </Text>
            <TextInput style={styles.input} value={openingHours} onChangeText={text => setOpeningHours(text)} />

            <View style={styles.switchContainer}>
                <Text style={styles.label}> Atende aos finais de semana? </Text>

                <Switch
                    thumbColor='#FFF'
                    trackColor={{ false: '#CCC', true: '#39CC85' }}
                    value={openOnWeekends}
                    onValueChange={booleano => setOpenOnWeekends(booleano)}
                />
            </View>

            <RectButton style={styles.nextButton} onPress={handleCreateOrphanage}>
                <Text style={styles.nextButtonText}> Cadastrar </Text>
            </RectButton>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    title: {
        color: '#5C8599',
        fontSize: 24,
        fontFamily: 'Nunito_700Bold',
        marginBottom: 32,
        paddingBottom: 24,
        borderBottomWidth: 0.8,
        borderBottomColor: '#D3E2E6',
    },

    label: {
        color: '#8FA7B3',
        fontFamily: 'Nunito_600SemiBold',
        marginBottom: 8,
    },

    comment: {
        fontSize: 11,
        color: '#8FA7B3',
    },

    input: {
        backgroundColor: '#FFF',
        borderWidth: 1.4,
        borderColor: '#D3E2E6',
        borderRadius: 20,
        height: 56,
        paddingVertical: 18,
        paddingHorizontal: 24,
        marginBottom: 16,
        textAlignVertical: 'top',
    },

    uploadedImagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    uploadedImage: {
        width: 64,
        height: 64,
        borderRadius: 20,
        marginBottom: 32,
        marginRight: 8,
    },

    imagesInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderStyle: 'dashed',
        borderColor: '#96D2F0',
        borderWidth: 1.4,
        borderRadius: 20,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },

    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
    },

    nextButton: {
        backgroundColor: '#15C3D6',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        height: 52,
        marginTop: 32,
    },

    nextButtonText: {
        fontFamily: 'Nunito_800ExtraBold',
        fontSize: 16,
        color: '#FFF',
    },
})
