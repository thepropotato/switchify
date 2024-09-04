import { useGoogleLogin } from '@react-oauth/google';
import { gapi } from 'gapi-script';

const CLIENT_ID = '209050893524-7rit5bugn83lvi8n7a8jr0eqeshekuq4.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/youtube';

const GoogleAuth = ({ onAuthSuccess }) => {
    const login = useGoogleLogin({
        onSuccess: (response) => {
            const token = response.access_token;
            localStorage.setItem('google_access_token', token);

            gapi.load('client:auth2', () => {
                gapi.client.init({
                    apiKey: 'AIzaSyCovq12i3KeT99PqILWDlH4MdDa_50SLO0',
                    clientId: CLIENT_ID,
                    discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
                    scope: SCOPES,
                }).then(() => {
                    onAuthSuccess();
                }).catch(error => {
                    console.error('gapi Initialization Error:', error);
                });
            });
        },
        onError: (error) => {
            console.error('Login Error:', error);
        },
        scope: SCOPES,
    });

    return { login };
};

export default GoogleAuth;