import { useState, useEffect } from 'react';

function RoomStatus({ status }) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const getEstado = (room) => {
        const nowStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        if (room.reserva_actual && room.reserva_actual.hora_inicio <= nowStr && room.reserva_actual.hora_fin > nowStr) {
            return { ocupada: true, hastaLas: room.reserva_actual.hora_fin };
        }

        if (room.proxima_reserva) {
            const [hours, minutes] = room.proxima_reserva.hora_inicio.split(':').map(Number);
            const reservaDate = new Date();
            reservaDate.setHours(hours, minutes, 0, 0);
            const diffMinutes = Math.round((reservaDate - now) / 60000);

            if (diffMinutes <= 0 && room.proxima_reserva.hora_fin > nowStr) {
                return { ocupada: true, hastaLas: room.proxima_reserva.hora_fin };
            }

            if (diffMinutes > 0 && diffMinutes <= 60) {
                return { ocupada: false, proximaMsg: `Se ocupara en ${diffMinutes} min` };
            }
        }

        return { ocupada: false };
    };

    return (
        <div className="flex flex-wrap gap-3 mb-4">
            {status.map((room) => {
                const estado = getEstado(room);
                return (
                    <div key={room.id} className="bg-base-100 rounded-box shadow border border-base-300 px-4 py-3 flex justify-between items-center gap-6 flex-1 min-w-48">
                        <div>
                            <p className="font-bold text-sm">{room.nombre}</p>
                            <p className="text-xs opacity-60">{room.reservas_hoy} reservas hoy</p>
                            {estado.ocupada && (
                                <p className="text-xs opacity-60">Hasta las {estado.hastaLas}</p>
                            )}
                            {!estado.ocupada && estado.proximaMsg && (
                                <p className="text-xs text-warning font-semibold">{estado.proximaMsg}</p>
                            )}
                        </div>
                        <span className={`badge badge-sm ${estado.ocupada ? 'badge-error' : 'badge-success'}`}>
                            {estado.ocupada ? 'Ocupada' : 'Libre'}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default RoomStatus;