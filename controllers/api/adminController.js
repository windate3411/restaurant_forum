const adminService = require('../../services/adminService')
const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
    // return Restaurant.findAll({ include: [Category] }).then(restaurants => {
    //   return res.json({ restaurants: restaurants })
    // })
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      return res.json(data)
    })
    // return Restaurant.findByPk(req.params.id)
    //   .then((restaurant) => {
    //     restaurant.destroy()
    //       .then((restaurant) => {
    //         res.json({ status: 'success', message: '' })
    //       })
    //   })
  },
  postRestaurant: (req, res, callback) => {
    adminService.postRestaurant(req, res, (data) => {
      return res.json(data)
    })
    // if (!req.body.name) {
    //   return callback({ status: 'error', message: "name didn't exist" })
    // }
    // const { file } = req // equal to const file = req.file
    // if (file) {
    //   imgur.setClientID(IMGUR_CLIENT_ID)
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
    //       callback({ status: 'success', message: 'restaurant was successfully created' })
    //     })
    //   })
    // } else {
    //   return Restaurant.create({
    //     name: req.body.name,
    //     tel: req.body.tel,
    //     address: req.body.address,
    //     opening_hours: req.body.opening_hours,
    //     description: req.body.description,
    //     CategoryId: req.body.categoryId
    //   })
    //     .then((restaurant) => {
    //       callback({ status: 'success', message: 'restaurant was successfully created' })
    //     })
    // }
  },

}
module.exports = adminController