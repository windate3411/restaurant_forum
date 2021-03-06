const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const fs = require('fs')
const config = require('config')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID || config.get('IMGUR_CLIENT_ID')
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const Sequelize = require('sequelize')
const Op = Sequelize.Op


const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          include: Restaurant
        },
        {
          model: Restaurant,
          as: 'FavoritedRestaurants'
        },
        {
          model: Restaurant,
          as: 'LikedRestaurants'
        },
        {
          model: User,
          as: 'Followers'
        },
        {
          model: User,
          as: 'Followings'
        }]
    })
      .then(user => {
        const restaurantCounts = [...new Set(user.Comments.map(item => item.Restaurant.name))]
        const reviewedRestaurantId = [...new Set(user.Comments.map(item => item.Restaurant.id))]
        const followers = user.Followers
        const followings = user.Followings
        //作法一 過濾資料
        const set = new Set()
        const reviewedRestaurant =
          user.Comments
            .map(item => item.Restaurant)
            .filter(item => restaurantCounts.includes(item.name) ? item : false)
            .filter(item => !set.has(item.name) ? set.add(item.name) : false)
        //作法二 再戳一次資料庫
        Restaurant.findAll({
          where: {
            id: {
              [Op.in]: reviewedRestaurantId
            }
          }
        }).then(filteredRestaurant => {
          return res.render('users/profile', {
            user,
            user_Id: Number(req.user.id),
            totalComments: user.Comments.length,
            restaurantCounts: restaurantCounts.length,
            followersCount: followers.length,
            followingsCount: followings.length,
            favoriteRestaurantCount: user.FavoritedRestaurants.length,
            filteredRestaurant,
            reviewedRestaurant
          })
        })
      })
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (Number(req.params.id) == req.user.id) {
          return res.render('users/edit', { user })
        } else {
          req.flash('error_messages', '你只能編輯自己的資料!')
          return res.redirect(`/users/${user.id}`)
        }
      })
  },
  putUser: (req, res) => {
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            })
            return res.redirect(`/users/${user.id}`)
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update(req.body)
          return res.redirect(`/users/${user.id}`)
        })
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },

  // like function
  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        like.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },

  getTopUser: (req, res) => {
    User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  },
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  }
}

module.exports = userController