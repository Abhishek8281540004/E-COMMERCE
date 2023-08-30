import CategoryModel from "../models/CategoryModel.js"
import slugify from "slugify"

export const createCategoryController =async (req, res) => {
    try {
        const {name} = req.body
        if(!name){
            return res.status(401).send({message:'Name is required'})

        }
        const existingCategory = await CategoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                message:'Category Already Exists'
            })
        }
        const categoery = await new CategoryModel({name,slug:slugify(name)}).save()
        res.status(201).send({
            success:true,
            message:'new category created',
            categoery
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in category"
        })
        
    }

}

//update categort
export const updateCategoryController = async(req, res) => {
    try {
        const {name} = req.body
        const {id} = req.params
        const category = await CategoryModel.findByIdAndUpdate(id,{name, slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:'Category Updated Successfully',
            category
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while updating category'
        })
    }
    
}

//get all category

export const categoryController =async (req, res) => {
    try {
        const category = await CategoryModel.find({})
        res.status(200).send({
            success:true,
            message:"All categories List",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error while getting all categories"
        })
        
    }

}

//single category

export const singleCategoryController = async(req, res) => {
    try {
       
        const category = await CategoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:'Get single category successfully',
            category
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while getting single category'
        })
    }


}

//delete category

export const deleteCategoryController = async (req, res) => {
    try {
        const {id} =req.params
        await CategoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:'category Deleted  successfully',
            
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error while deleting single category'
        })
    }

} 