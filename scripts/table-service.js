/**
 * Gets table by id and adds table's headers
 * @param {string} tableId - id of table in index.html
 */
function fillTableColumnsNames(tableId) {
    let tableElement = document.getElementById(tableId)
    let trTitle = document.createElement('tr')

    addThToTr(trTitle, 'Name')
    addThToTr(trTitle, 'Ip Address')
    addThToTr(trTitle, 'Status')
    addThToTr(trTitle, 'Playback Mode')
    addThToTr(trTitle, 'Volume')
    addThToTr(trTitle, 'Track')
    addThToTr(trTitle, 'Controls');

    tableElement.appendChild(trTitle)
}

/**
 * Clears the table row's and fills again
 * @param {soundDevices} soundDevices - sound devices data fill in table
 * @param {string} tableId - id of table in index.html
 */
function updateTable(soundDevices, tableId) {
    clearTable(tableId)

    let tableElement = document.getElementById(tableId)

    soundDevices.forEach(soundDevice => {
        let tr = document.createElement('tr')

        addTdToTr(tr, soundDevice.name)
        addTdToTr(tr, soundDevice.ipAddress)
        addTdToTr(tr, soundDevice.status)
        addTdToTr(tr, soundDevice.mode)
        addTdToTr(tr, soundDevice.volume)
        addTdToTr(tr, soundDevice.track)

        addControlsToTr(tr, soundDevice.ipAddress, soundDevice.url)


        tableElement.appendChild(tr)
    })
}

/**
 * Clears the table
 * @param {string} tableId - id of table in index.html
 */
function clearTable(tableId) {
    let table = document.getElementById(tableId);
    let rows = table.getElementsByTagName("tr");
    for (let i = rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

/**
 * In dependency of sound device's status changes disabled option of controls
 * Also changes the volume bar value
 * @param {soundDevices} soundDevices
 */
function updateControls(soundDevices) {

    soundDevices.forEach(soundDevice => {
        if (soundDevice.status === 'PROCESS' || soundDevice.status === 'FAIL') {
            setDisabledStatusControlButtons(true, soundDevice.ipAddress)
            return
        }
        setDisabledStatusControlButtons(false, soundDevice.ipAddress)
        document.getElementById(`volume-bar-${soundDevice.ipAddress}`).value = soundDevice.volume
    })
}

/**
 * Changes disabled status of sound device
 * @param {boolean} isDisabled - true/false disabled status
 * @param {string} ipAddress - ipAddress of sound device
 */
function setDisabledStatusControlButtons(isDisabled, ipAddress) {
    document.getElementById(`stop-${ipAddress}`).disabled = isDisabled
    document.getElementById(`play-${ipAddress}`).disabled = isDisabled
    document.getElementById(`volume-bar-${ipAddress}`).disabled = isDisabled
}

/**
 * Adds the controls elements to assigned table's row
 * @param {HTMLTableRowElement} tr - table row element to add controls
 * @param {string} ipAddress - ip address of sound device
 * @param {string} url - url of track
 */
function addControlsToTr(tr, ipAddress, url) {
    let tdControls = document.createElement('td')

    let divControls = document.createElement('div')
    divControls.className = 'div-controls'
    tdControls.appendChild(divControls)

    let divButtons = document.createElement('div')
    divControls.appendChild(divButtons)

    let buttonPlay = document.createElement('button')
    buttonPlay.className = 'play'
    buttonPlay.id = `play-${ipAddress}`
    buttonPlay.addEventListener('click', function () {
        playUrl(ipAddress, url)
    })
    divButtons.appendChild(buttonPlay)

    let buttonStop = document.createElement('button')
    buttonStop.className = 'stop'
    buttonStop.id = `stop-${ipAddress}`
    buttonStop.addEventListener('click', function () {
        stopPlaying(ipAddress)
    })
    divButtons.appendChild(buttonStop)

    let divVolume = document.createElement('div')
    divVolume.className = 'div-volume'
    divControls.appendChild(divVolume)

    let buttonVolume = document.createElement('button')
    buttonVolume.className = 'volume-up'
    buttonVolume.disabled = true
    divVolume.appendChild(buttonVolume)

    let volumeBar = document.createElement('input')
    volumeBar.className = 'volume-bar'
    volumeBar.id = `volume-bar-${ipAddress}`
    volumeBar.type = 'range'
    volumeBar.min = '0'
    volumeBar.max = '100'
    volumeBar.value = '0'
    volumeBar.onchange = function (e) {
        let volume = e.target.value
        changeVolume(ipAddress, volume)
    }
    divVolume.appendChild(volumeBar)

    tr.appendChild(tdControls)
}

/**
 * Create table's cell and adds to row
 * @param {HTMLTableRowElement} tr
 * @param {string} thName
 * @returns {HTMLTableRowElement}
 */
function addThToTr(tr, thName) {
    let th = document.createElement('th')
    th.innerText = thName
    tr.appendChild(th)

    return tr
}

/**
 *
 * @param {HTMLTableRowElement} tr
 * @param {string} tdName
 * @returns {HTMLTableRowElement}
 */
function addTdToTr(tr, tdName) {
    let td = document.createElement('td')
    td.innerText = tdName
    tr.appendChild(td)

    return tr
}