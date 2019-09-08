const db = require('../models')
const Category = db.Category

let categoryService = {
  //瀏覽所有分類
  getCategories: (req, res, callback) => {
    return Category.findAll()
      .then(categories => {
        if (req.params.id) {
          Category.findByPk(req.params.id)
            .then(category => {
              return callback({ categories, category })
            })
        } else {
          return callback({ categories })
        }
      })
  },
  //新增分類
  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    } else {
      return Category.create({
        name: req.body.name
      })
        .then(category => {
          return callback({ status: 'success', message: "new category has been successfully added" })
          // return res.redirect('/admin/categories')
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

module.exports = categoryService