const assert = require("assert");
const utils = require("../rti/utils");

utils.seed("serge");
for(let i = 0; i < 100; i++)
    console.log(utils.randomNormal())

utils.seed("serge");
assert(utils.randomNormal() == -1.0908127968226553)
assert(utils.randomNormal() == 1.1840409594185999)
