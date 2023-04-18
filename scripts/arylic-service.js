async function getConnectionStatus(ipAddress) {
    let url = getRequestUrl(ipAddress, 'wlanGetConnectState')
    try {
        return await sendHttpRequest(url, ipAddress)
    } catch (err) {
        return "FAIL"
    }
}

async function getPlayerStatus(ipAddress) {
    let url = getRequestUrl(ipAddress, 'getPlayerStatus')
    try {
        let type = await sendHttpRequest(url, ipAddress)
        type.mode = getPlaybackModeName(type.mode)
        return type
    } catch (err) {
        return {
            type: "FAIL",
            vol: 0
        }
    }
}

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
