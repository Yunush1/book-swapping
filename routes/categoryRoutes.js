const categoryController = require('../controller/exhanges/categoryController');
const express = require('express');
const router = express.Router();

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;