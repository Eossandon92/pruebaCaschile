CREATE TABLE IF NOT EXISTS salas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    capacidad INTEGER NOT NULL,
    ubicacion TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sala_id INTEGER NOT NULL,
    nombre_solicitante TEXT NOT NULL,
    fecha TEXT NOT NULL,
    hora_inicio TEXT NOT NULL,
    hora_fin TEXT NOT NULL,
    motivo TEXT NOT NULL,
    FOREIGN KEY (sala_id) REFERENCES salas(id)
);

INSERT INTO salas (nombre, capacidad, ubicacion) VALUES
    ('Sala de Innovacion', 6, 'Piso 1'),
    ('Sala Directorio', 12, 'Piso 2'),
    ('Sala Proyecto', 8, 'Piso 3');

INSERT INTO reservas (sala_id, nombre_solicitante, fecha, hora_inicio, hora_fin, motivo) VALUES
    (1, 'Juan Perez', '2025-07-01', '09:00', '10:00', 'Planificacion de proyecto'),
    (1, 'Maria Lopez', '2025-07-01', '11:00', '12:00', 'Reunion de equipo'),
    (2, 'Carlos Rojas', '2025-07-01', '10:00', '11:30', 'Presentacion de resultados');