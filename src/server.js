if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
    console.log(process.env.data)

    const express = require('express')
    const GNRequest = require('./apis/gerencianet')
    const bodyParser = require('body-parser')

    const app = express()
    app.use(bodyParser.json())

    app.set('view engine', 'ejs')
    app.set('views', 'src/views')

    const reqGNAlready = GNRequest({
        clientId: process.env.GM_CLIENT_ID,
        clientSecret: process.env.GM_CLIENT_SECRET,
    });

    app.get('/', async (req, res) => {
        const reqGN = await reqGNAlready;
        
        const dataCob = {
            calendario: {
                expiracao: 3600
            },
            valor: {
                original: "1.00"
            },
            chave: "bedd1da0-9a4e-4eef-9ff5-bb5a8461f3da",
            solicitacaoPagador: "Informe o número ou identificador do pedido."
        }

        const cobResponse = await reqGN.post('/v2/cob', dataCob)
        const qrcodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`)

        res.render('qrcode', {
            qrImage: qrcodeResponse.data.imagemQrcode,
        })
    })
    
    app.get('/cobrancas', async (req, res) => {
        const reqGN = await reqGNAlready;
        
        const cobResponse = await reqGN.get('/v2/cob?inicio=2024-01-08T01:01:35Z&fim=2024-01-08T23:59:35Z',);
        res.send(cobResponse.data)
    })

    app.post('/pixnotify(/pix)?', (req, res) => {
        console.log(req.body)
        res.send('200')
    })
    
    app.listen(8000, () => {
        console.log('Server running on port 8000')
    })