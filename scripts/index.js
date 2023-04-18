const FILE_PATH = "../resources/sound-devices.xml"
const TABLE_ID = 'soundDevicesTable'

let soundDevices = []

async function getDataAndFillTable() {
    soundDevices = await getSoundDevicesFromFile(FILE_PATH)

    fillTableColumnsNames(TABLE_ID)
    updatedTable(soundDevices, TABLE_ID)
}

async function getSoundDevicesFromFile(filePath) {
    let xmlDom = await getXmlDomFromFile(filePath)
    return getDataFromXmlDom(xmlDom, 'soundDevices')
}

function getConnectionStateInfo() {
    for (const soundDevice of soundDevices) {
        getConnectionStatus(soundDevice.ipAddress)
            .then(response => {
                soundDevice.status = response
            })
    }
}

function getPlayerStatusInfo(){
    for (const soundDevice of soundDevices) {
        getPlayerStatus(soundDevice.ipAddress)
            .then(response => {
                soundDevice.status = response
            })
    }
}

getDataAndFillTable()

setInterval(function () {
    getConnectionStateInfo()
    getPlayerStatusInfo()

    updatedTable(soundDevices, TABLE_ID)

}, 10 * 1000)
