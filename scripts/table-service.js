/**
 * Gets table by id and adds table's columns and rows
 * @param {soundDevices} soundDevices - sound devices data fill in table
 * @param {string} tableId - id of table in index.html
 */
function fillTableColumnsAndRows(soundDevices, tableId) {
    let tableElement = document.getElementById(tableId)

    //Add columns
    let trTitle = document.createElement('tr')

    addThToTr(trTitle, 'Name')
    addThToTr(trTitle, 'Ip Address')
    addThToTr(trTitle, 'Status')
    addThToTr(trTitle, 'Playback Mode')
    addThToTr(trTitle, 'Volume')
    addThToTr(trTitle, 'Track')
    addThToTr(trTitle, 'Controls');
    addThToTr(trTitle, 'Change Input Source');

    tableElement.appendChild(trTitle)

    //Add rows
    soundDevices.forEach(soundDevice => {
        let tr = document.createElement('tr')

        addTdToTr(tr, soundDevice.name, `cell-name-${soundDevice.ipAddress}`)
        addTdToTr(tr, soundDevice.ipAddress, `cell-ipAddress-${soundDevice.ipAddress}`)
        addTdToTr(tr, soundDevice.status, `cell-status-${soundDevice.ipAddress}`)
        addTdToTr(tr, soundDevice.mode, `cell-mode-${soundDevice.ipAddress}`)
        addTdToTr(tr, soundDevice.volume, `cell-volume-${soundDevice.ipAddress}`)
        addTdToTr(tr, soundDevice.track, `cell-track-${soundDevice.ipAddress}`)

        addControlsToTr(tr, soundDevice.ipAddress, soundDevice.url, `cell-url-${soundDevice.ipAddress}`)
        addChangeInputSourceToTr(tr, soundDevice.ipAddress, soundDevice.mode, `cell-input-source-${soundDevice.ipAddress}`)

        tableElement.appendChild(tr)
    })
}

/**
 * In dependency of sound device's status changes disabled option of controls
 * @param {soundDevices} soundDevices
 */
function updateControls(soundDevices) {
    soundDevices.forEach(soundDevice => {
        if (soundDevice.status === 'PROCESS' || soundDevice.status === 'FAIL') {
            setDisabledStatusControlButtons(true, soundDevice.ipAddress)
            setDisabledStatusPlaybackModeSelectElement(true, soundDevice.ipAddress)
            return
        }
        setDisabledStatusControlButtons(false, soundDevice.ipAddress)
        setDisabledStatusPlaybackModeSelectElement(false, soundDevice.ipAddress)
    })
}

/**
 * Changes disabled status of sound device's controls buttons
 * @param {boolean} isDisabled - true/false disabled status
 * @param {string} ipAddress - ipAddress of sound device
 */
function setDisabledStatusControlButtons(isDisabled, ipAddress) {
    document.getElementById(`stop-${ipAddress}`).disabled = isDisabled
    document.getElementById(`play-${ipAddress}`).disabled = isDisabled
    document.getElementById(`volume-bar-${ipAddress}`).disabled = isDisabled
}

/**
 * Changes disabled status of sound device's playback mode
 * @param {boolean} isDisabled - true/false disabled status
 * @param {string} ipAddress - ipAddress of sound device
 */
function setDisabledStatusPlaybackModeSelectElement(isDisabled, ipAddress) {
    document.getElementById(`input-source-select-${ipAddress}`).disabled = isDisabled
}

/**
 * Updates status cell of table
 * @param {soundDevices} soundDevices
 */
function updateConnectionStatusInfo(soundDevices) {
    soundDevices.forEach(soundDevice => {
        document.getElementById(`cell-status-${soundDevice.ipAddress}`).innerText = soundDevice.status
    })
}

/**
 * Updates Playback Mode, Volume, Track cells of table
 * @param {soundDevices} soundDevices
 */
function updatePlaybackModeInfo(soundDevices) {
    soundDevices.forEach(soundDevice => {
        document.getElementById(`cell-mode-${soundDevice.ipAddress}`).innerText = soundDevice.mode
        document.getElementById(`cell-volume-${soundDevice.ipAddress}`).innerText = soundDevice.volume
        document.getElementById(`cell-track-${soundDevice.ipAddress}`).innerText = soundDevice.track
    })
}

/**
 * Adds the controls elements to assigned table's row
 * @param {HTMLTableRowElement} tr - table row element to add controls
 * @param {string} ipAddress - ip address of sound device
 * @param {string} url - url of track
 * @param {string} cellId - id of table's cell
 */
function addControlsToTr(tr, ipAddress, url, cellId) {
    let tdControls = document.createElement('td')
    tdControls.id = cellId

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
 * Fill 'Change Playback Mode' column
 * Add options to change mode by selecting it from <select> element
 * @param {HTMLTableRowElement} tr
 * @param {string} ipAddress - ip address of sound
 * @param {string} sourceName - name of input source mode
 * @param {string} cellId - id of table's cell
 */
function addChangeInputSourceToTr(tr, ipAddress, sourceName, cellId) {
    let td = document.createElement('td')
    td.id = cellId

    let select = document.createElement('select')
    select.id = `input-source-select-${ipAddress}`
    select.className = 'select-input-source'
    select.addEventListener('change', function (e) {
        changeInputSource(ipAddress, e.target.value)
    })

    //input source from arylic-service
    Object.keys(inputSource).forEach(key => {
        let option = document.createElement('option')
        option.value = key
        option.text = inputSource[key]
        option.id = `input-source-option-${key}`
        if (sourceName === key) {
            option.selected = true;
        }
        select.appendChild(option)
    })

    td.appendChild(select)
    tr.appendChild(td)
}
/**
 * Create table's cell and adds to row
 * @param {HTMLTableRowElement} tr
 * @param {string} thText
 * @returns {HTMLTableRowElement}
 */
function addThToTr(tr, thText) {
    let th = document.createElement('th')
    th.innerText = thText
    tr.appendChild(th)

    return tr
}

/**
 * Add table data to row
 * @param {HTMLTableRowElement} tr
 * @param {string} tdText - text of table's cell
 * @param {string} cellId - id of table's cell
 * @returns {HTMLTableRowElement}
 */
function addTdToTr(tr, tdText, cellId) {
    let td = document.createElement('td')
    td.innerText = tdText
    td.id = cellId
    tr.appendChild(td)

    return tr
}
