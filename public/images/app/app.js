let express = require('express');
let app = express();
/**
 * public - имя папки где хранится статика
 */
app.use(express.static('public'));
/**
 *  задаем шаблонизатор
 */
app.set('view engine', 'pug');
/**
* Подключаем mysql модуль
*/
let mysql = require('mysql');
/**
* настраиваем модуль
*/

let con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database : 'market'
});

app.listen(3000, function () {
    console.log('node express work on 3000');
});

app.get('/', function (req, res) {
  con.query(
    'SELECT * FROM goods',
    function(error, result){
      if (error) throw err;
    ///  console.log(result);
      let goods = {};
      for (let i = 0; i < result.length; i++){
        goods[result[i]['id']] = result[i];
      }
      //console.log(goods);
      console.log(JSON.parse(JSON.stringify(goods)));
      res.render('main', {
          foo: 'hello',
          bar: 7,
          goods :  JSON.parse(JSON.stringify(goods))
      });
    }
  );
});
