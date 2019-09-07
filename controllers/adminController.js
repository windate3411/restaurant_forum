const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'fb3f88b74db0342'

const adminService = require('../services/adminService')
const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
    // return Restaurant.findAll({ include: [Category] })
    //   .then(restaurants => {
    //     return res.render('admin/restaurants', { restaurants })
    //   })
  },
  createRestaurant: (req, res) => {
    Category.findAll()
      .then(categories => {
        return res.render('admin/create', { categories })
      })
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_messages', data['message'])
        res.redirect('/admin/restaurants')
      } else {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
    })
    // if (!req.body.name) {
    //   req.flash('error_messages', "name didn't exist")
    //   return res.redirect('back')
    // }

    // const { file } = req
    // if (file) {
    //   imgur.setClientID(IMGUR_CLIENT_ID);
    //   imgur.upload(file.path, (err, img) => {
    //     return Restaurant.create({
    //       name: req.body.name,
    //       tel: req.body.tel,
    //       address: req.body.address,
    //       opening_hours: req.body.opening_hours,
    //       description: req.body.description,
    //       image: file ? img.data.link : null,
    //       CategoryId: req.body.categoryId
    //     }).then((restaurant) => {
    //       req.flash('success_messages', 'restaurant was successfully created')
    //       return res.redirect('/admin/restaurants')
    //     })
    //   })
    // }
    // else {
    //   return Restaurant.create({
    //     name: req.body.name,
    //     tel: req.body.tel,
    //     address: req.body.address,
    //     opening_hours: req.body.opening_hours,
    //     description: req.body.description,
    //     image: null,
    //     CategoryId: req.body.categoryId
    //   }).then((restaurant) => {
    //     req.flash('success_messages', 'restaurant was successfully created')
    //     return res.redirect('/admin/restaurants')
    //   })
    // }
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },
  editRestaurant: (req, res) => {
    Category.findAll()
      .then(categories => {
        return Restaurant.findByPk(req.params.id).then(restaurant => {
          return res.render('admin/create', { restaurant, categories })
        })
      })
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
              .then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
              })
          })
      })
    }
    else
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
              res.redirect('/admin/restaurants')
            })
        })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('/admin/restaurants')
      }
    })
    // return Restaurant.findByPk(req.params.id)
    //   .then((restaurant) => {
    //     restaurant.destroy()
    //       .then((restaurant) => {
    //         res.redirect('/admin/restaurants')
    //       })
    //   })
  },
  getUsers: (req, res) => {
    return User.findAll()
      .then(users => {
        return res.render('admin/users', { users })
      })
  },
  putUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        user.update({
          isAdmin: user.isAdmin ? false : true
        })
        console.log(user.dataValues.name);
        req.flash('success_messages', `${user.dataValues.name}'s status has been successfully changed`)
        return user
      })
      .then(user => {
        res.redirect('/admin/users')
      })
  }
}

module.exports = adminController