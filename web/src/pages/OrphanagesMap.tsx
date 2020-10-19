import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import api from '../services/api';
import mapMarkerImg from '../images/map-marker.svg';
import happyMapIcon from '../utils/mapIcon';

import '../styles/pages/orphanages-map.css';

interface Location {
    latitude: number;
    longitude: number;
}

interface Orphanage {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
}

export default function OrphanagesMap() {
    const [location, setLocation] = useState<Location>({
        latitude: 0,
        longitude: 0,
    });

    const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

    useEffect(() => {
        getCurrentLocation();

        api.get('orphanages').then(response => {
            setOrphanages(response.data);
        });
    }, []);

    function getCurrentLocation() {
        navigator.geolocation.getCurrentPosition(position => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        });
    }

    return (
        <div id='page-map'>
            <aside>
                <header>
                    <img src={mapMarkerImg} alt='Heppy' />

                    <h2> Escolha um orfanato no mapa</h2>
                    <p> Muitas crianças estão esperando sua visita :)</p>
                </header>

                <footer>
                    <strong> Porto Alegre </strong>
                    <span> Rio Grande do Sul </span>
                </footer>
            </aside>

            <Map center={[location?.latitude, location?.longitude]} zoom={15} style={{ width: '100%', height: '100%' }}>
                <TileLayer url='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png' />

                {orphanages.map(orphanage => {
                    return (
                        <Marker key={orphanage.id} position={[orphanage.latitude, orphanage.longitude]} icon={happyMapIcon}>
                            <Popup closeButton={false} minWidth={240} maxWidth={240} className='map-popup'>
                                {orphanage.name}
                                <Link to={`/orphanages/${orphanage.id}`}>
                                    <FiArrowRight size={20} color='#FFF' />
                                </Link>
                            </Popup>
                        </Marker>
                    );
                })}
            </Map>

            <Link to='/orphanages/create' className='create-orphanage'>
                <FiPlus size={32} color='#FFF' />
            </Link>
        </div>
    );
}
