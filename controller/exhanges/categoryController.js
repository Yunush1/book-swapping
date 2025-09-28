const categoryService = require('../../services/exchange/categoryService');
const logger = require('../../utils/logger')

const createCategory = async (req, res)=>{
    try {
        const {name,image} = req.body
        const result = await categoryService.createCategory({name, image})
        return res.status(result.status).json(result)
    } catch (error) {
        logger.error('Category controller',error);
        return res.status(400).json(error.message)
    }
}

const getCategories = async (req, res)=>{
    try {
        const result = await categoryService.getCategories()
        return res.status(result.status).json(result)
    } catch (error) {
        logger.error('Category controller',error);
        return res.status(400).json(error.message)
    }   
}

const getCategory = async (req, res)=>{
    try {
        const {id} = req.params
        const result = await categoryService.getCategory(id)
        return res.status(result.status).json(result)
    } catch (error) {
        logger.error('Category controller',error);
        return res.status(400).json(error.message)
    }   
}

const deleteCategory = async (req, res)=>{
    try {
        const {id} = req.params
        const result = await categoryService.deleteCategory(id)
        return res.status(result.status).json(result)
    } catch (error) {
        logger.error('Category controller',error);
        return res.status(400).json(error.message)
    }
}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    deleteCategory
}