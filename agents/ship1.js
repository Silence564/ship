let debug = require('debug')('ship-simulator:ship1');
module.exports = {
    "init": {
        "x": 2000, // м 2000
        "y": 2000, // м 2000
        "angle": 270, // градусов относительно оси y 270
        "v": 8, // метров в секунду 8
        "length": 250, // длина в метрах
        "color": "red",
        "frequency": 1
    },
    "update": function (active, store, observed,  maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y) {
        // [dx, dy] = utils.linearIncrement(store.angle, store.v); // Пересчитали в приращение
        // store.x += dx; // Применили приращение
        // store.y += dy;
        //[dAngle, dx, dy] = utils.rotate(false, store);
        //store.angle += dAngle;
        //store.x += dx;
        //store.y += dy;
        // Содержание observed (наблюдаемых объектов) не учитывается
        //debug(JSON.stringify(observed)); // Вывод observed в консоль сервера в режиме отладки
        active.main(store, observed,  maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y)   
    }
}
