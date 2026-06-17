import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import roleMiddleware from '../middleware/roleMiddleware.js'
import {
    listAdmins,
    promoteToAdmin,
    demoteAdmin,
    deleteUser,
    listAllUsers,
} from '../controllers/superAdminController.js'
import { validate } from '../middleware/validate.js'
import { promoteAdminRules, uuidParam } from '../validators/hubValidators.js'

const superAdminRouter = express.Router()
const superAdminOnly = [authMiddleware, roleMiddleware('superadmin')]

superAdminRouter.get('/admins', ...superAdminOnly, listAdmins)
superAdminRouter.post('/admins', ...superAdminOnly, promoteAdminRules, validate, promoteToAdmin)
superAdminRouter.put('/admins/:id/demote', ...superAdminOnly, uuidParam('id'), validate, demoteAdmin)
superAdminRouter.delete('/users/:id', ...superAdminOnly, uuidParam('id'), validate, deleteUser)
superAdminRouter.get('/users', ...superAdminOnly, listAllUsers)

export default superAdminRouter
