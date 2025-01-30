const express = require("express");
const request = require("request");
const axios = require("axios");
const app = express();
const port = process.env.PORT;
const { ModuleClient, Twin } = require("azure-iot-device");
const { Mqtt } = require("azure-iot-device-mqtt");


// Array of connection strings for multiple devices
const connectionStrings = [
    "HostName=D7A4IHSI02.azure-devices.net;DeviceId=6654283414e2fe48c5c824a5;SharedAccessKey=laQS5um49Ea8jgJgu1LTjgKJfB/e8Eg+ZTE4SMYIntw=", // Device GH 
    "HostName=D7A4IHSI02.azure-devices.net;DeviceId=665427f514e2fe0ce5c8247b;SharedAccessKey=ZHPWEd21iGmjMXpDQ+8s/wuGJoXngPn2Sp8tRMJwv1Q=", // Device GH 
    "HostName=D7A4IHSI02.azure-devices.net;DeviceId=665428e114e2fe4612c8250e;SharedAccessKey=UCjFDthiXe3pCd4+79E1L8yDADcCkjHWCzpT1pxr2Mk=", // Device GH 
    "HostName=D7A4IHSI02.azure-devices.net;DeviceId=660b874f3418af65fedd60c0;SharedAccessKey=Pu554PVhvT0t5ESO8mjjQa17qVLS3k/LQR2xDbSjLqU=", // Device FZ
    "HostName=D7A4IHSI02.azure-devices.net;DeviceId=6654295b14e2fe6447c82554;SharedAccessKey=MPQOwEyflg9kQrMwJBmk37RH1AQ8YdJD0hNdb7UTjKo=", // Device FZ 
    "HostName=D7A4IHSI02.azure-devices.net;DeviceId=665429d914e2fe2e04c825a1;SharedAccessKey=byTTIL3RaH7pnVaAgkHloY8aGuxVRxegK75vSPt0QRU=", // Device FZ 
    "HostName=D7A4IHSI02.azure-devices.net;DeviceId=6553141a7559df351814c694;SharedAccessKey=FOPgTvqEA9N+PnHDKLBeU5CW9SIfhvIMbXZZ6O1UYNY=", // Device PFAL Rack
    "HostName=D7A4IHSI02.azure-devices.net;DeviceId=653b32d6e9aaa8857e1985cb;SharedAccessKey=Py+PapwQOF+ahCilvVJ+6q5xfn8ytokC4U1y5IjpDyI=", // Device PFAL Room
    "HostName=D7A4IHSI02.azure-devices.net;DeviceId=679aeee24871ff788120fc00;SharedAccessKey=H6EAcnZWnDzKxNQWxVQvsrfhnUxoLYi5p1s9glsvuR8=", // Device Solar station Honey
    // Add more connection strings as needed
];

let connectionStatus = {};

async function twinUpdateListener(client) {
    try {
        const twin = await client.getTwin();
        console.log("Twin acquired");

        twin.on("properties.desired", (delta) => {
            console.log("Twin patch received");
            delete delta.$version;
            console.log("Sending Twin as reported property...");
            console.log(delta);
            twin.properties.reported.update(delta, (err) => {
                if (err) {
                    console.error(
                        "Error updating reported properties: " + err.message,
                    );
                } else {
                    console.log("Reported properties updated");
                }
            });
        });
    } catch (err) {
        console.error("Error getting twin: " + err.message);
    }
}

/*async function initClient(connectionString) {
    try {
        const client = await ModuleClient.fromConnectionString(
            connectionString,
            Mqtt,
        );
        await client.open();
        console.log(
            "IoT Hub module client initialized and connected for connection string: " +
                connectionString,
        );

        twinUpdateListener(client);
    } catch (err) {
        console.error(
            "Could not connect to IoT Hub with connection string " +
                connectionString +
                ": " +
                err.message,
        );
    }
}

async function main() {
    connectionStrings.forEach((connectionString) => {
        initClient(connectionString);
    });

    process.on("SIGINT", () => {
        console.log("IoT Hub Device Twin device sample stopped");
        process.exit();
    });

    // Keep the application running
    setInterval(() => {}, 1000);
}

console.log(
    "Starting the Node.js IoT Hub Device Twin device sample for multiple devices...",
);
console.log("IoTHubModuleClient waiting for commands, press Ctrl-C to exit");
main();*/

async function initClient(connectionString) {
    const deviceId = connectionString.match(/DeviceId=([^;]*)/)[1];
    try {
        const client = await ModuleClient.fromConnectionString(
            connectionString,
            Mqtt,
        );
        await client.open();
        console.log(
            "IoT Hub module client initialized and connected for device: " +
                deviceId,
        );

        connectionStatus[deviceId] = "Connected";
        twinUpdateListener(client);
    } catch (err) {
        console.error(
            "Could not connect to IoT Hub with device " +
                deviceId +
                ": " +
                err.message,
        );

        connectionStatus[deviceId] = "Failed";
    }
}

async function main() {
    for (const connectionString of connectionStrings) {
        await initClient(connectionString);
    }

    process.on("SIGINT", () => {
        console.log("IoT Hub Device Twin device sample stopped");
        process.exit();
    });

    // Keep the application running
    setInterval(() => {
        console.log("Connection Status:", connectionStatus);
    }, 10000);
}

console.log(
    "Starting the Node.js IoT Hub Device Twin device sample for multiple devices...",
);
console.log("IoTHubModuleClient waiting for commands, press Ctrl-C to exit");
main();

app.get("/", (req, res) => {
    res.send("Hello, World! เซิร์ฟเวอร์เปิดเเล้วครับ ++++++");
});

app.get("/statusDevice", (req, res) => {
    res.send(connectionStatus);
});

app.get("/Allconnections", (req, res) => {
    res.send(connectionStrings);
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
