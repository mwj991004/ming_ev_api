//导入数据库操作模块
const db = require('../db/index')

//导入bcryptjs包
const bcrypt = require('bcryptjs')

// 导入全局配置文件
const config = require('../config')

// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')

//注册新用户的处理函数
exports.regUser = (req, res) => {
  //接受表单数据
  const userinfo = req.body
  //判断数据是否合法
  /*   if (!userinfo.username || !userinfo.password) {
    // return res.send({ status: 1, message: '用户名或密码不合法！'})
    return res.cc('用户名或密码不合法！')
  } */

  //定义SQL语句，查询用户名是否被占用
  const sqlStr = 'select * from ev_users where username = ?'
  db.query(sqlStr, [userinfo.username], (err, results) => {
    //执行SQL语句失败
    if (err) {
      //   return res.send({  status: 1,  message: err.message})
      return res.cc(err)
    }
    //判断用户名是否被占用
    if (results.length > 0) {
      //   return res.send({  status: 1, message: '用户名被占用，请更换其他'})
      return res.cc('用户名被占用，请更换其他')
    }
    //调用bcrypt.hashSync()对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)

    //定义插入新用户的SQL语句
    const sql = 'insert into ev_users set ?'
    //调用db.query()执行SQL语句
    db.query(
      sql,
      { username: userinfo.username, password: userinfo.password },
      (err, results) => {
        //判断SQL语句是否执行
        // if (err) return res.send({ status: 1, message: err.message })
        if (err) return res.cc(err)
        //判断影响行数是否为1
        if (results.affectedRows !== 1) {
          // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
          return res.cc('注册用户失败，请稍后再试！')
        }
        //注册用户成功
        res.send({ status: 0, message: '注册成功！' })
      }
    )
  })
}
//登录的处理函数
exports.login = (req, res) => {
  //接收表单数据
  const userinfo = req.body
  //定义SQL语句
  const sql = 'select * from ev_users where username=?'
  //执行SQL语句，根据用户名查询用户的信息
  db.query(sql, userinfo.username, (err, results) => {
    //执行SQL语句失败
    if (err) return res.cc(err)
    //执行sql语句成功，但是获取的数据条数不等于1
    if (results.length !== 1) return res.cc('登录失败，用户名错误')
    //判断密码是否正确
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    )
    if (!compareResult) return res.cc('密码错误')
    // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
    const user = { ...results[0], password: '', user_pic: '' }
    //对用户的信息进行加密，生产token的字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn
    })
    res.send({
      status: 0,
      message: '登录成功！',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      token: 'Bearer ' + tokenStr
    })
  })
}
