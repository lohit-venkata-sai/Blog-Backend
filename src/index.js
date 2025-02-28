import { app } from './app.js';
import dotenv from 'dotenv'
import ConnectMongoDb from './dbconfig/config.js';
import { createRandomizedUsers } from './scripts/fakerScript.js'
dotenv.config({
    path: './.env',
});

const port = process.env.PORT || 3000;
ConnectMongoDb()
    .then(() => {
        app.listen(port, () => {
            console.log(`server running at port number : ${port}`);
        })
    })
    // .then(async () => {
    //     for (let i = 0; i < 10; i++) {
    //         await createRandomizedUsers();
    //     }
    // })
    .catch((error) => { console.log('error at index.js running running failure', error) });
