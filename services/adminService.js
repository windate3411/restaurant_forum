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
  }
}

module.exports = adminService
