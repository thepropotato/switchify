import React from 'react';
import { useEffect } from 'react';

import '../component-styles/home-page-styles.css'
import Navbar from './navbar';

function authenticate () {
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const REDIRECT_URI = 'https://switchifytm.vercel.app/playlists';
    const AUTH_URL = 'https://accounts.spotify.com/authorize';
    const SCOPES = 'user-read-private user-read-email playlist-read-private';

    const authUrl = `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = authUrl;
}

function LoadHome() {

    useEffect(() => {
        document.title = 'Switchify'
    }, []);

    return (
        <div id='home-container' className='container'>
            <Navbar />

            <div id='circle1'></div>
            <div id='circle2'></div>

            <div id='content'>
                <h1><span>S</span>witchif<span>y</span></h1>

                <div>
                    <p>Because, Spotify has lost its groove and is now playing a tuneless melody !</p>

                    <p>
                        Use Switchify to copy your playlist from Spotify to Youtube Music.
                        And start grooving again. (Ps : Youtube has almost all tracks)
                    </p>
                </div>

                <button onClick={authenticate} id='switch'>Switch to Youtube Music</button>
            </div>
        </div>
    );

}

export default LoadHome;