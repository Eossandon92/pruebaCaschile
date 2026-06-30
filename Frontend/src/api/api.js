const BASE_URL = 'http://localhost:3001/api';

export const getRooms = async () => {
    const res = await fetch(`${BASE_URL}/rooms`);
    return res.json();
};

export const getBookings = async (salaId, fecha, fechaInicio, fechaFin) => {
    let url = `${BASE_URL}/bookings?salaId=${salaId}`;
    if (fechaInicio && fechaFin) {
        url += `&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;
    } else {
        url += `&fecha=${fecha}`;
    }
    const res = await fetch(url);
    return res.json();
};

export const createBooking = async (booking) => {
    const res = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
    });
    return { ok: res.ok, data: await res.json() };


};
export const getRoomsStatus = async () => {
    const res = await fetch(`${BASE_URL}/rooms/status`);
    return res.json();
};

export const createRoom = async (room) => {
    const res = await fetch(`${BASE_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(room),
    });
    return { ok: res.ok, data: await res.json() };
};

export const deleteBooking = async (id) => {
    const res = await fetch(`${BASE_URL}/bookings/${id}`, { method: 'DELETE' });
    return { ok: res.ok, data: await res.json() };
};

export const deleteRoom = async (id) => {
    const res = await fetch(`${BASE_URL}/rooms/${id}`, { method: 'DELETE' });
    return { ok: res.ok, data: await res.json() };
};

export const updateRoom = async (id, room) => {
    const res = await fetch(`${BASE_URL}/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(room),
    });
    return { ok: res.ok, data: await res.json() };
};

export const updateBooking = async (id, booking) => {
    const res = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
    });
    return { ok: res.ok, data: await res.json() };
};