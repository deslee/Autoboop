const sqlite3 = require('better-sqlite3')
const { parse } = require('url')
const path = require('path')
const file = path.join(__dirname, './_data.db')
const db = new sqlite3(file)
const FindCatByPosition = (req, res) => {
    const parsedUrl = parse(req.url, true)
    const { query } = parsedUrl

    const sql = `SELECT c.* FROM Cats as c 
    WHERE c.MouthHorizontalPercentage IS NOT NULL AND c.MouthVerticalPercentage IS NOT NULL
    ORDER BY abs(c.MouthHorizontalPercentage - ?) + abs(c.MouthVerticalPercentage - ?)
    LIMIT 10
    `

    const rows = db.prepare(sql).all([
        query.x, query.y
    ])
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(rows[Math.floor(Math.random() * rows.length)]))
}

export default (req, res) => {
    return FindCatByPosition(req, res)
}