# Resraurant forum

此專案為餐廳論壇的最初版本
後台使用者可以瀏覽、新增、編輯以及刪除餐廳資料
並更改目前使用者的權限(admin/user)

此專案同時也上傳到heroku上
https://intense-escarpment-31713.herokuapp.com
可用以下帳號做測試
```
Admin
account:root@example.com
pwd:12345678
一般使用者
account:user1@example.com
pwd:12345678
```
## 專案預覽 Project preview

![image](https://github.com/windate3411/restaurant_forum.git/blob/master/result1.PNG)
![image](https://github.com/windate3411/restaurant_forum.git/blob/master/result2.PNG)

## 專案需求 Prerequisites

為了確保程式順利運作，你需要安裝以下程式 You need to install following software 

+ [Node.js v10.16.0(LTS)](https://nodejs.org/en/)

## 如何開始 Getting Started
```
# 下載專案 Clone the repository:
git clone https://github.com/windate3411/restaurant_forum.git

# 安裝NPM套件 Install NPM dependencies
npm install

# 執行程式 Start the app
npm run dev

順利執行時會在終端機看到
you are now listening at port 3000
便可前往http://localhost:3000使用
```

## 給助教的話

此次的作業我寫的很簡略，沒有其餘的優化 僅優先完成要求的功能，不好意思!

對比教材內容，新增的部分如下

+ 修改controller/adminController.js的內容

```
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
      })
      .then(user => {
        res.redirect('/admin/users')
      })
  }
```
這部分我在flash訊息增加了對應的使用者名稱，取出資料的方式有點醜，不知道有沒有更直接的辦法?

+ 修改routes/index.js的內容

```
//增加呈現使用者資料的endpoint
app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
//更新使用者權限
app.put('/admin/users/:id', authenticatedAdmin, adminController.putUser)
```
+ 在views/admin下增加users.handlebars 內容基本上與restaurants.handlebars一致 只是多加了個status的欄位

## 作者 Author

* **Danny Wang** 



 
 
 
 
 