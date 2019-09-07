const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController')


router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
//取得分類
router.get('/admin/categories', categoryController.getCategories)
//刪除餐廳
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)
//增加餐廳
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)

module.exports = router