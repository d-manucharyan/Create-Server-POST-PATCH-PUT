const path = require('path')
const fs = require('fs').promises

const readFile = async (folderName, fileName) => {
   const page = await fs.readFile(path.join(__dirname, '..', folderName, fileName), 'utf-8')
   return page
}

module.exports = {
    readFile
}