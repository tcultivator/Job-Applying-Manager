const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()


const app = express()
app.use(express.json())
app.use(cors({
    origin: 'https://tcultivator.github.io',
    credentials: true
}))
app.use(cookieParser())

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect((err) => {
    if (err) {
        console.log('database is not connected')
    }
    else {
        console.log('database is connected')
    }
})



app.post('/login', (req, res) => {
    const data = req.body
    const query = 'SELECT * FROM jaAccounts WHERE username = ? && password = ? '
    db.query(query, [data.username, data.password], (err, result) => {
        if (!result.length) {
            res.status(404).json({ message: 'error login' })
        }
        else {

            const acc = result[0]
            console.log(acc.id)
            const token = jwt.sign({ userId: acc.id }, process.env.JWT_TOKEN_SECRET_KEY)
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'None'

            })
            res.status(200).json({ userId: acc.id, message: 'success Login' })
        }
    })
})

function authenticate(req, res, next) {
    const token = req.cookies.token
    console.log('eto ung token ', token)
    if (!token) {
        res.status(401).json({ message: 'unauthorize user!' })
    }
    else {
        const verifiedtoken = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY)
        console.log(verifiedtoken)
        req.userId = verifiedtoken.userId;
        next()
    }

}

app.post('/authenticate', authenticate, (req, res) => {
    const verifiedUserId = req.userId
    console.log('eto ung verfied na userId ', verifiedUserId)
    const query = 'SELECT * FROM JobList WHERE Id = ?'
    db.query(query, [verifiedUserId], (err, result) => {
        if (!result.length) {
            const data = result;
            console.log(data)
            res.status(400).json({ message: 'No content available' })
        }
        else {
            const data = result;
            console.log(data)
            res.status(200).json({ data })
        }
    })

})


app.post('/addnewjob', authenticate, (req, res) => {
    const verifiedUserId = req.userId
    const userData = req.body;
    console.log(userData)
    const query = 'INSERT INTO JobList (Id, CompanyName, Position, Status, date)VALUES(?,?,?,?,?)'

    db.query(query, [verifiedUserId, userData.camponyName,
        userData.position, userData.statuss, userData.date], (err, result) => {
            if (err) {
                res.status(404).json({ message: 'error adding!' })
            }
            else {
                res.status(200).json({ message: 'success adding!' })
            }
        })
})


app.put('/statusUpdate', authenticate, (req, res) => {
    const verifiedUserId = req.userId
    const userData = req.body
    console.log(verifiedUserId)
    console.log(userData)
    const query = 'UPDATE JobList SET Status =?  WHERE Id = ? && CompanyName = ? && Position = ?'
    db.query(query, [userData.statusUpdate,
        verifiedUserId, userData.companyName,
    userData.position], (err, result) => {
        if (err) {
            res.status(404).json({ message: 'error updating status' })
        }
        else {
            res.status(200).json({ message: 'success updating status' })
        }
    })
})

app.put('/dateUpdate', authenticate, (req, res) => {
    const verifiedUserId = req.userId
    const userDate = req.body
    const query = 'UPDATE JobList SET date = ?  WHERE Id = ? && CompanyName = ? && Position = ?'
    db.query(query, [userDate.date, verifiedUserId,
    userDate.companyName, userDate.position], (err, result) => {
        if (err) {
            res.status(404).json({ message: 'error updating date' })
        }
        else {
            res.status(200).json({ message: 'success updating date' })
        }
    })

})


app.post('/logout', authenticate, (req, res) => {

    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    })
    res.status(200).json({ message: 'logout success!' })

})


app.post('/deleteItem', authenticate, (req, res) => {
    const verifiedUserId = req.userId
    const dataItem = req.body;
    const query = 'DELETE FROM JobList WHERE Id = ? && CompanyName = ? && Position = ?'
    db.query(query, [verifiedUserId, dataItem.CompanyName, dataItem.Position], (err, result) => {
        if (err) {
            res.status(404).json({ message: 'Error Deleting!' })
        } else {
            res.status(200).json({ message: 'Success Deleting!' })
        }
    })
})








app.post('/signup', (req, res) => {
    const userData = req.body
    const query = 'INSERT INTO jaAccounts (username,password) VALUES (?,?)'
    db.query(query, [userData.username, userData.password], (err, result) => {
        if (err) {
            res.status(401).json({ message: 'Error Signup' })
        } else {
            res.status(200).json({ message: 'Success Signup' })
        }
    })
})

app.listen(8080, () => {
    console.log('server is running!')
})
