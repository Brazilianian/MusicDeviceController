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
        return await sendHttpRequest(url, ipAddress)
    } catch (err) {
        throw err
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