// This file doesn't go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('./data.db')
const FindCatByPosition = (req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    const sql = `SELECT c.* FROM Cats as c 
    WHERE c.MouthX IS NOT NULL AND c.MouthY IS NOT NULL
    ORDER BY abs(c.MouthX - ?) + abs(c.MouthY - ?)
    LIMIT 1
    `

    db.all(sql, [
        query.x, query.y
    ], (err, rows) => {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(rows[0]))
    })
}

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/FindCatByPosition') {
        FindCatByPosition(req, res)
    } else if (pathname === '/b') {
      app.render(req, res, '/a', query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(3000, err => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})