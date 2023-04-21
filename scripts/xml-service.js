/**
 * Reads the data from .xml file and return XmlDom
 * @param {string} filePath - file path of .xml file
 * @returns {Promise<Document>}
 */
async function getXmlDomFromFile(filePath) {
    let response = await fetch(filePath)

    let xmlData = await response.text()
    let parse = new DOMParser()
    return parse.parseFromString(xmlData, 'application/xml')
}

/**
 * Gets and return array of objects from xml Document
 * @param {Document} xmlDom - xml Document
 * @param {string} selectors - root selector of xml structure
 * @returns {*[]}
 */
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