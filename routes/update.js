let rti = new (require('../rti'));
let express = require('express');
let router = express.Router();

const experimentsController = require('../rti/experiments_controller');
// Количество экспериментов и число агентов
const NUM_EXPERIMENTS = 2;
const NUM_AGENTS = 10;
const SAFE_DISTANCE_THRESHOLD = 100; // в метрах

router.get('/', function(req, res, next) {
    try {
        rti.next();
        res.send(JSON.stringify({"agents": rti.agents}));
    } catch(e) {
        console.error(e);
        throw e;
    }
});

router.get('/init', function(req, res, next) {
    try {
        rti.init();
        let r = Object.assign({}, {"agents": rti.agents}, {"config": rti.config}, {"zones": rti.zones});
        res.send(JSON.stringify(r));
    } catch(e) {
        console.error(e);
        throw e;
    }
});

router.get('/config', function(req, res, next) {
    try {
        res.send(JSON.stringify(rti.config));
    } catch(e) {
        console.error(e);
        throw e;
    }
});



module.exports = router;
