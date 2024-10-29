import express from 'express'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import { bugService } from './api/bug/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()


//TODO add labels (also to filter)

const coreOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://localhost:5173'
    ],
    credentials: true
}
app.use (express.static( 'public' ))
app.use (express.json())
app.use( cookieParser())
app.use( cors ( coreOptions ))

import {bugRoutes} from './api/bug/bug.routes.js'
app.use('/api/bug', bugRoutes )

import {userRoutes} from './api/user/user.routes.js'
app.use('/api/user', userRoutes )

import {authRoutes} from './api/auth/auth.routes.js'
app.use('/api/auth', authRoutes )

const port = process.env.PORT || 3000;

app.get('/**', (req, res) => {
    res.sendFile( path.resolve('public/index.html'))
})

app.listen(port, () => {
	loggerService.info(`Example app listening on port ${port}`)
})
