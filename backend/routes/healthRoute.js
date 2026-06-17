import express from 'express'
import supabase from '../config/supabaseClient.js'

const healthRouter = express.Router()

healthRouter.get('/', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
    })
})

healthRouter.get('/db', async (_req, res) => {
    try {
        const { error } = await supabase.from('users').select('id').limit(1)
        if (error) throw error
        res.json({ status: 'ok', database: 'connected' })
    } catch (error) {
        res.status(503).json({ status: 'error', database: 'disconnected', message: error.message })
    }
})

export default healthRouter
