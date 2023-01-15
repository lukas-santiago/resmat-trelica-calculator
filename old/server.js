import express from "express"

import path from 'path'
import open from 'open'

import livereload from "livereload"
import connectLivereload from "connect-livereload"

const liveReloadServer = livereload.createServer()
liveReloadServer.watch(path.join(path.resolve(), 'public'))
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/")
    }, 100)
})

var app = express()

app.use(connectLivereload({
    port: 35729
}))
app.use(express.static('public'))
app.listen(5555)

open('http://localhost:5555/pages/login')