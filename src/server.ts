import app from "./app"
import config from "./config"
import { initDB } from "./db"


const main = () =>{
    initDB()
    app.listen(config.database.port, () => {
        console.log(`Example app listening on Port ${config.database.port}`)
    })
}

main()