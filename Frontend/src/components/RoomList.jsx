import { deleteRoom } from '../api/api';

function RoomList({ rooms, selectedRoom, onSelectRoom, onRoomDeleted }) {
    const handleDelete = async (e, id) => {
        e.stopPropagation();
        const { ok } = await deleteRoom(id);
        if (ok) onRoomDeleted(id);
    };

    return (
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
                            <i className="ti ti-trash text-error text-sm" onClick={(e) => handleDelete(e, room.id)}></i>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RoomList;