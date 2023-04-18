function fillTableColumnsNames(tableId) {
    let tableElement = document.getElementById(tableId)
    let trTitle = document.createElement('tr')

    addThToTr(trTitle, 'Name')
    addThToTr(trTitle, 'Ip Address')
    addThToTr(trTitle, 'Status')
    addThToTr(trTitle, 'Playback Mode')
    addThToTr(trTitle, 'Volume')

    tableElement.appendChild(trTitle)
}

function updatedTable(data, tableId) {
    clearTable(tableId)

    let tableElement = document.getElementById(tableId)

    data.forEach(dataElement => {
        let tr = document.createElement('tr')
        Object.keys(dataElement).forEach(key => {
            addTdToTr(tr, dataElement[key])
        })
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

function addThToTr(tr, thName) {
    let th = document.createElement('th')
    th.innerText = thName
    tr.appendChild(th)
}

function addTdToTr(tr, tdName) {
    let td = document.createElement('td')
    td.innerText = tdName
    tr.appendChild(td)
}