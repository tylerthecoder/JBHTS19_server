"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
function genRandomUpdates(deviceId) {
    var updates = [];
    var min = new Date('February 24, 2019 00:20:18 GMT-07:00').getTime();
    for (var i = 0; i < 10; i++) {
        var max = min + Math.floor(Math.random() * 1000000);
        updates.push({
            deviceId: deviceId,
            isOn: true,
            time: min
        });
        updates.push({
            deviceId: deviceId,
            isOn: false,
            time: max
        });
        min = max + Math.floor(Math.random() * 1000000);
    }
    return updates;
}
function writeUpdates() {
    var deviceUpdates = [];
    for (var i = 0; i < 6; i++) {
        var updates = genRandomUpdates(String(i));
        deviceUpdates = deviceUpdates.concat(updates);
    }
    var devUpdates = {
        deviceUpdates: deviceUpdates
    };
    fs_1.writeFile("./deviceUpdates.json", JSON.stringify(devUpdates), function (err) {
        if (err) {
            console.log("Failed to write mock data");
        }
        return;
    });
}
writeUpdates();
