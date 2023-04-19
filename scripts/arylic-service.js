/**
 * Returns status of the sound device
 * @param {string} ipAddress - ip address of sound device
 * @returns {Promise<string>} - status of sound device
 */
async function getConnectionStatus(ipAddress) {
    let url = getRequestUrl(ipAddress, 'wlanGetConnectState')
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
    let url = getRequestUrl(ipAddress, 'getPlayerStatus')
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

/**
 * Return the playback mode's name by it number
 * @param {number} number
 * @returns {string}
 */
function getPlaybackModeName(number) {
    switch (number) {
        case 0:
            return "Idling"
        case 1:
            return "Airplay streaming"
        case 2:
            return "DLNA streaming"
        case 10:
            return "Playing network content"
        case 11:
            return "Playing from local USB disk"
        case 20:
            return "Playback start by HTTP API"
        case 31:
            return "Spotify content streaming"
        case 40:
            return "Line-in input mode"
        case 41:
            return "Bluetooth input mode"
        case 43:
            return "Optical input mode"
        case 47:
            return "Line-in #2 input mode"
        case 51:
            return "USB DAC input mode"
        case 99:
            return "The device is a guest in a Multiroom Zone"
        default:
            return "Unknown mode"
    }
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


//todo split
function pausePlay(ipAddress) {
    let url = getRequestUrl(ipAddress, 'setPlayerCmd:onepause')
    sendHttpRequest(url, 'GET')
}

/**
 * Changes volume of the sound device
 * @param {string} ipAddress - ip address of sound device
 * @param {number} volume - volume to set in range 0..100
 */
function changeVolume(ipAddress, volume) {
    let url = getRequestUrl(ipAddress, `setPlayerCmd:vol:${volume}`)
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
    })
}
