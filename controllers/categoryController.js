const db = require('../models')
const Category = db.Category

let categoryController = {
  //瀏覽所有分類
  getCategories: (req, res) => {
    return Category.findAll()
      .then(categories => {
        if (req.params.id) {
          Category.findByPk(req.params.id)
            .then(category => {
              return res.render('admin/categories', { categories, category })
            })
        } else {
          return res.render('admin/categories', { categories })
        }
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
          req.flash('success_messages', 'category was successfully to update')
        })
        .then(category => res.redirect('/admin/categories'))
    }
  }
}

module.exports = categoryController