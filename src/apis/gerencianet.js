const axios = require('axios')
const fs = require('fs')
const path = require('path')
const https = require('https')

const cert = fs.readFileSync(path.resolve(__dirname, `../../certs/${process.env.GM_CERT}`))

const agent = new https.Agent({
    pfx: cert,
    passphrase: ''
})


const authenticate = ({clientId, clientSecret}) => {
    const credentials = Buffer.from (
        `${clientId}:${clientSecret}`).toString('base64')

    console.log('HEllo')

    return axios({
        method: 'POST',
        url: `${process.env.GM_ENDPOINT}/oauth/token`,
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/json'
        },
        httpsAgent: agent,
        data: {
            grant_type: 'client_credentials',
        }
    });
}
const GNRequest = async (credentials) => {
    const authResponse = await authenticate(credentials);
    const accessToken = authResponse.data?.access_token

    return axios.create({
        baseURL: process.env.GM_ENDPOINT,
        httpsAgent: agent,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
}

module.exports = GNRequest;