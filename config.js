//这是一个全局配置文件

//加密和解密 token 的密钥
const jwtSecretKey = '明文军666'

module.exports = {
  jwtSecretKey,
  //token的有效期
  expiresIn: '10h'
}
