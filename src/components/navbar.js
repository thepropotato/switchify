import React from 'react';
import { Link } from 'react-router-dom';
import '../component-styles/navbar-styles.css';

function Navbar({ isLoggedIn }) {
    return (
        <header>
            <Link to="/home">
                <button id='logo'><h2>S2Y</h2></button>
            </Link>
            
            <nav>
                <Link to="/home">
                    <button className='navigation'>Home</button>
                </Link>

                { isLoggedIn && (
                    <Link to="/playlists">
                        <button className='navigation'>Playlists</button>
                    </Link>
                )}
                
                <Link to="/about">
                    <button className='navigation'>About</button>
                </Link>
            </nav>
        </header>
    );
}

export default Navbar;