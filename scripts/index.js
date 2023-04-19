const FILE_PATH = "../resources/sound-devices.xml"
const TABLE_ID = 'soundDevicesTable'

let soundDevices = []

function getSoundDevicesFromFileAndFillTable() {
    getSoundDevicesFromFile(FILE_PATH)
        .then(soundDevicesFromFile => {
            soundDevices = soundDevicesFromFile

            fillTableColumnsNames(TABLE_ID)
            updateTable(soundDevices, TABLE_ID)
            updateControls(soundDevices)
        })
}

function getAndUpdateStatusInfo() {
    getConnectionStateInfo()

    updateTableAndControls()
}

function getAndUpdatePlaybackInfo() {
    getPlaybackInfo()

    updateTableAndControls()
}

function updateTableAndControls() {
    updateTable(soundDevices, TABLE_ID)
    updateControls(soundDevices)
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

function getPlaybackInfo() {
    for (const soundDevice of soundDevices) {
        getPlaybackStatus(soundDevice.ipAddress)
            .then(playbackStatus => {
                soundDevice.mode = playbackStatus.type
                soundDevice.volume = playbackStatus.vol

                if (typeof playbackStatus.Title === 'undefined') {
                    soundDevice.track = '...'
                } else {
                    soundDevice.track = `'${playbackStatus.Title}' - ${playbackStatus.Artist} | ${playbackStatus.Album}`
                }
            })
    }
}

function activateTimers() {
    //update status 10 seconds
    setInterval(function () {
        getAndUpdateStatusInfo()
    }, 10 * 1000)

    // update playback mode, volume, track info every 1 second
    setInterval(function () {
        getAndUpdatePlaybackInfo()
    }, 1000)
}

getSoundDevicesFromFileAndFillTable()

getAndUpdateStatusInfo()

activateTimers()






