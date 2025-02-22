const axios = require('axios');

async function getPublicIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Error fetching IP:', error);
        return 'Could not fetch IP';
    }
}

module.exports = getPublicIP;