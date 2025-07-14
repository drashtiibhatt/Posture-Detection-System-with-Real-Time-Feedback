import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-rj7mvx3uhfv1dlj0.us.auth0.com"
      clientId="W92hGMIE1W4uSWzNOUUJaJJFKRiR1MEG"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://posturedetectionapi', // 👈 IMPORTANT ADD THIS
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

