import { useState, useEffect } from 'react';
import { getRooms, getBookings, getRoomsStatus } from './api/api';
import RoomList from './components/RoomList';
import BookingList from './components/BookingList';
import BookingForm from './components/BookingForm';
import RoomStatus from './components/RoomStatus';
import RoomForm from './components/RoomForm';

function App() {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [roomsStatus, setRoomsStatus] = useState([]);
    const [showRoomForm, setShowRoomForm] = useState(false);

    useEffect(() => {
        getRooms().then(setRooms);
    }, []);

    useEffect(() => {
        getRoomsStatus().then(setRoomsStatus);
        const interval = setInterval(() => getRoomsStatus().then(setRoomsStatus), 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!selectedRoom || !selectedDate) return;
        setLoadingBookings(true);
        getBookings(selectedRoom.id, selectedDate)
            .then(setBookings)
            .finally(() => setLoadingBookings(false));
    }, [selectedRoom, selectedDate]);

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
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-3">
                        <RoomList rooms={rooms} selectedRoom={selectedRoom} onSelectRoom={(room) => { setSelectedRoom(room); setShowForm(false); }} onRoomDeleted={handleRoomDeleted} />                    </div>
                    <div className="col-span-9 flex flex-col gap-4">
                        {selectedRoom ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <h2 className="text-xl font-bold">{selectedRoom.nombre}</h2>
                                        <input type="date" className="input input-bordered" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                                    </div>
                                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                                        {showForm ? 'Cancelar' : 'Nueva reserva'}
                                    </button>
                                </div>
                                {showForm && (
                                    <BookingForm selectedRoom={selectedRoom} selectedDate={selectedDate} onBookingCreated={handleBookingCreated} />
                                )}
                                <BookingList bookings={bookings} loading={loadingBookings} onBookingDeleted={handleBookingDeleted} />                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 opacity-50">
                                <p className="text-lg font-semibold">Selecciona una sala para comenzar</p>
                            </div>
                        )}
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