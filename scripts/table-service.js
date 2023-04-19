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

function clearTable(tableId) {
    let table = document.getElementById(tableId); // replace "myTable" with the ID of your table
    let rows = table.getElementsByTagName("tr");
    for (let i = rows.length - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

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

function setDisabledStatusControlButtons(isDisabled, ipAddress) {
    document.getElementById(`prev-${ipAddress}`).disabled = isDisabled
    document.getElementById(`play-pause-${ipAddress}`).disabled = isDisabled
    document.getElementById(`next-${ipAddress}`).disabled = isDisabled
    document.getElementById(`volume-bar-${ipAddress}`).disabled = isDisabled
}

function addControlsToTr(tr, ipAddress) {
    let tdControls = document.createElement('td')

    let divControls = document.createElement('div')
    divControls.className = 'div-controls'
    tdControls.appendChild(divControls)

    let divButtons = document.createElement('div')
    divControls.appendChild(divButtons)

    let buttonPlayPrevious = document.createElement('button')
    buttonPlayPrevious.className = "previous"
    buttonPlayPrevious.id = `prev-${ipAddress}`
    buttonPlayPrevious.addEventListener('click', function () {
        playPrevious(ipAddress)
    })
    divButtons.appendChild(buttonPlayPrevious)

    let buttonPlayPause = document.createElement('button')
    buttonPlayPause.className = "play-pause"
    buttonPlayPause.id = `play-pause-${ipAddress}`
    buttonPlayPause.addEventListener('click', function () {
        pausePlay(ipAddress)
    })
    divButtons.appendChild(buttonPlayPause)

    let buttonPlayNext = document.createElement('button')
    buttonPlayNext.className = "next"
    buttonPlayNext.id = `next-${ipAddress}`
    buttonPlayNext.addEventListener('click', function () {
        playNext(ipAddress)
    })
    divButtons.appendChild(buttonPlayNext)

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

function addThToTr(tr, thName) {
    let th = document.createElement('th')
    th.innerText = thName
    tr.appendChild(th)

    return tr
}

function addTdToTr(tr, tdName) {
    let td = document.createElement('td')
    td.innerText = tdName
    tr.appendChild(td)

    return tr
}