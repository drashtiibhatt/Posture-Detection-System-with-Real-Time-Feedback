import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain="YOUR_AUTH0_DOMAIN" // TODO: Replace with your Auth0 domain
      clientId="YOUR_AUTH0_CLIENT_ID" // TODO: Replace with your Auth0 clientId
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'YOUR_AUTH0_AUDIENCE', // TODO: Replace with your Auth0 audience
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

