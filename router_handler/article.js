//导入数据库操作模块
const db = require('../db/index')
//导入处理路径的内置模块
const path = require('path')
//发布文章的处理函数
exports.addArticle = (req, res) => {
  //手动判断是否上传了封面

  if (!req.file || req.file.fieldname !== 'cover_img')
    return res.cc('文章封面是必选参数')

  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.auth.id
  }
  console.log(articleInfo)
  const sql = `insert into ev_articles set ?`

  // 执行 SQL 语句
  db.query(sql, articleInfo, (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('发布文章失败！')

    // 发布文章成功
    res.cc('发布文章成功', 0)
  })
}

//获取文章列表数据的处理函数
exports.getArticleList = (req, res) => {
  //每页显示的数据条数
  const pagesize = req.query.pagesize
  //页码值
  let pagenum = req.query.pagenum
  //文章状态
  const state = req.query.state
  //文章分类的id
  const cate_id = req.query.cate_id
  //处理函数
  getAtc = (err, results) => {
    //执行 SQL 语句失败返回一个错误信息
    if (err) return res.cc(err)

    //总条数
    const pagesum = results.length

    //所在页码大于(总条数/每页条数)时，把页码值设置为最后一页
    if (pagenum > Math.ceil(pagesum / pagesize)) {
      pagenum = Math.ceil(pagesum / pagesize)
    }
    //利用数组方法截取数据
    let data = results.splice((pagenum - 1) * pagesize, pagesize)
    res.send({
      status: 0,
      message: '获取文章列表成功',
      data: data,
      total: pagesum
    })
  }
  if (state !== '' && cate_id !== '') {
    let sql =
      'select * from ev_articles where is_delete = 0 and state = ? and cate_id = ?'
    db.query(sql, [state, cate_id], getAtc)
  } else if (state !== '') {
    let sql = 'select * from ev_articles where is_delete = 0 and state = ?'
    db.query(sql, state, getAtc)
  } else if (cate_id !== '') {
    let sql = 'select * from ev_articles where is_delete = 0 and cate_id = ?'
    db.query(sql, cate_id, getAtc)
  } else {
    let sql = 'select * from ev_articles where is_delete = 0 '
    db.query(sql, getAtc)
  }
}

//根据id删除文章的处理函数
exports.deleteArticle = (req, res) => {
  const sql = 'update ev_articles set is_delete=1  where id = ?'

  db.query(sql, req.params.id, (err, results) => {
    //执行 SQL 语句失败返回一个错误信息
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('删除文章失败！')

    //执行 SQL 语句成功
    res.send({
      status: 0,
      message: '删除文章成功！'
    })
  })
}

//根据id获取文章信息的处理函数
exports.getArticle = (req, res) => {
  const sql = 'select * from ev_articles where id = ?'
  db.query(sql, req.params.id, (err, results) => {
    //执行 SQL 语句失败返回一个错误信息
    if (err) return res.cc(err)
    // 获取行数不等于1
    if (results.length !== 1) return res.cc('获取文章失败！')

    //执行 SQL 语句成功
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results[0]
    })
  })
}
//根据id更新文章信息的处理函数
exports.updateArticle = (req, res) => {
  if (!req.file || req.file.fieldname !== 'cover_img')
    return res.cc('文章封面是必选参数')

  const articleInfo = {
    ...req.body,
    cover_img: path.join('/uploads', req.file.filename)
  }

  const sql = 'update ev_articles set ? where id = ?'

  db.query(sql, [articleInfo, req.body.Id], (err, results) => {
    //执行 SQL 语句失败返回一个错误信息
    if (err) return res.cc(err)
    // 执行 SQL 语句成功，但是影响行数不等于 1
    if (results.affectedRows !== 1) return res.cc('更新文章失败！')

    //执行 SQL 语句成功
    res.send({
      status: 0,
      message: '更新文章成功！',
    })
  })
}
