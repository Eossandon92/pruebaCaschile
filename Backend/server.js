import app from './src/app.js';
import './src/db/init.js';

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});