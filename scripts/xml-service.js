async function getXmlDomFromFile(filePath) {
    let xmlData = await fetch(filePath).then( async (response) => {
        return await response.text();
    })

    let parse = new DOMParser()
    return parse.parseFromString(xmlData, 'application/xml')
}

function getDataFromXmlDom(xmlDom, selectors) {
    let data = []

    let xmlNodeList = xmlDom.querySelectorAll(selectors)
    xmlNodeList.forEach(xmlNode => {
        for (let i = 0; i < xmlNode.children.length; i++) {
            let xmlNodeChild = xmlNode.children[i]
            let element = {}
            for (let j = 0; j < xmlNodeChild.children.length; j++) {
                let xmlNodeAttribute = xmlNodeChild.children[j]
                element[xmlNodeAttribute.localName] = xmlNodeAttribute.innerHTML
            }
            data.push(element)
        }
    })
    return data
}