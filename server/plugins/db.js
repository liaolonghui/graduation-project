module.exports = app => {
  const mongoose = require('mongoose');

  mongoose.connect('mongodb://127.0.0.1:27017/fupin', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {
    if (err) {
      console.log('数据库连接失败！'+err);
    } else {
      console.log('数据库连接成功');
    }
  });

}