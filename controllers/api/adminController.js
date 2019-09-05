const adminService = require('../../services/adminService')
const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
    // return Restaurant.findAll({ include: [Category] }).then(restaurants => {
    //   return res.json({ restaurants: restaurants })
    // })
  }
}
module.exports = adminController