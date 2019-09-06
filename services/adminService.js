const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'fb3f88b74db0342'

const adminService = {
  getRestaurants: (req, res, callblack) => {
    return Restaurant.findAll({ include: [Category] }).then(restaurants => {
      return callblack({ restaurants: restaurants })
    })
  },
  getRestaurant: (req, res, callblack) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then(restaurant => {
      return callblack({ restaurant })
    })
  },
  deleteRestaurant: (req, res, callblack) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            return callblack({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = adminService
