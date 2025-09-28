const Category = require('../../models/Category');
const logger = require('../../utils/logger');

const createCategory = async (category) => {
    try {
        const existingCategory = await Category.findOne({ name: category.name });
        if (existingCategory) {
            logger.info(`[createCategory] Category already exists: ${JSON.stringify(existingCategory, null, 2)}`);
            return {
                status:409,
                message: 'Category already exists',
                category: existingCategory
            };
        }
        const newCategory = await Category.create(category);
        logger.info(`[createCategory] Category created successfully: ${JSON.stringify(newCategory, null, 2)}`);
        await newCategory.save();
        return {
            status:201,
            message: 'Category created successfully',
            category: newCategory
        };
    } catch (error) {
        logger.error(`[createCategory] Error creating category: ${error.message}`);
        return {
            status:400,
            message: 'Error creating category',
            error: error.message    
        }
    }
};

const getCategories = async () => {
    try {
        const categories = await Category.find({}).lean();
        logger.info(`[getCategories] Categories fetched successfully: ${JSON.stringify(categories, null, 2)}`);
        return {
            status:200,
            message: 'Categories fetched successfully',
            categories
        };
    } catch (error) {
        logger.error(`[getCategories] Error fetching categories: ${error.message}`);
        return {
            status:400,
            message: 'Error fetching categories',
            error: error.message    
        }
    }
};

const getCategory = async (id) => {
    try {
        const category = await Category.findById(id);
        logger.info(`[getCategory] Category fetched successfully: ${JSON.stringify(category, null, 2)}`);
        return {
            status:200,
            message: 'Category fetched successfully',
            category
        };
    } catch (error) {
        logger.error(`[getCategory] Error fetching category: ${error.message}`);
        return {
            status:400,
            message: 'Error fetching category',
            error: error.message    
        }
    }
};

const deleteCategory = async (id)=>{
    try {
        const category = await Category.findByIdAndUpdate(id,{isDeleted:true});
        logger.info('[DELETE CATEGORY]: Category delete successfully')
        return{
            status:204,
            message:'Category Deleted successfully'
        }
    } catch (error) {
        logger.info('[DELETE CATEGORY]: ',error.message)
        return {
            status:400,
            message:'Somthing went wrong',
            error:error.message
        }
    }
}



module.exports ={
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
}