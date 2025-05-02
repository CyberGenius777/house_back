import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import profileRouter from './controllers/profileController'
import router from './routes/auth.routes'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', router)
app.use('/user', profileRouter) // например, профиль доступен по /user/profile

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
