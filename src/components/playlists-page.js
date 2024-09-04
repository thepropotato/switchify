import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from "./navbar";
import '../component-styles/playlists-page-styles.css';
import GoogleAuth from '../helpers/google-login';

const CLIENT_ID = '65a197f6ba884f0790e228aa5735a521';
const REDIRECT_URI = 'http://localhost:3000/playlists';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

function next(playlists, currentIndex, setCurrentIndex) {
    const newIndex = (currentIndex + 1) % playlists.length;
    setCurrentIndex(newIndex);
}

function previous(playlists, currentIndex, setCurrentIndex) {
    const newIndex = (currentIndex - 1 + playlists.length) % playlists.length;
    setCurrentIndex(newIndex);
}

function LoadPlaylists() {

    useEffect(() => {
        document.title = 'Playlists | Switchify';
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate(); 

    const { login } = GoogleAuth({ onAuthSuccess: () => {
        setIsAuthenticated(true);
        handleConvert();
    }});

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        let spotify_access_token = localStorage.getItem('spotify_access_token'); 

        if (spotify_access_token) {
            (async () => {
                const playlistsResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
                    headers: {
                        Authorization: `Bearer ${spotify_access_token}`
                    }
                });

                setIsLoggedIn(true);
                setPlaylists(playlistsResponse.data.items);
            })();
        }

        if (code) {
            (async () => {
                const tokenResponse = await axios.post(TOKEN_URL, new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: REDIRECT_URI,
                    client_id: CLIENT_ID,
                    client_secret: '9d77bd4cf9ac4de69d58a603d967c685'
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                const accessToken = tokenResponse.data.access_token;
                window.localStorage.setItem('spotify_access_token', accessToken);

                const playlistsResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                setIsLoggedIn(true);
                setPlaylists(playlistsResponse.data.items);
                
            })();
        }
    }, []);

    const handleConvert = () => {
        const selectedPlaylist = playlists[currentIndex];
        if (selectedPlaylist) {
            navigate('/songs', { state: { playlist: selectedPlaylist } });
        }
    };

    return (
        <div id="playlists-container" className="container">
            <Navbar isLoggedIn={isLoggedIn}/>

            <div id="playlists-wrapper">
                <div id="playlist-module">
                    <h2>Now converting</h2>
                    <select id="playlists" value={playlists[currentIndex]?.id || ''} onChange={e => setCurrentIndex(playlists.findIndex(pl => pl.id === e.target.value))}>
                        {playlists.map((playlist, index) => (
                            <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                        ))}
                    </select>

                    <div id="button-row">
                        <button onClick={() => previous(playlists, currentIndex, setCurrentIndex)} className="material-symbols-outlined">skip_previous</button>
                        <button onClick={login}>Convert</button>
                        <button onClick={() => next(playlists, currentIndex, setCurrentIndex)} className="material-symbols-outlined">skip_next</button>
                    </div>

                    <p>Choose a playlist to convert to Youtube music. The playlist in the title will be selected. Use the nav buttons (Previous, Next) or choose from the dropdown.</p>
                </div>
            </div>
        </div>
    );
}

export default LoadPlaylists;