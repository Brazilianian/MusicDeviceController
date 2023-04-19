function fillTableColumnsNames(tableId) {
    let tableElement = document.getElementById(tableId)
    let trTitle = document.createElement('tr')

    addThToTr(trTitle, 'Name')
    addThToTr(trTitle, 'Ip Address')
    addThToTr(trTitle, 'Status')
    addThToTr(trTitle, 'Playback Mode')
    addThToTr(trTitle, 'Volume')

    let thControls = addThToTr(trTitle, 'Controls');
    thControls.colSpan = 1

    tableElement.appendChild(trTitle)
}

function updatedTable(soundDevices, tableId) {
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

function addControlsToTr(tr, ipAddress) {
    let tdControls = document.createElement('td')

    let divControls = document.createElement('div')
    divControls.className = 'div-controls'
    tdControls.appendChild(divControls)

    let divButtons = document.createElement('div')
    divControls.appendChild(divButtons)

    let buttonPlayPrevious = document.createElement('button')
    buttonPlayPrevious.className = "previous"
    buttonPlayPrevious.addEventListener('click', function () {
        playPrevious(ipAddress)
    })
    divButtons.appendChild(buttonPlayPrevious)

    let buttonPlayStop = document.createElement('button')
    buttonPlayStop.className = "play-pause"
    buttonPlayStop.addEventListener('click', function () {
        pausePlay(ipAddress)
    })
    divButtons.appendChild(buttonPlayStop)

    let buttonPlayNext = document.createElement('button')
    buttonPlayNext.className = "next"
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
    volumeBar.id = 'volumeBar'
    volumeBar.type = 'range'
    volumeBar.min = '0'
    volumeBar.max = '100'
    volumeBar.value = '0'
    volumeBar.onchange = function (e) {
        changeVolume(ipAddress, e.target.value)
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