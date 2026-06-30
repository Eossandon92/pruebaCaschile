import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

router.get('/', (req, res) => {
    const rooms = db.prepare('SELECT * FROM salas').all();
    res.json(rooms);
});

router.get('/status', (req, res) => {
    const now = new Date();
    const fecha = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const hora = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;


    const rooms = db.prepare('SELECT * FROM salas').all();

    const status = rooms.map((room) => {
        const reservasHoy = db.prepare(`
            SELECT COUNT(*) as count FROM reservas
            WHERE sala_id = ? AND fecha = ?
        `).get(room.id, fecha);

        const ocupada = db.prepare(`
            SELECT * FROM reservas
            WHERE sala_id = ? AND fecha = ? AND hora_inicio <= ? AND hora_fin > ?
        `).get(room.id, fecha, hora, hora);

        const proximaReserva = db.prepare(`
            SELECT * FROM reservas
            WHERE sala_id = ? AND fecha = ? AND hora_inicio > ?
            ORDER BY hora_inicio ASC
            LIMIT 1
        `).get(room.id, fecha, hora);

        return {
            ...room,
            ocupada: !!ocupada,
            reservas_hoy: reservasHoy.count,
            reserva_actual: ocupada || null,
            proxima_reserva: proximaReserva || null,
        };
    });

    res.json(status);
});

router.post('/', (req, res) => {
    const { nombre, capacidad, ubicacion } = req.body;

    if (!nombre || !capacidad || !ubicacion) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (capacidad <= 0) {
        return res.status(400).json({ error: 'La capacidad debe ser mayor a 0' });
    }

    const result = db.prepare(`
        INSERT INTO salas (nombre, capacidad, ubicacion)
        VALUES (?, ?, ?)
    `).run(nombre, capacidad, ubicacion);

    const newRoom = db.prepare('SELECT * FROM salas WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(newRoom);
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const room = db.prepare('SELECT * FROM salas WHERE id = ?').get(id);

    if (!room) {
        return res.status(404).json({ error: 'Sala no encontrada' });
    }

    db.prepare('DELETE FROM reservas WHERE sala_id = ?').run(id);
    db.prepare('DELETE FROM salas WHERE id = ?').run(id);

    res.status(200).json({ message: 'Sala eliminada correctamente' });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, capacidad, ubicacion } = req.body;

    if (!nombre || !capacidad || !ubicacion) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (capacidad <= 0) {
        return res.status(400).json({ error: 'La capacidad debe ser mayor a 0' });
    }

    const room = db.prepare('SELECT * FROM salas WHERE id = ?').get(id);

    if (!room) {
        return res.status(404).json({ error: 'Sala no encontrada' });
    }

    db.prepare(`
        UPDATE salas SET nombre = ?, capacidad = ?, ubicacion = ?
        WHERE id = ?
    `).run(nombre, capacidad, ubicacion, id);

    const updatedRoom = db.prepare('SELECT * FROM salas WHERE id = ?').get(id);

    res.status(200).json(updatedRoom);
});

export default router;