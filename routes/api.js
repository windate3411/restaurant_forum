const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController')


router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
//取得分類
router.get('/admin/categories', categoryController.getCategories)
//刪除餐廳
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)

module.exports = router