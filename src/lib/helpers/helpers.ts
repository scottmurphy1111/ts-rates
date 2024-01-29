const { MODE } = import.meta.env;
const LOCAL_URL = 'http://localhost:5173';
const PROD_URL = 'https://rates.trucksuite.com';

export const appHost = MODE === 'development' ? LOCAL_URL : PROD_URL;
