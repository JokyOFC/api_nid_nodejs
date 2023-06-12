import { user, PRIVATE_KEY, tokenValited } from '../auth.js'
import pkg from 'pg';
const { Pool, Client } = pkg;

export const conn = new Pool({
    user: 'ltdnid_user',
    host: 'dpg-ci157nvdvk4kgouog87g-a.oregon-postgres.render.com',
    database: 'ltdnid',
    password: 'ku1hL7ee56b4JY3W6pQ7l82kFTrGsIdC',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
      },
})
