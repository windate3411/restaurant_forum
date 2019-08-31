const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
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
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))

  //在 /restaurants 底下則交給 restController.getRestaurants 來處理
  app.get('/restaurants', authenticated, restController.getRestaurants)

  //使用者瀏覽單一餐廳
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)

  //如果是在admin中則導向admin首頁
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

  //註冊相關
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  //登入相關
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  //新增餐廳
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

  //瀏覽單一餐廳資訊
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  //更新餐廳資料
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  //刪除餐廳資料
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  //更新使用者權限
  app.put('/admin/users/:id', authenticatedAdmin, adminController.putUser)

  //瀏覽餐廳分類
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)

  //增加餐廳分類
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

  //編輯餐廳分類
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

  //刪除餐廳分類
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  //新增評論
  app.post('/comments', authenticated, commentController.postComment)

  //刪除評論
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

}