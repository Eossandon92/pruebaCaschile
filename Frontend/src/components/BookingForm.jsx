import { useState, useEffect } from 'react';
import { createBooking, updateBooking } from '../api/api';

function BookingForm({ selectedRoom, selectedDate, booking = null, onBookingCreated, onBookingUpdated, onClose }) {
    const isEditing = !!booking;

    const getTodayLocal = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [form, setForm] = useState({
        nombre_solicitante: booking?.nombre_solicitante || '',
        fecha: booking?.fecha || selectedDate || getTodayLocal(),
        hora_inicio: booking?.hora_inicio || '',
        duracion: '30',
        hora_fin: booking?.hora_fin || '',
        motivo: booking?.motivo || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditing) return;
        if (!form.hora_inicio || !form.duracion) return;
        const [hours, minutes] = form.hora_inicio.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + parseInt(form.duracion);
        const finHours = Math.floor(totalMinutes / 60) % 24;
        const finMinutes = totalMinutes % 60;
        setForm(prev => ({
            ...prev,
            hora_fin: `${String(finHours).padStart(2, '0')}:${String(finMinutes).padStart(2, '0')}`
        }));
    }, [form.hora_inicio, form.duracion]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!form.nombre_solicitante || !form.fecha || !form.hora_inicio || !form.hora_fin || !form.motivo) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (form.hora_inicio >= form.hora_fin) {
            setError('La hora de inicio debe ser anterior a la hora de fin');
            return;
        }

        if (form.fecha < getTodayLocal()) {
            setError('No se pueden crear reservas en fechas pasadas');
            return;
        }

        setLoading(true);

        const { ok, data } = isEditing
            ? await updateBooking(booking.id, {
                nombre_solicitante: form.nombre_solicitante,
                fecha: form.fecha,
                hora_inicio: form.hora_inicio,
                hora_fin: form.hora_fin,
                motivo: form.motivo,
            })
            : await createBooking({
                sala_id: selectedRoom.id,
                fecha: form.fecha,
                nombre_solicitante: form.nombre_solicitante,
                hora_inicio: form.hora_inicio,
                hora_fin: form.hora_fin,
                motivo: form.motivo,
            });

        setLoading(false);

        if (!ok) {
            setError(data.error);
            return;
        }

        if (isEditing) {
            onBookingUpdated(data);
        } else {
            setForm({ nombre_solicitante: '', fecha: getTodayLocal(), hora_inicio: '', duracion: '30', hora_fin: '', motivo: '' });
            onBookingCreated(data);
        }
    };

    return (
        <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body">
                <h2 className="card-title">{isEditing ? 'Editar reserva' : `Nueva reserva — ${selectedRoom?.nombre}`}</h2>

                {error && (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input type="text" name="nombre_solicitante" placeholder="Nombre del solicitante" className="input input-bordered w-full" value={form.nombre_solicitante} onChange={handleChange} />

                    <div className="flex gap-3">
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-sm opacity-70">Fecha</label>
                            <input type="date" name="fecha" className="input input-bordered w-full" value={form.fecha} min={getTodayLocal()} onChange={handleChange} />
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-sm opacity-70">Hora inicio</label>
                            <input type="time" name="hora_inicio" className="input input-bordered w-full" value={form.hora_inicio} onChange={handleChange} />
                        </div>
                        {!isEditing && (
                            <div className="flex flex-col gap-1 flex-1">
                                <label className="text-sm opacity-70">Duracion</label>
                                <select name="duracion" className="select select-bordered w-full" value={form.duracion} onChange={handleChange}>
                                    <option value="15">15 minutos</option>
                                    <option value="30">30 minutos</option>
                                    <option value="45">45 minutos</option>
                                    <option value="60">1 hora</option>
                                    <option value="90">1 hora 30 minutos</option>
                                    <option value="120">2 horas</option>
                                </select>
                            </div>
                        )}
                        <div className="flex flex-col gap-1 flex-1">
                            <label className="text-sm opacity-70">Hora fin</label>
                            <input type="time" name="hora_fin" className="input input-bordered w-full" value={form.hora_fin} onChange={handleChange} />
                        </div>
                    </div>

                    <textarea name="motivo" placeholder="Motivo de la reunion" className="textarea textarea-bordered w-full" value={form.motivo} onChange={handleChange}></textarea>

                    <div className="flex gap-3">
                        {isEditing && <button type="button" className="btn flex-1" onClick={onClose}>Cancelar</button>}
                        <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : isEditing ? 'Guardar cambios' : 'Reservar sala'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BookingForm;