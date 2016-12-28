var express = require('express');

var crypto = require('crypto');

var bodyParser = require('body-parser');
var app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

var db = require('./db');

app.use(bodyParser.json());

/**
 * Главная страница
 */
app.get('/', function(request, response) {
    response.render('Pages/index');
});


/**
 * Страница профиля
 */
app.get('/profile', function(request, response) {
    response.render('Pages/profile');
});

/**
 * Страница одиночной игры
 */
app.get('/singlegame', function(request, response) {
    response.render('Pages/singlegame');
});

/**
 * Страница одиночной игры (зимний режим)
 */
app.get('/snowmode', function(request, response) {
    response.render('Pages/snowmode');
});

/**
 * Страница рекордов
 */
app.get('/records', function(request, response) {
    db.select('login', 'singlerating').from('users').then(function(users) {
        response.render('Pages/records', {players: users});
    });
});


/**
 * Получение пользователей из БД
 */
app.get('/api/users', function(request, response) {
    db.select('login', 'rating', 'singlerating').from('users').then(function(users) {
        response.json(users);
    });
});

/**
 * Регистрация нового пользователя
 */
app.post('/api/users', function(request, response) {
    if((request.body.login).length < 3 || (request.body.password).length < 3) {
        response.send('Неподходящий логин или пароль');
    } else {
        db.select().from('users').where({
            login: request.body.login
        }).then(function(user) {
            if(user.length === 0) {
                var md5sum = crypto.createHash('md5');
                md5sum.update(request.body.password);
                request.body.password = md5sum.digest('hex');
                db('users').insert(request.body).then(function() {
                    response.json(request.body);
                    console.log(request.body);
                });
            } else {
                response.send('User with same login already exist');
            }
        });
    }
});

/**
 * Вход пользователя
 */
app.post('/api/users/login', function(request, response) {
    db.select().from('users').where({
        login: request.body.login
    }).then(function(user) {
        if(user.length === 0) {
            response.send('Incorrect login or password');
        } else {
            var md5sum = crypto.createHash('md5');
            md5sum.update(request.body.password);
            request.body.password = md5sum.digest('hex');
            if(request.body.password === user[0].password) {
                user[0].password = null;
                response.json(user); // Login is OK
            } else {
                response.status(401).send('Incorrect password');
            }
        }
    });
});

/**
 * Отправка запроса в базу статус игрока "Готов играть"
 */
app.post('/api/status', function(request, response) {
    db('users').where({
        login: request.body.login
    }).update({
        status: request.body.status
    }).then(function(user) {
        response.json(request.body);
    });
});

/**
 * Изменение рейтинга после игры, запись в бд и возвращение объекта
 * then(function(user) {}) - user - массив
 * request.body.user - объект
 */
app.post('/api/users/win', function(request, response) {
    if(request.body.isWin === false) request.body.user.singlerating -= 20;
    else if(request.body.isWin === true) request.body.user.singlerating += 20;
    db('users').where({
        login: request.body.user.login
    }).update({
        singlerating: request.body.user.singlerating
    }).then(function(user) {
        response.json(request.body.user);
    });
});

app.listen(3333, function() {
    console.log('App was launched');
});