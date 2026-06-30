# Sistema de Reservas de Salas 

Aplicación web para gestionar la reserva de salas de reuniones internas. Permite visualizar las salas disponibles, ver su disponibilidad en tiempo real, agendar reuniones, evitar solapamientos de horario y administrar el ciclo completo de salas y reservas.

---

## Requisitos previos

- Node.js v18 o superior
- npm

---

## Instalación

### 1. Clonar el repositorio


git clone https://github.com/Eossandon92/pruebaCaschile.git
cd pruebaCaschile


### 2. Instalar dependencias del backend


cd Backend
npm install


### 3. Instalar dependencias del frontend


cd ../Frontend
npm install


---

## Base de datos

La base de datos se inicializa automáticamente al levantar el servidor por primera vez. Se creará el archivo `database.sqlite` en la carpeta `Backend/` con las tablas y datos semilla incluidos.

Si necesitas reiniciar la base de datos desde cero, elimina el archivo:


rm Backend/database.sqlite


---

## Levantar el proyecto

### Backend

cd Backend
node server.js

El servidor quedará corriendo en `http://localhost:3001`

### Frontend

Abre una segunda terminal:

cd Frontend
npm run dev

El frontend quedará disponible en `http://localhost:5173`

---

## Funcionalidades

- CRUD completo de salas (crear, listar, editar, eliminar)
- CRUD completo de reservas (crear, listar, editar, eliminar)
- Validación de solapamiento de horarios mediante consultas SQL parametrizadas
- KPIs en tiempo real por sala: estado (libre/ocupada), reservas del día y aviso de próxima reserva
- Filtros de búsqueda de reservas por hoy, esta semana, este mes o rango personalizado
- Buscador de reservas por organizador o motivo
- Validación de fechas pasadas tanto en frontend como en backend
- Confirmación antes de eliminar salas o reservas

---

## Endpoints disponibles

### Salas

- `GET /api/rooms` — Lista todas las salas
- `GET /api/rooms/status` — Estado actual de cada sala en tiempo real (ocupada/libre, reservas del día, próxima reserva)
- `POST /api/rooms` — Crea una nueva sala
- `PUT /api/rooms/:id` — Edita una sala existente
- `DELETE /api/rooms/:id` — Elimina una sala y sus reservas asociadas

### Reservas

- `GET /api/bookings?salaId=X&fecha=YYYY-MM-DD` — Lista reservas de una sala en una fecha específica
- `GET /api/bookings?salaId=X&fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD` — Lista reservas de una sala en un rango de fechas
- `POST /api/bookings` — Crea una nueva reserva con validación de solapamiento
- `PUT /api/bookings/:id` — Edita una reserva existente con validación de solapamiento
- `DELETE /api/bookings/:id` — Elimina una reserva

---
