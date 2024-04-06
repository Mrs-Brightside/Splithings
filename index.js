import app from "./server.js"
import mongodb from "mongodb"
import SplitDAO from "./dao/splitDAO.js"
import dotenv from 'dotenv';
dotenv.config();

const MongoClient = mongodb.MongoClient
const mongo_username = process.env['MONGO_USERNAME']
const mongo_password = process.env['MONGO_PASSWORD']
const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster1.jx6kins.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`

const port = 4000

MongoClient.connect(
    uri,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
    })
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
    })
    .then(async client => {
        await SplitDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })