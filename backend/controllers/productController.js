import slugify from "slugify"
import productModel from "../models/productModel.js"
import fs from 'fs'


export const createProductController = async (req, res) => {
    try {
        const {name,slug,description,price,category,quantity,shiping} = req.fields
        const {photo} = req.files

        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is required'})
             case !description:
                return res.status(500).send({error:'Description is required'})
            case !price:
                return res.status(500).send({error:'Price is required'})
            case !category:
                return res.status(500).send({error:'Category is required'})
            case !quantity:
                return res.status(500).send({error:'Quantity is required'})
            case photo && photo.size > 1000000:
                return res.status(500).send({error:'photo is required and sholud be less than 1 mb'})
        }
        const products = new productModel({...req.fields, slug:slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success:true,
            message:'Product created successfully',
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in creating products"
        })
    }
}

//get all products  

export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate('category').select('-photo').limit(12).sort({createdAt:-1})
        res.status(200).send({
        totalcount :products.length,
        success:true,
        message:'All Products',
        products,
        
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error:error.message,
            message:"Error in getting products"
        })
    }
}

//get single product

export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category")
        res.status(200).send({
            success:true,
            message:'Single producted fetched',
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in getting single product"
        })
    }
}



//get product photo

export const productPhotoController = async (req, res) => {
    
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('content-Type', product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in getting product photos"
        })
    }
}


//delete product
export const deleteProductController = async(req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success:true,
            message:'Product deleted successfully'
        })
        
    } catch (error) {
        res.status(500).send({
            success:false,
            error,
            message:"Error while deleting product"
        })
    }
}

//update product
 export const updateProductController = async (req, res) => {
    try {
        const {name,description,price,category,quantity,shiping} = req.fields
        const {photo} = req.files

        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is required'})
            case !description:
                return res.status(500).send({error:'Description is required'})
            case !price:
                return res.status(500).send({error:'Price is required'})
            case !category:
                return res.status(500).send({error:'Category is required'})
            case !quantity:
                return res.status(500).send({error:'Quantity is required'})
            case photo && photo.size > 1000000:
                return res.status(500).send({error:'photo is required and sholud be less than 1 mb'})
        }
        const products = await productModel.findByIdAndUpdate(req.params.pid,
            {...req.fields, slug:slugify(name)},{new:true} 
            )
        if(photo){
            products.photo = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success:true,
            message:'Product updated successfully',
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in updating products"
        })
    }
 }

 //product filter
 export const  productFilterControllerr = async (req, res) =>{
    try {
        const {checked, radio} = req.body
        let args = {}
        if(checked.length > 0) args.category = checked
        if(radio.length)args.price = {$gte: radio[0], $lte:radio[1]}
        const products =await productModel.find(args)
        res.status(200).send({
            success:true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            error,
            message:"Error while filtering products"
        })
    }
 }
 
 export const productFilterController = async (req, res) => {
    try {
      const { checked, radio } = req.body;
      let args = {};
  
      if (checked.length > 0) {
        args.category = checked;
      }
  
      if (radio && radio.length === 2) {
        args.price = { $gte: radio[0], $lte: radio[1] };
      }
  
      const products = await productModel.find(args);
  
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        error,
        message: "Error while filtering products",
      });
    }
  };

  //product count
  export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        res.status(200).send({
        success:true,
        total
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            message:'Error in product count',
            error,
            success:false
        })
    }
  }

  //search product
  export const searchProductController = async (req, res) => {
    try {
        const {keyword} = req.params
        const result = await productModel.find({
            $or:[
                {name:{$regex: keyword, $options:"i"}},
                {description:{$regex: keyword, $options:"i"}}
            ]
            
        }).select("-photo")
        res.json(result)
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message:'Error in search product api',
            error,
            success:false
        })
    }
  }

 