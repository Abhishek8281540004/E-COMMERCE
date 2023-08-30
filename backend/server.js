import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js'
import cors from 'cors'
import ProductsRoutes from './routes/ProductRoutes.js'

//configure env
dotenv.config()

//database config
connectDB()

//rest object
const app = express()

//middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())


//routes
app.use('/api/v1/auth', authRoutes)
app.use("/api/v1/category", categoryRoutes)
app.use("/api/v1/product", ProductsRoutes)

//rest api
app.get('/',(req, res)=>{
    res.send({
        message:"welcome to ecommerce website"
    })
})

const PORT = process.env.PORT || 8080

//run listen
app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`.bgCyan.white)
})