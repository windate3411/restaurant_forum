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
  }

}
module.exports = adminController