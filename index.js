import express from "express"
import jsonwebtoken from "jsonwebtoken"
import { createEvento, getEventos, getEventoById, updateEvento, deleteEvento  } from "./src/controllers/eventos.js"
import { user, PRIVATE_KEY, tokenValited } from './src/auth.js'
import pkg from 'pg';
const { Pool, Client } = pkg;

const app = express();
const client = new Client({
    user: 'ltdnid_user',
    host: 'dpg-ci157nvdvk4kgouog87g-a.oregon-postgres.render.com',
    database: 'ltdnid',
    password: 'ku1hL7ee56b4JY3W6pQ7l82kFTrGsIdC',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
      },
});
const port = process.env.PORT || 3000;

const pool = new Pool({
    user: 'ltdnid_user',
    host: 'dpg-ci157nvdvk4kgouog87g-a.oregon-postgres.render.com',
    database: 'ltdnid',
    password: 'ku1hL7ee56b4JY3W6pQ7l82kFTrGsIdC',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
      },
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/', (_, res) => res.status(200).json({
    message: "default route"
}))

app.get('/login', async (req, res) => {
    const [,hash] = req.headers.authorization?.split(' ') || [' ', ' '];
    const [email, password] = Buffer.from(hash, 'base64').toString().split(':');

    console.log(Buffer.from(hash, 'base64').toString().split(':'));

    try{

        let query = "SELECT email, Senha FROM login WHERE email = $1 AND senha = $2"
        let values = [email, password]

        let select = await client.query(query, values)

        console.log(query)
        console.log(values)
        console.log(select.rows)

        if(!select.rows[0]) return res.status(401).json({message: 'Password or Email incorrect!'});

        const token = jsonwebtoken.sign(
            { user: JSON.stringify(user) },
            PRIVATE_KEY,
            { expiresIn: '60m' }
        );

        return res.status(200).json({ data: { user, token } });

    }catch(err){
        console.log(err);
        return res.send(err);
    }

})

app.get("/select/eventos", getEventos);

app.use('*', tokenValited);


app.get('/private', (req, res) => {
    const { user } = req.headers
    const currentUser = JSON.parse(user);
    return res.status(200).json({
        message: "rota privada",
        data: {
            userLogged: currentUser
        }
    }) 
})

app.get("/select/eventos/:id", getEventoById);
app.post("/insert/eventos/", createEvento);
app.put("/update/eventos/:id", updateEvento);
app.delete("/delete/eventos/:id", deleteEvento);

app.listen(port, async ()=> {
    
    console.log(`im alive in port:${port}`)
    await client.connect();

    try {
        const res = await client.query('SELECT $1::text as message', ['Conectado no banco!'])
        const res2 = await pool.query('SELECT NOW()')
        console.log(res.rows[0].message)
        console.log(res2.rows[0].now)
    } catch(err) {
        console.log(err);
    } 
    
})
