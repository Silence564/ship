module.exports = {
    "init": {
        "x": 0, // м
        "y": -3000, // м
        "angle": 90, // градусов относительно оси y
        "v": 7, // метров в секунду
        "length": 200, // длина в метрах
        "color": "#800000",
        "frequency": 1
    },
    "update": function (active, store, observed, utils,  maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y) {
        active.main(store, observed,  maneuvering, Bearingtemp, Distancetemp, Vtemp_x, Vtemp_y)         
    }
}