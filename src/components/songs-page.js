import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import '../component-styles/songs-page-styles.css';
import Navbar from './navbar';

function closePopup() {
    document.getElementById('pct-wrapper').style.display = 'none';
}

function LoadSongs() {

    useEffect(() => {
        document.title = 'Transfer | Switchify';
    }, []);

    const location = useLocation();
    const { playlist } = location.state || {};
    const [tracks, setTracks] = useState([]);
    const [conversionLogs, setConversionLogs] = useState([]);
    const [progress, setProgress] = useState(0);
    const [succeeded, setSucceeded] = useState(0);
    const [currentSong, setCurrentSong] = useState(0);

    useEffect(() => {
        document.title = 'About | Switchify';

        let spotify_access_token = localStorage.getItem('spotify_access_token'); 
        if (spotify_access_token) {
            setIsLoggedIn(true);
        }
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchTracks = async () => {
            if (playlist) {
                try {
                    const accessToken = window.localStorage.getItem('spotify_access_token');
                    const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setTracks(response.data.items);
                } catch (error) {
                    console.error('Error fetching tracks:', error.response?.data || error.message);
                }
            }
        };

        fetchTracks();
    }, [playlist]);

    const copyPlaylistToYouTubeMusic = async () => {
        document.getElementById('start-conversion').style.display = 'none';
        document.getElementById('conversion-status').style.display = 'flex';
        document.getElementById('pre-conversion-text').style.display = 'none';

        const accessToken = window.localStorage.getItem('google_access_token');
        const songTitles = tracks.map(item => ({
            title: item.track.name,
            album: item.track.album.name,
            artist: item.track.artists.map(artist => artist.name).join(', ')
        }));

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        try {
            const createPlaylistResponse = await axios.post(
                `https://www.googleapis.com/youtube/v3/playlists?part=snippet,status`,
                {
                    snippet: {
                        title: `${playlist.name}`,
                        description: 'Copied by Switchify',
                        tags: ['music'],
                        defaultLanguage: 'en'
                    },
                    status: {
                        privacyStatus: 'private'
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const newPlaylistId = createPlaylistResponse.data.id;
            setConversionLogs(prevLogs => [...prevLogs, `Created new playlist: ${playlist.name} Copy on YouTube Music`]);

            for (let i = 0; i < songTitles.length; i++) {
                const { title, album, artist } = songTitles[i];
                let searchString = `${title} from ${album}, by ${artist} audio`;
                let searchResponse;

                try {
                    // Single search attempt with title, album, and artist
                    searchResponse = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        },
                        params: {
                            part: 'snippet',
                            maxResults: 1,
                            q: searchString,
                            type: 'video'
                        }
                    });

                    if (searchResponse.data.items.length > 0) {
                        const videoId = searchResponse.data.items[0].id.videoId;

                        await axios.post(
                            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet`,
                            {
                                snippet: {
                                    playlistId: newPlaylistId,
                                    resourceId: {
                                        kind: 'youtube#video',
                                        videoId: videoId
                                    }
                                }
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );
                        setConversionLogs(prevLogs => [...prevLogs, `Added ${title} to YouTube Music playlist`]);

                        // Use the functional form of setSucceeded
                        setSucceeded(prevSucceeded => prevSucceeded + 1);
                    } else {
                        setConversionLogs(prevLogs => [...prevLogs, `Didn't find a matching song. Skipping ${title}`]);
                    }
                } catch (searchError) {
                    setConversionLogs(prevLogs => [...prevLogs, `Error during search for ${title}. Skipping...`]);
                    console.error('Error during search:', searchError.response?.data || searchError.message);
                }

                setProgress(((i + 1) / songTitles.length) * 100);
                setCurrentSong(i + 1);

                // Add a small delay between each request
                await delay(500); // 500ms delay between requests
            }

            setConversionLogs(prevLogs => [...prevLogs, 'Playlist copy to YouTube Music complete!']);
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || error.message;
            const errorCode = error.response?.status;

            if (errorCode === 403 && errorMessage.includes('quota')) {
                setConversionLogs(prevLogs => [...prevLogs, { message: 'Error: Quota limit exceeded...', isSpecial: true }]);
            } else {
                setConversionLogs(prevLogs => [...prevLogs, { message: `Error copying playlist to YouTube Music: ${errorMessage}. Please try again.`, isSpecial: false }]);
            }

            console.error('Error copying playlist:', errorMessage);
        }
    };

    return (
        <div id="songs-container" className='container'>
            <Navbar isLoggedIn={isLoggedIn} />

            <div id='wrapper'>
                <div id='songs-from'>
                    <h2>Songs in <span id='playlist-name'>{playlist?.name}</span></h2>

                    <div id='songs-wrapper' className='sub-wrappers'>
                        {tracks.map((item, index) => (
                            <p key={index} className='song-tile'>
                                {item.track.name} from {item.track.album.name}, by {item.track.artists.map(artist => artist.name).join(', ')}
                            </p>
                        ))}
                    </div>

                    <button id='start-conversion' onClick={copyPlaylistToYouTubeMusic}>Start Conversion</button>
                    <p id='conversion-status'>{currentSong}/{tracks.length} completed</p>
                </div>

                <progress className='progress-bar' max="100" value={progress}></progress>

                <div id='songs-to'>
                    <h2>Conversion Logs<i class="fa-solid fa-circle-info"></i></h2>

                    <div id='converted-songs-wrapper' className='sub-wrappers'>
                        <p id='pre-conversion-text'>Your conversion logs will be shown here.</p>
                        {conversionLogs.map((log, index) => (
                            <p key={index} className={typeof log === 'object' && log.isSpecial ? 'special-log' : ''}>
                                {typeof log === 'object' ? log.message : log}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {progress === 100 && (
                <div id='pct-wrapper'>
                    <div id='post-conversion-text'>
                        <p>Your conversion has been completed, {succeeded} of {tracks.length} songs added to the playlist. You can now find your new playlist on YouTube Music.</p>
                        <button id='okay' onClick={closePopup}>Okay</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoadSongs;