import { writeFile } from 'fs';

function genRandomUpdates(deviceId: string) {
    let updates = [];

    let min: number = Date.now()

    for (let i = 0; i < 10; i++) {
        const max: number = min + Math.floor(Math.random() * 1000000);
        updates.push({
            deviceId,
            isOn: true,
            time: min
        });

        updates.push({
            deviceId,
            isOn: false,
            time: max
        });

        min = max;
    }
    return updates;
}

function writeUpdates() {
    let deviceUpdates: Array<object> = [];
    
    for (let i = 0; i < 6; i++) {
        const updates = genRandomUpdates(String(i));
        deviceUpdates = deviceUpdates.concat(updates);
    }

    let devUpdates = {
        deviceUpdates
    };

    writeFile("./deviceUpdates.json", JSON.stringify(devUpdates), (err) => {
        if (err) {
            console.log("Failed to write mock data");
        } 
        return;
    });
}

writeUpdates();
