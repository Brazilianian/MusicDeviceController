/**
 * Returns status of the sound device
 * @param {string} ipAddress - ip address of sound device
 * @returns {Promise<string>} - status of sound device
 */
async function getConnectionStatus(ipAddress) {
    let url = getRequestUrl(ipAddress, 'wlanGetConnectState', {})
    try {
        return await sendHttpRequest(url, ipAddress)
    } catch (err) {
        return "FAIL"
    }
}

/**
 *
 * @param {string} ipAddress - ip address of sound device
 * @returns {Promise<PlayerStatus>} - for details look https://developer.arylic.com/httpapi/#playback-status
 */
async function getPlaybackStatus(ipAddress) {
    let url = getRequestUrl(ipAddress, 'getPlayerStatus', {})
    try {
        let playerStatus = await sendHttpRequest(url, ipAddress)
        playerStatus.mode = getPlaybackModeName(playerStatus.mode)
        playerStatus.Title = fromHexToString(playerStatus.Title.toString())
        playerStatus.Artist = fromHexToString(playerStatus.Artist.toString())
        playerStatus.Album = fromHexToString(playerStatus.Album.toString())

        return playerStatus
    } catch (err) {
        return {
            type: "FAIL",
            vol: 0,
        }
    }
}

const playbackMode = {
    0: "Idling",
    1: "Airplay streaming",
    2: "DLNA streaming",
    10: "Playing network content",
    11: "Playing from local USB disk",
    20: "Playback start by HTTP API",
    31: "Spotify content streaming",
    40: "Line-in input mode",
    41: "Bluetooth input mode",
    43: "Optical input mode",
    47: "Line-in #2 input mode",
    51: "USB DAC input mode",
    99: "The device is a guest in a Multiroom Zone",
}

/**
 * Return the playback mode's name by it number
 * @param {number} number
 * @returns {string}
 */
function getPlaybackModeName(number) {
    let modeName = playbackMode[number]
    if (typeof modeName === "undefined") {
        modeName = "Unknown mode"
    }
    return modeName
}

/**
 * Parse the hexadecimal string to text
 * @param {string} hexString - the string in hexadecimal format
 * @returns {string}
 */
function fromHexToString(hexString) {
    let str = "";
    for (let i = 0; i < hexString.length; i += 2) {
        const hex = hexString.substr(i, 2);
        const charCode = parseInt(hex, 16);
        str += String.fromCharCode(charCode);
    }

    return str
}

/**
 * Play the track by url
 * @param {string} ipAddress - ip address of sound device
 * @param {string} urlOfTrack - url of track to play
 */
function playUrl(ipAddress, urlOfTrack) {
    let url = getRequestUrl(ipAddress, `setPlayerCmd:play:${urlOfTrack}`, {})
    sendHttpRequest(url, 'GET')
}

/**
 * Stops the current track
 * @param {string} ipAddress - ip address of sound device
 */
function stopPlaying(ipAddress) {
    let url = getRequestUrl(ipAddress, 'setPlayerCmd:stop', {})
    sendHttpRequest(url, 'GET')
}

/**
 * Changes volume of the sound device
 * @param {string} ipAddress - ip address of sound device
 * @param {number} volume - volume to set in range 0..100
 */
function changeVolume(ipAddress, volume) {
    let url = getRequestUrl(ipAddress, `setPlayerCmd:vol:${volume}`, {})
    sendHttpRequest(url, 'GET')
}

const inputSource = {
    'wifi': 'Wifi Mode',
    'line-in': 'Line Analogue Input',
    'bluetooth': 'Bluetooth Mode',
    'optical': 'Optical Digital Input',
    'co-axial': 'Co-Axial Digital Input',
    'line-in2': 'Line Analogue Input',
    'udisk': 'UDisk Mode',
    'PCUSB': 'USBDAC Mode'
}

/**
 * Changes input source mode of sound device
 * @param {string} ipAddress - ip address of sound device
 * @param {string} mode - input source mode
 */
function changeInputSource(ipAddress, mode) {
    let url = getRequestUrl(ipAddress, `setPlayerCmd:switchmode:${mode}`, {})
    sendHttpRequest(url, 'GET')
}

/**
 * Creates the request url
 * @param ipAddress - ip address of sound device
 * @param commandName - name of command (optional)
 * @param commandOptions - addition options (optional)
 * @returns {string}
 */
function getRequestUrl(ipAddress, commandName, commandOptions) {
    let url = `http://${ipAddress}/httpapi.asp`
    if (typeof commandName === "undefined") {
        return url
    }

    url += `?command=${commandName}`
    if (typeof commandOptions === "undefined") {
        return url
    }

    Object.keys(commandOptions).forEach(key => {
        url += `:${key}=${commandName[key]}`
    })

    return url
}

/**
 * Sends the http request to sound device
 * Use the url from the getRequestUrl() function
 * @param {string} url
 * @param {string} httpType - GET, POST, DELETE etc.
 * @returns {Promise<unknown>}
 */
function sendHttpRequest(url, httpType) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open(httpType, url)

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status <= 299) {
                resolve(xhr.response)
            } else {
                reject(xhr.response)
            }
        }

        xhr.onerror = function () {
            reject(`Network error while trying to send ${httpType} request to ${url}`)
        }

        xhr.send()

        console.log(`Sent http request to ${url}`)
    })
}
