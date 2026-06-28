import { useState } from 'react';
import { createRoom } from '../api/api';

function RoomForm({ onRoomCreated, onClose }) {
    const [form, setForm] = useState({
        nombre: '',
        capacidad: '',
        ubicacion: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!form.nombre || !form.capacidad || !form.ubicacion) {
            setError('Todos los campos son obligatorios');
            return;
        }

        setLoading(true);
        const { ok, data } = await createRoom(form);
        setLoading(false);

        if (!ok) {
            setError(data.error);
            return;
        }

        onRoomCreated(data);
        onClose();
    };

    return (
        <dialog className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Nueva sala</h3>

                {error && (
                    <div className="alert alert-error mb-4">
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input type="text" name="nombre" placeholder="Nombre de la sala" className="input input-bordered w-full" value={form.nombre} onChange={handleChange} />
                    <input type="number" name="capacidad" placeholder="Capacidad de personas" className="input input-bordered w-full" value={form.capacidad} onChange={handleChange} min="1" />                    <input type="text" name="ubicacion" placeholder="Ubicacion" className="input input-bordered w-full" value={form.ubicacion} onChange={handleChange} />
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <span className="loading loading-spinner"></span> : 'Crear sala'}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </dialog>
    );
}

export default RoomForm;