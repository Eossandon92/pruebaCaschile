import { useState } from 'react';
import { deleteBooking } from '../api/api';
import BookingForm from './BookingForm';

function BookingList({ bookings, loading, onBookingDeleted, onBookingUpdated }) {
    const [confirmId, setConfirmId] = useState(null);
    const [editBooking, setEditBooking] = useState(null);
    const [search, setSearch] = useState('');

    const formatFecha = (fecha) => {
        const [year, month, day] = fecha.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('es-CL', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    };
    const formatHora = (hora) => {
        const [hours, minutes] = hora.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;

    };

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

    const filteredBookings = bookings.filter((b) =>
        b.nombre_solicitante.toLowerCase().includes(search.toLowerCase()) ||
        b.motivo.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {bookings.length > 0 && (
                <input
                    type="text"
                    placeholder="Buscar por organizador o motivo"
                    className="input input-bordered w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            )}

            {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 opacity-50">
                    <p className="text-lg font-semibold">No hay reservas para este dia</p>
                    <p className="text-sm">Selecciona otra fecha o crea una nueva reserva</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filteredBookings.map((booking) => (
                        <div key={booking.id} className="card bg-base-100 shadow border border-base-300">
                            <div className="card-body p-4">
                                {editBooking?.id === booking.id ? (
                                    <BookingForm booking={booking} onBookingUpdated={(updated) => { onBookingUpdated(updated); setEditBooking(null); }} onClose={() => setEditBooking(null)} />
                                ) : (
                                    <>
                                        <div className="flex justify-between items-center gap-4">
                                            <div className="flex flex-col">
                                                <p className="text-xs opacity-50 capitalize">{formatFecha(booking.fecha)}</p>
                                                <h3 className="font-bold text-base">{formatHora(booking.hora_inicio)} - {formatHora(booking.hora_fin)}</h3>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <i className="ti ti-pencil text-sm cursor-pointer" onClick={() => setEditBooking(booking)}></i>
                                                <i className="ti ti-trash text-error text-sm cursor-pointer" onClick={() => setConfirmId(booking.id)}></i>
                                            </div>
                                        </div>
                                        <p className="text-sm mt-2"><span className="font-semibold">Organizador:</span> {booking.nombre_solicitante}</p>
                                        <p className="text-sm opacity-70"><span className="font-semibold">Motivo:</span> {booking.motivo}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

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