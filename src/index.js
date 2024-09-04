import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import LoadHome from './components/home-page';
import LoadAbout from './components/about-page';
import LoadPlaylists from './components/playlists-page';
import LoadSongs from './components/songs-page';

import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const root = ReactDOM.createRoot(document.getElementById('root'));

const routes = createBrowserRouter([
  { 
    path: '/',
    element: <LoadHome   />
  },
  { 
    path: '/home',
    element: <LoadHome />
  },
  {
    path: '/about',
    element: <LoadAbout />
  },
  {
    path: '/playlists',
    element: 
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <LoadPlaylists />
    </GoogleOAuthProvider>
  },
  {
    path: '/songs',
    element: <LoadSongs />
  }
])

root.render(
  <RouterProvider router={routes} />
);


reportWebVitals();
