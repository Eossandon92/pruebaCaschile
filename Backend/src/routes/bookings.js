import { Router } from 'express';
import db from '../db/database.js';

const router = Router();

router.get('/', (req, res) => {
    const { salaId, fecha, fechaInicio, fechaFin } = req.query;

    let bookings;

    if (fechaInicio && fechaFin) {
        bookings = db.prepare(`
            SELECT * FROM reservas 
            WHERE sala_id = ? AND fecha >= ? AND fecha <= ?
            ORDER BY fecha ASC, hora_inicio ASC
        `).all(salaId, fechaInicio, fechaFin);
    } else {
        bookings = db.prepare(`
            SELECT * FROM reservas 
            WHERE sala_id = ? AND fecha = ?
            ORDER BY hora_inicio ASC
        `).all(salaId, fecha);
    }

    res.json(bookings);
});

router.post('/', (req, res) => {
    const { sala_id, nombre_solicitante, fecha, hora_inicio, hora_fin, motivo } = req.body;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (!sala_id || !nombre_solicitante || !fecha || !hora_inicio || !hora_fin || !motivo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    if (hora_inicio >= hora_fin) {
        return res.status(400).json({ error: 'La hora debe ser mayor de fin debe ser mayor ' })

    }

    if (fecha < todayStr) {
        return res.status(400).json({ error: 'No se pueden crear reservas en fechas pasadas' });
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

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_solicitante, fecha, hora_inicio, hora_fin, motivo } = req.body;

    if (!nombre_solicitante || !fecha || !hora_inicio || !hora_fin || !motivo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    if (hora_inicio >= hora_fin) {
        return res.status(400).json({ error: 'La hora de inicio debe ser anterior a la hora de fin' });
    }

    const booking = db.prepare('SELECT * FROM reservas WHERE id = ?').get(id);

    if (!booking) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    const overlap = db.prepare(`
        SELECT * FROM reservas
        WHERE sala_id = ?
        AND fecha = ?
        AND hora_inicio < ?
        AND hora_fin > ?
        AND id != ?
    `).get(booking.sala_id, fecha, hora_fin, hora_inicio, id);

    if (overlap) {
        return res.status(400).json({ error: `Horario no disponible, existe una reserva de ${overlap.hora_inicio} a ${overlap.hora_fin}` });
    }

    db.prepare(`
        UPDATE reservas SET nombre_solicitante = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, motivo = ?
        WHERE id = ?
    `).run(nombre_solicitante, fecha, hora_inicio, hora_fin, motivo, id);

    const updatedBooking = db.prepare('SELECT * FROM reservas WHERE id = ?').get(id);

    res.status(200).json(updatedBooking);
});
export default router;