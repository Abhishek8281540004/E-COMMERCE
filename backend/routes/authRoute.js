import express from 'express'
import {forgotPasswordController, logincontroller, registerController, testController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../midillewares/authMiddleware.js'

//router object
const router = express.Router()

//routing
//Register
router.post('/register', registerController)

//LOGIN
router.post('/login', logincontroller)

//forgot password
router.post('/forgot-password', forgotPasswordController)

//test route
router.get('/test', requireSignIn ,isAdmin,testController)

//protected user route
router.get('/user-auth', requireSignIn, (req, res) =>{
    res.status(200).send({ok:true})
})

//protected admin route
router.get('/admin-auth', requireSignIn,isAdmin, (req, res) =>{
    res.status(200).send({ok:true})
})


export default router