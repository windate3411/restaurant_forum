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
//新增分類
router.post('/admin/categories', categoryController.postCategory)
//刪除餐廳
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)
//增加餐廳
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
//編輯餐廳
router.put('/admin/restaurants/:id', upload.single('image'), adminController.putRestaurant)
module.exports = router