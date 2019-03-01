const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./data.db')

module.exports = (req, res) => {
    const sql = `SELECT c.* FROM Cats as c 
    WHERE c.MouthX IS NOT NULL AND c.MouthY IS NOT NULL
    ORDER BY abs(c.MouthX - ?) + abs(c.MouthY - ?)
    LIMIT 1
    `

    db.all(sql, [
        req.query.x, req.query.y
    ], (err, rows) => {
        res.send(rows[0])
    })
}