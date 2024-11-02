import express from 'express'
import { addUser, getUser, getUsers, removeUser, updateUser } from './user.controller.js'
import { requireAuth } from '../../middlewares/require-auth.middleware.js'

const router = express.Router()

router.get('/', getUsers )
router.get('/:userId', getUser )
router.put('/:userId', requireAuth, updateUser )
router.post('/', addUser )
router.delete('/:userId', requireAuth, removeUser )

export const userRoutes = router