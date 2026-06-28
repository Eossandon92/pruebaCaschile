import { useState } from 'react';
import { deleteRoom } from '../api/api';

function RoomList({ rooms, selectedRoom, onSelectRoom, onRoomDeleted }) {
    const [confirmId, setConfirmId] = useState(null);

    const handleDelete = async () => {
        const { ok } = await deleteRoom(confirmId);
        if (ok) {
            onRoomDeleted(confirmId);
            setConfirmId(null);
        }
    };

    return (
        <>
            <div className="bg-base-100 rounded-box shadow p-4 h-full">
                <h2 className="text-xl font-bold mb-4">Salas disponibles</h2>
                <ul className="menu w-full gap-2">
                    {rooms.map((room) => (
                        <li key={room.id}>
                            <a className={`flex flex-row items-center justify-between p-3 rounded-box border border-base-300 hover:bg-primary hover:text-primary-content transition-all ${selectedRoom?.id === room.id ? 'bg-primary text-primary-content' : ''}`} onClick={() => onSelectRoom(room)}>
                                <div>
                                    <p className="font-bold text-sm">{room.nombre}</p>
                                    <p className="text-xs opacity-70">{room.ubicacion} · {room.capacidad} personas</p>
                                </div>
                                <i className="ti ti-trash text-error text-sm" onClick={(e) => { e.stopPropagation(); setConfirmId(room.id); }}></i>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {confirmId && (
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Eliminar sala</h3>
                        <p className="py-4">¿Estas seguro que deseas eliminar esta sala? Se eliminaran todas sus reservas asociadas.</p>
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

export default RoomList;