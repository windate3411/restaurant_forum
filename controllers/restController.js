const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const Comment = db.Comment
const User = db.User
const pageLimit = 10
const restController = {
  getRestaurants: (req, res) => {
    let whereQuery = {}
    let categoryId = ''
    let offset = 0
    if (req.query.page) {
      offset = (Number(req.query.page) - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }

    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset, limit: pageLimit })
      .then(result => {
        let page = Number(req.query.page) || 1
        let pages = Math.ceil(result.count / pageLimit)
        let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        let prev = page - 1 < 1 ? 1 : page - 1
        let next = page > pages ? pages : page + 1
        const data = result.rows.map(r => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50)
        }))
        Category.findAll().then(categories => {
          return res.render('restaurants', { restaurants: data, categories, categoryId, prev, next, totalPage, page })
        })
      })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: [Category, { model: Comment, include: User }] })
      .then(restaurant => {
        // console.log(restaurant);
        console.log(restaurant.Comments[0]);
        // console.log(restaurant.Comments[0].dataValues);
        return res.render('restaurant', { restaurant })
      })
  }
}

module.exports = restController