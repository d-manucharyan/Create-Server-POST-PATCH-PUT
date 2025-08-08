const fs = require('fs').promises
const http = require('http')
const path = require('path')
const { readFile } = require('./functions/readFile')
const { writeFile } = require('./functions/writeFile')

http.createServer(async (req, res) => {
    if (req.url === '/' && req.method === "GET") {
        const home = await readFile('pages', 'index.html')
        writeFile(200, 'text/html', home, res)
    } else if (req.url === '/api/users' && req.method === 'GET') {
        const users = JSON.parse(await readFile('db', 'users.json')).sort((a, b) => a.id - b.id)
        writeFile(200, 'application/json', JSON.stringify(users), res)
    } else if (req.url.match(/\/api\/users\/(\d+)/) && req.method === 'GET') {
        let id = req.url.split('/').at(-1)
        let users = JSON.parse(await readFile('db', 'users.json'))
        let person = users.find(user => user.id == id)
        if (!person) {
            const errorPage = await readFile('pages', 'errors.html')
            writeFile(404, 'text/html', errorPage, res)
        } else {
            writeFile(200, 'application/json', JSON.stringify(person), res)
        }
    } else if (req.url.includes('?') && req.method === 'GET') {
        let users = JSON.parse(await readFile('db', 'users.json'))
        let val = req.url.slice(req.url.indexOf('?') + 1).split('=').at(-1)
        const limitedUsers = users.filter(user => user.name.toLowerCase().indexOf(val.toLowerCase()) > -1)
        writeFile(200, 'application/json', JSON.stringify(limitedUsers), res)
    } else if (req.url === '/api/users' && req.method === 'POST') {
        req.on('data', async (chunk) => {
            let body = JSON.parse(chunk.toString())
            const users = JSON.parse(await readFile('db', 'users.json'))
            const repeatingEmailPerson = users.find(user => user.email.toLowerCase() === body.email.toLowerCase())

            if (repeatingEmailPerson) {
                const emailERrorPage = await readFile('pages', 'emailError.html')
                writeFile(404, 'text/html', emailERrorPage, res)
            } else {
                users.push(body)
                await fs.unlink(path.join(__dirname, 'db', 'users.json'))
                await fs.appendFile(path.join(__dirname, 'db', 'users.json'), JSON.stringify(users.sort((a, b) => a.id - b.id)))
                writeFile(200, 'application/json', JSON.stringify(users), res)
            }
        })
    } else if (req.url.match(/\/api\/users\/(\d+)/) && req.method === "DELETE") {
        let id = req.url.split('/').at(-1)
        let users = JSON.parse(await readFile('db', 'users.json'))
        let person = users.find(user => user.id == id)
        if (!person) {
            const errorPage = await readFile('pages', 'errors.html')
            writeFile(404, 'text/html', errorPage, res)
        } else {
            let ind = users.indexOf(person)
            users.splice(ind, 1)
            await fs.unlink(path.join(__dirname, 'db', 'users.json'))
            await fs.appendFile(path.join(__dirname, 'db', 'users.json'), JSON.stringify(users))
            writeFile(200, 'application/json', JSON.stringify(users), res)
        }
    } else if (req.url.match(/\/api\/users\/(\d+)/) && req.method === "PATCH") {
        let id = req.url.split('/').at(-1)
        let users = JSON.parse(await readFile('db', 'users.json'))
        let person = users.find(user => user.id == id)

        if (!person) {
            const errorPage = await readFile('pages', 'errors.html')
            writeFile(404, 'text/html', errorPage, res)
        } else {
            req.on('data', async chunk => {
                let body = JSON.parse(chunk.toString())
                Object.assign(person, body)
                await fs.unlink(path.join(__dirname, 'db', 'users.json'))
                await fs.appendFile(path.join(__dirname, 'db', 'users.json'), JSON.stringify(users))
                writeFile(200, 'application/json', JSON.stringify(users), res)
            })
        }
    } else {
        const errorPage = await readFile('pages', 'errors.html')
        writeFile(404, 'text/html', errorPage, res)
    }
}).listen(3000, () => console.log('server is running'))

