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
        Object.keys(soundDevice).forEach(key => {
            addTdToTr(tr, soundDevice[key])
        })

        addControlsToTr(tr, soundDevice.ipAddress)


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
    //todo split button
    document.getElementById(`play-pause-${ipAddress}`).disabled = isDisabled
    document.getElementById(`volume-bar-${ipAddress}`).disabled = isDisabled
}

/**
 * Adds the controls elements to assigned table's row
 * @param {HTMLTableRowElement} tr - table row element to add controls
 * @param {string} ipAddress - ip address of sound device
 */
function addControlsToTr(tr, ipAddress) {
    let tdControls = document.createElement('td')

    let divControls = document.createElement('div')
    divControls.className = 'div-controls'
    tdControls.appendChild(divControls)

    let divButtons = document.createElement('div')
    divControls.appendChild(divButtons)


    //TODO split button
    let buttonPlayPause = document.createElement('button')
    buttonPlayPause.className = "play-pause"
    buttonPlayPause.id = `play-pause-${ipAddress}`
    buttonPlayPause.addEventListener('click', function () {
        pausePlay(ipAddress)
    })
    divButtons.appendChild(buttonPlayPause)

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