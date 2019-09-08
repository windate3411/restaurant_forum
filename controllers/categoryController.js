const db = require('../models')
const Category = db.Category
const categoryService = require('../services/categoryService')
let categoryController = {
  //瀏覽所有分類
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
    // return Category.findAll()
    //   .then(categories => {
    //     if (req.params.id) {
    //       Category.findByPk(req.params.id)
    //         .then(category => {
    //           return res.render('admin/categories', { categories, category })
    //         })
    //     } else {
    //       return res.render('admin/categories', { categories })
    //     }
    //   })
  },
  //新增分類
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_messages', data['message'])
        res.redirect('/admin/categories')
      } else {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
    })
    // if (!req.body.name) {
    //   req.flash('error_messages', 'name did not exist')
    //   return res.redirect('back')
    // } else {
    //   return Category.create({
    //     name: req.body.name
    //   })
    //     .then(category => {
    //       return res.redirect('/admin/categories')
    //     })
    // }
  },
  //編輯分類
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_messages', data['message'])
        res.redirect('/admin/categories')
      } else {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
    })
    // if (!req.body.name) {
    //   req.flash('error_messages', 'name did not exsist')
    //   return res.redirect('back')
    // } else {
    //   return Category.findByPk(req.params.id)
    //     .then(category => {
    //       category.update(req.body)
    //       req.flash('success_messages', 'category was successfully  updated')
    //     })
    //     .then(category => res.redirect('/admin/categories'))
    // }
  },
  //刪除分類
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        category.destroy()
        req.flash('success_messages', 'category was successfully destoryed')
      })
      .then(category => res.redirect('/admin/categories'))
  }

}

module.exports = categoryController