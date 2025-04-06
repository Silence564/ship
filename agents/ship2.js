module.exports = {
    "init": {
        "x": 1000, // м
        "y": 0, // м
        "angle": 270, // градусов относительно оси y
        "v": 5, // метров в секунду
        "length": 200, // длина в метрах
        "color": "black",
        "frequency": 1
    },
    "update": function (store, observed, utils, decision, maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y) {

        [dx, dy] = utils.linearIncrement(store.angle, store.v); // Пересчитали в приращение
        store.x += dx; // Применили приращение
        store.y += dy;
        //console.log("INFO", observed);
        // Содержание observed (наблюдаемых объектов) не учитывается
    }
}
