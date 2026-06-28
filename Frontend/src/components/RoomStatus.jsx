function RoomStatus({ status }) {
    return (
        <div className="flex flex-wrap gap-3 mb-4">
            {status.map((room) => (
                <div key={room.id} className="bg-base-100 rounded-box shadow border border-base-300 px-4 py-3 flex justify-between items-center gap-6 flex-1 min-w-48">
                    <div>
                        <p className="font-bold text-sm">{room.nombre}</p>
                        <p className="text-xs opacity-60">{room.reservas_hoy} reservas hoy</p>
                        {room.ocupada && (
                            <p className="text-xs opacity-60">Hasta las {room.reserva_actual.hora_fin}</p>
                        )}
                    </div>
                    <span className={`badge badge-sm ${room.ocupada ? 'badge-error' : 'badge-success'}`}>
                        {room.ocupada ? 'Ocupada' : 'Libre'}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default RoomStatus;