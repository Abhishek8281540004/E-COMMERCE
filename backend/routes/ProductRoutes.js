import express from 'express'
import { isAdmin, requireSignIn } from '../midillewares/authMiddleware.js'
import { createProductController, deleteProductController, getProductController, getSingleProductController,  productCountController,  productFilterController,   productPhotoController, searchProductController, updateProductController } from '../controllers/productController.js'
import formidable from 'express-formidable' //this package is used for uploading photo

import multer from 'multer';

const router = express.Router()
const upload = multer({ dest: 'uploads/' });
//routes
router.post('/create-product', requireSignIn, isAdmin, formidable(),createProductController)

//get products

router.get('/get-product', getProductController)

//get single product

router.get('/get-product/:slug', getSingleProductController) //slug of product

//get photo

router.get('/product-photo/:pid', productPhotoController)

//delete product
router.delete('/delete-product/:pid', deleteProductController)

//update routes
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

//filter product
router.post('/product-filters', productFilterController)

//product count
router.get('/product-count', productCountController)

//search product
router.get('/search/:keyword',searchProductController)



export default router