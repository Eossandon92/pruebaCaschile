import { useState, useEffect } from 'react';
import { getRooms, getBookings, getRoomsStatus } from './api/api';
import RoomList from './components/RoomList';
import BookingList from './components/BookingList';
import BookingForm from './components/BookingForm';
import RoomStatus from './components/RoomStatus';
import RoomForm from './components/RoomForm';

const getTodayLocal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

function App() {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedDate, setSelectedDate] = useState(getTodayLocal());
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [roomsStatus, setRoomsStatus] = useState([]);
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [filtro, setFiltro] = useState('hoy');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    useEffect(() => {
        getRooms().then(setRooms);
    }, []);

    useEffect(() => {
        getRoomsStatus().then(setRoomsStatus);
        const interval = setInterval(() => getRoomsStatus().then(setRoomsStatus), 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!selectedRoom) return;
        setLoadingBookings(true);
        if ((filtro === 'personalizado' || filtro === 'semana' || filtro === 'mes') && fechaInicio && fechaFin) {
            getBookings(selectedRoom.id, null, fechaInicio, fechaFin)
                .then(setBookings)
                .finally(() => setLoadingBookings(false));
        } else {
            getBookings(selectedRoom.id, selectedDate)
                .then(setBookings)
                .finally(() => setLoadingBookings(false));
        }
    }, [selectedRoom, selectedDate, filtro, fechaInicio, fechaFin]);

    const handleBookingCreated = (newBooking) => {
        setBookings((prev) => [...prev, newBooking].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)));
        setShowForm(false);
    };

    const handleRoomCreated = (newRoom) => {
        setRooms((prev) => [...prev, newRoom]);
    };

    const handleBookingDeleted = (id) => {
        setBookings((prev) => prev.filter((b) => b.id !== id));
    };

    const handleRoomDeleted = (id) => {
        setRooms((prev) => prev.filter((r) => r.id !== id));
        setRoomsStatus((prev) => prev.filter((r) => r.id !== id));
        if (selectedRoom?.id === id) setSelectedRoom(null);
    };

    const handleRoomUpdated = (updatedRoom) => {
        setRooms((prev) => prev.map((r) => r.id === updatedRoom.id ? updatedRoom : r));
        setRoomsStatus((prev) => prev.map((r) => r.id === updatedRoom.id ? { ...r, ...updatedRoom } : r));
    };

    const handleBookingUpdated = (updatedBooking) => {
        setBookings((prev) => prev.map((b) => b.id === updatedBooking.id ? updatedBooking : b).sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio)));
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="navbar bg-base-100 shadow mb-6">
                <div className="container mx-auto px-6 flex justify-between items-center w-full">
                    <h1 className="text-xl font-bold">Sistema de Reservas</h1>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowRoomForm(true)}>
                        Nueva sala
                    </button>
                </div>
            </div>
            <div className="container mx-auto px-6 pb-6">
                <RoomStatus status={roomsStatus} />
                <div className="bg-base-100 rounded-box shadow border border-base-300 p-6">
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-3">
                            <RoomList rooms={rooms} selectedRoom={selectedRoom} onSelectRoom={(room) => { setSelectedRoom(room); setShowForm(false); }} onRoomDeleted={handleRoomDeleted} onRoomUpdated={handleRoomUpdated} />
                        </div>
                        <div className="col-span-9 flex flex-col gap-4">
                            {selectedRoom ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-xl font-bold shrink-0">{selectedRoom.nombre}</h2>
                                            <select
                                                className="select select-bordered select-sm"
                                                value={filtro}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setFiltro(val);
                                                    const today = getTodayLocal();
                                                    const now = new Date();
                                                    if (val === 'hoy') {
                                                        setSelectedDate(today);
                                                    } else if (val === 'semana') {
                                                        const monday = new Date(now);
                                                        monday.setDate(now.getDate() - now.getDay() + 1);
                                                        const sunday = new Date(monday);
                                                        sunday.setDate(monday.getDate() + 6);
                                                        setFechaInicio(`${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`);
                                                        setFechaFin(`${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`);
                                                    } else if (val === 'mes') {
                                                        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                                                        setFechaInicio(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`);
                                                        setFechaFin(`${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`);
                                                    }
                                                }}
                                            >
                                                <option value="hoy">Hoy</option>
                                                <option value="semana">Esta semana</option>
                                                <option value="mes">Este mes</option>
                                                <option value="personalizado">Personalizado</option>
                                            </select>
                                            {filtro === 'personalizado' && (
                                                <div className="flex items-center gap-2">
                                                    <input type="date" className="input input-bordered input-sm" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                                                    <span className="opacity-50">hasta</span>
                                                    <input type="date" className="input input-bordered input-sm" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setShowForm(!showForm)}
                                        >
                                            {showForm ? 'Cancelar' : 'Nueva reserva'}
                                        </button>
                                    </div>
                                    {showForm && (
                                        <BookingForm selectedRoom={selectedRoom} selectedDate={selectedDate} onBookingCreated={handleBookingCreated} />
                                    )}
                                    <BookingList bookings={bookings} loading={loadingBookings} onBookingDeleted={handleBookingDeleted} onBookingUpdated={handleBookingUpdated} />
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 opacity-50">
                                    <p className="text-lg font-semibold">Selecciona una sala para comenzar</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showRoomForm && (
                <RoomForm onRoomCreated={handleRoomCreated} onClose={() => setShowRoomForm(false)} />
            )}
        </div>
    );
}

export default App;