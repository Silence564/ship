module.exports = {
    "init": {
        "x": 20, // м
        "y": 0, // м
        "angle": 90, // градусов относительно оси y
        "v": 10, // метров в секунду
        "length": 150, // длина в метрах
        "color": "blue",
        "frequency": 1
    },
    "update": function (store, observed, utils, decision, maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y) {
        //if(store.time >= 50 && store.time < 80 || store.time >= 110 && store.time < 160)
          //  store.angle += 1; // Поворачиваем в заданные интервалы времени
        [dx, dy] = utils.linearIncrement(store.angle, store.v); // Пересчитали в приращение
        store.x += dx; // Применили приращение
        store.y += dy;
        // Содержание observed (наблюдаемых объектов) не учитывается
    }
}
