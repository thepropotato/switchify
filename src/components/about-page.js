import React, { useEffect, useState } from "react";

import Navbar from "./navbar";
import '../component-styles/about-page-styles.css';

function LoadAbout() {

    useEffect(() => {
        document.title = 'About | Switchify';

        let spotify_access_token = localStorage.getItem('spotify_access_token'); 
        if (spotify_access_token) {
            setIsLoggedIn(true);
        }
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <div id="about-container" className="container">
            <Navbar isLoggedIn={isLoggedIn}/>

            <div id="about-content">
                <div id="about-wrapper">
                    <div id="profile"></div>
                    <div id="data">
                        <h1>What is Switchify?</h1>
                        <p>
                            Switchify is an efficient playlist transfer website that copies playlists from Spotify to YouTube Music. 
                            I started this project as an alternative to Tune My Music, which doesn't allow users to transfer more than 200 songs at a time. 
                            Being a huge fan of music, I often switch between audio platforms, and I'm pretty sure most of us do the same. 
                            That's when I decided to create my own playlist transfer application.
                        </p>
                        
                        <h1>Contact Me</h1>
                        <div id="contact">
                            <a name="Github" href="https://github.com/thepropotato"><i className="fa-brands fa-github"></i></a>
                            <a name="Linkedin" href="https://www.linkedin.com/in/venu-pulagam/"><i className="fa-brands fa-linkedin-in"></i></a>
                            <a name="Mail" href="mailto:notvenupulagam@gmail.com"><i className="fa-solid fa-envelope"></i></a>
                            <a name="Instagram" href="https://www.instagram.com/venupulagam/"><i className="fa-brands fa-instagram"></i></a>
                            <a name="Medium" href="https://medium.com/@mosagadu"><i className="fa-brands fa-medium"></i></a>
                            <a name="Mobile" href="tel:+919494121711"><i className="fa-solid fa-phone"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoadAbout;