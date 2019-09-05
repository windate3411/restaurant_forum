const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const express = require('express')
const router = express.Router()
const passport = require('../config/passport')


const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/signin')
}
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) { return next() }
    return res.redirect('/')
  }
  res.redirect('/signin')
}

//如果使用者訪問首頁，就導向 /restaurants 的頁面
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))

//在 /restaurants 底下則交給 restController.getRestaurants 來處理
router.get('/restaurants', authenticated, restController.getRestaurants)

//人氣餐廳
router.get('/restaurants/top', authenticated, restController.getTopRestaurant)

//顯示最新動態
router.get('/restaurants/feeds', authenticated, restController.getFeeds)

//使用者瀏覽單一餐廳
router.get('/restaurants/:id', authenticated, restController.getRestaurant)

//使用者瀏覽餐廳dashboard
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
//如果是在admin中則導向admin首頁
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

//註冊相關
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

//登入相關
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

//新增餐廳
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

//瀏覽單一餐廳資訊
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

//更新餐廳資料
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

//刪除餐廳資料
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

//更新使用者權限
router.put('/admin/users/:id', authenticatedAdmin, adminController.putUser)

//瀏覽餐廳分類
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)

//增加餐廳分類
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

//編輯餐廳分類
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

//刪除餐廳分類
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

//新增評論
router.post('/comments', authenticated, commentController.postComment)

//刪除評論
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

//topusers
router.get('/users/top', authenticated, userController.getTopUser)

//瀏覽個人資料
router.get('/users/:id', authenticated, userController.getUser)

//瀏覽編輯 Profile 頁面
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

//我的最愛功能
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

//Like & unlike
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

//following
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)


module.exports = router