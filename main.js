import express from 'express'
import tweet from './workflows/tweet.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { relay } from '@relaypro/sdk'
import EventEmitter from 'events'
import axios from 'axios'
import qs from 'qs'
export const eventEmitter = new EventEmitter() 

/*
* Express server config
*/
const port = process.env.PORT || 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const _server = express()
_server.set('view engine', 'ejs')
_server.use(express.urlencoded({extended: true}))
_server.use(express.json())

_server.post('/searchsheets', function(req, res) {
    console.log(req.body)
    let order = req.body.body
    eventEmitter.emit(`searchrequest`, order)
    res.sendStatus(200)
})

// Create an HTTP server and listen for requests on port 3000
const server = _server.listen(port, function() {
    console.log("Web server listening on port: " + port)
})

const app = relay({server})
app.workflow(`tweet`, tweet)

_server.post('/new', async(req, res) => {
    let name = req.body.name
    let email = req.body.email
    let relay_label = req.body.relay_label
    let pd_id = req.body.pd_id
    let pd_api_token = req.body.pd_api_token
    const user = new UserDB({
        pd_id: pd_id,
        relay_label: relay_label,
        name: name,
        email: email,
        pd_api_token: pd_api_token
    })

    user.save(function(err){
        if (!err){
            res.sendFile(path.join(__dirname, '/views/recieved.html'))
        } else {
            console.log(err)
        }
    })

})