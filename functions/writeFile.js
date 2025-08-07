const writeFile = (statusCode, type, pageName, res) => {
    res.writeHead(statusCode, {
        "content-type": `${type}`
    })
    res.write(pageName)
    res.end()
}

module.exports = {
    writeFile
}