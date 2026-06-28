import { useState } from 'react';
import { deleteBooking } from '../api/api';

function BookingList({ bookings, loading, onBookingDeleted }) {
    const [confirmId, setConfirmId] = useState(null);

    const handleDelete = async () => {
        const { ok } = await deleteBooking(confirmId);
        if (ok) {
            onBookingDeleted(confirmId);
            setConfirmId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 opacity-50">
                <p className="text-lg font-semibold">No hay reservas para este dia</p>
                <p className="text-sm">Selecciona otra fecha o crea una nueva reserva</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-3">
                {bookings.map((booking) => (
                    <div key={booking.id} className="card bg-base-100 shadow border border-base-300">
                        <div className="card-body p-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-base">{booking.nombre_solicitante}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="badge badge-primary badge-lg">{booking.hora_inicio} - {booking.hora_fin}</span>
                                    <button className="btn btn-ghost btn-xs text-error" onClick={() => setConfirmId(booking.id)}>
                                        <i className="ti ti-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm opacity-70">{booking.motivo}</p>
                        </div>
                    </div>
                ))}
            </div>

            {confirmId && (
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Eliminar reserva</h3>
                        <p className="py-4">¿Estas seguro que deseas eliminar esta reserva?</p>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setConfirmId(null)}>Cancelar</button>
                            <button className="btn btn-error" onClick={handleDelete}>Eliminar</button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setConfirmId(null)}></div>
                </dialog>
            )}
        </>
    );
}

export default BookingList;