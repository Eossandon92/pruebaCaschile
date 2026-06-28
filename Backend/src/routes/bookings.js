import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

router.get('/', (req, res) => {
    const { salaId, fecha } = req.query;
    const bookings = db.prepare(`
        SELECT * FROM reservas 
        WHERE sala_id = ? AND fecha = ?
        ORDER BY hora_inicio ASC
    `).all(salaId, fecha);
    res.json(bookings);
});

router.post('/', (req, res) => {
    const { sala_id, nombre_solicitante, fecha, hora_inicio, hora_fin, motivo } = req.body;

    if (!sala_id || !nombre_solicitante || !fecha || !hora_inicio || !hora_fin || !motivo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    if (hora_inicio >= hora_fin) {
        return res.status(400).json({ error: 'La hora debe ser mayor de fin debe ser mayor ' })

    }
    const overlap = db.prepare(`
        SELECT * FROM reservas
        WHERE sala_id = ?
        AND fecha = ?
        AND hora_inicio < ?
        AND hora_fin > ?
    `).get(sala_id, fecha, hora_fin, hora_inicio);

    if (overlap) {
        return res.status(400).json({ error: `Horario no disponible, existe una reserva de ${overlap.hora_inicio} a ${overlap.hora_fin}` });
    }

    const result = db.prepare(`
        INSERT INTO reservas (sala_id, nombre_solicitante, fecha, hora_inicio, hora_fin, motivo)
        VALUES (?, ?, ?, ?, ?, ?)
    `).run(sala_id, nombre_solicitante, fecha, hora_inicio, hora_fin, motivo);

    const newBooking = db.prepare('SELECT * FROM reservas WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(newBooking);

});
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const booking = db.prepare('SELECT * FROM reservas WHERE id = ?').get(id);

    if (!booking) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    db.prepare('DELETE FROM reservas WHERE id = ?').run(id);

    res.status(200).json({ message: 'Reserva eliminada correctamente' });
});
export default router;