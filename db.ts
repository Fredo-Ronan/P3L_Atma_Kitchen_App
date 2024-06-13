import { createConnection } from "mysql2/promise";

export async function connect() {
    const connection = await createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'user',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'db'
    });

    return connection;
}