const db = require('../../models')
const Category = db.Category
const categoryService = require('../../services/categoryService')
let categoryController = {
  //瀏覽所有分類
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },
  //新增分類
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name did not exist')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      })
        .then(category => {
          return res.redirect('/admin/categories')
        })
    }
  },
  //編輯分類
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name did not exsist')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then(category => {
          category.update(req.body)
          req.flash('success_messages', 'category was successfully  updated')
        })
        .then(category => res.redirect('/admin/categories'))
    }
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