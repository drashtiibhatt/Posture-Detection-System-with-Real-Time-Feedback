import { useAuth0 } from '@auth0/auth0-react';

export const getAccessTokenSilently = async () => {
  const { getAccessTokenSilently } = useAuth0();
  try {
    const token = await getAccessTokenSilently();
    return token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};
