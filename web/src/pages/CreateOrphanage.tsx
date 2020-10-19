import React, { FormEvent, ChangeEvent, useEffect, useState } from 'react'
import { Map, Marker, TileLayer } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import { useHistory } from 'react-router-dom'
import { FiPlus, FiX } from 'react-icons/fi'

import Sidebar from '../components/Sidebar'
import happyMapIcon from '../utils/mapIcon'
import api from '../services/api'

import '../styles/pages/create-orphanage.css'

interface Location {
    latitude: number
    longitude: number
}

export default function CreateOrphanage() {
    const history = useHistory()

    const [location, setLocation] = useState<Location>({ latitude: 0, longitude: 0 })
    const [position, setPosition] = useState<Location>({ latitude: 0, longitude: 0 })

    const [name, setName] = useState('')
    const [about, setAbout] = useState('')
    const [instructions, setInstructions] = useState('')
    const [openingHours, setOpeningHours] = useState('')
    const [openOnWeekends, setOpenOnWeekends] = useState(true)
    const [images, setImages] = useState<File[]>([])
    const [previewImages, setPreviewImages] = useState<string[]>([])

    useEffect(() => {
        getCurrentLocation()
    }, [])

    function getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(position => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            })
        })
    }

    function handleMapClick(event: LeafletMouseEvent) {
        const { lat, lng } = event.latlng

        setPosition({
            latitude: lat,
            longitude: lng,
        })
    }

    function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return

        const selectedImages = Array.from(event.target.files)

        setImages(selectedImages)

        const selectedImagesPreview = selectedImages.map(image => {
            return URL.createObjectURL(image)
        })

        setPreviewImages(selectedImagesPreview)
    }

    function handleRemoveImage(imageIndexToRemove: number) {
        images.splice(imageIndexToRemove, 1)

        setImages([...images])

        previewImages.splice(imageIndexToRemove, 1)

        setPreviewImages([...previewImages])
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        const { latitude, longitude } = position

        const formData = new FormData()

        formData.append('name', name)
        formData.append('about', about)
        formData.append('latitude', String(latitude))
        formData.append('longitude', String(longitude))
        formData.append('instructions', instructions)
        formData.append('openingHours', openingHours)
        formData.append('openOnWeekends', String(openOnWeekends))

        images.forEach(image => formData.append('images', image))

        await api.post('orphanages', formData)

        alert('Cadastro realizado com sucesso.')

        history.push('/app')
    }

    return (
        <div id='page-create-orphanage'>
            <Sidebar />

            <main>
                <form onSubmit={handleSubmit} className='create-orphanage-form'>
                    <fieldset>
                        <legend>Dados</legend>

                        <Map
                            center={[location.latitude, location.longitude]}
                            style={{ width: '100%', height: 280 }}
                            zoom={15}
                            onclick={handleMapClick}
                        >
                            <TileLayer url='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png' />

                            {position.latitude !== 0 && (
                                <Marker interactive={false} icon={happyMapIcon} position={[position.latitude, position.longitude]} />
                            )}
                        </Map>

                        <div className='input-block'>
                            <label htmlFor='name'>Nome</label>
                            <input id='name' value={name} onChange={event => setName(event.target.value)} />
                        </div>

                        <div className='input-block'>
                            <label htmlFor='about'>
                                Sobre <span>Máximo de 300 caracteres</span>
                            </label>
                            <textarea id='name' maxLength={300} value={about} onChange={event => setAbout(event.target.value)} />
                        </div>

                        <div className='input-block'>
                            <label htmlFor='images'>Fotos</label>

                            <div className='images-container'>
                                {previewImages.map((image, index) => (
                                    <div key={image} className='image-container'>
                                        <img src={image} alt={name} />
                                        <div className='remove-image' onClick={() => handleRemoveImage(index)}>
                                            <FiX size={24} color='#FF669D' />
                                        </div>
                                    </div>
                                ))}

                                <label className='new-image' htmlFor='image[]'>
                                    <FiPlus size={24} color='#15b6d6' />
                                </label>
                            </div>

                            <input multiple onChange={handleSelectImages} type='file' id='image[]' />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Visitação</legend>

                        <div className='input-block'>
                            <label htmlFor='instructions'>Instruções</label>
                            <textarea id='instructions' value={instructions} onChange={event => setInstructions(event.target.value)} />
                        </div>

                        <div className='input-block'>
                            <label htmlFor='opening_hours'>Horário de funcionamento</label>
                            <input id='opening_hours' value={openingHours} onChange={event => setOpeningHours(event.target.value)} />
                        </div>

                        <div className='input-block'>
                            <label htmlFor='open_on_weekends'>Atende fim de semana</label>

                            <div className='button-select'>
                                <button type='button' className={openOnWeekends ? 'active' : ''} onClick={() => setOpenOnWeekends(true)}>
                                    Sim
                                </button>
                                <button type='button' className={!openOnWeekends ? 'active' : ''} onClick={() => setOpenOnWeekends(false)}>
                                    Não
                                </button>
                            </div>
                        </div>
                    </fieldset>

                    <button className='confirm-button' type='submit'>
                        Confirmar
                    </button>
                </form>
            </main>
        </div>
    )
}
