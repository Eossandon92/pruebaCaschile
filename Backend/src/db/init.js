import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schema = readFileSync(path.join(__dirname, '../../schema.sql'), 'utf-8');

const statements = schema.split(';').filter(s => s.trim() !== '');

for (const statement of statements) {
    db.prepare(statement).run();
}

console.log('Base de datos inicializada correctamente');