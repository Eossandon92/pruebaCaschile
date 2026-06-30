import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

db.pragma('foreign_keys = ON');

const schema = readFileSync(path.join(__dirname, '../../schema.sql'), 'utf-8');
const statements = schema.split(';').filter(s => s.trim() !== '');
for (const statement of statements) {
    db.prepare(statement).run();
}

const { count } = db.prepare('SELECT COUNT(*) as count FROM salas').get();

if (count === 0) {
    const insertSala = db.prepare('INSERT INTO salas (nombre, capacidad, ubicacion) VALUES (?, ?, ?)');
    insertSala.run('Sala de Innovacion', 6, 'Piso 1');
    insertSala.run('Sala Directorio', 12, 'Piso 2');
    insertSala.run('Sala Proyecto', 8, 'Piso 3');

    const today = new Date();
    const fecha = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    console.log(fecha)
    const insertReserva = db.prepare('INSERT INTO reservas (sala_id, nombre_solicitante, fecha, hora_inicio, hora_fin, motivo) VALUES (?, ?, ?, ?, ?, ?)');
    insertReserva.run(1, 'Juan Perez', fecha, '12:30', '14:00', 'Planificacion de proyecto');
    insertReserva.run(1, 'Maria Lopez', fecha, '16:00', '17:00', 'Reunion de equipo');
    insertReserva.run(2, 'Carlos Rojas', fecha, '18:00', '18:30', 'Presentacion de resultados');
}

console.log('Base de datos inicializada correctamente');