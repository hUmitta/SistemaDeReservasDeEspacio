const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('<h1>Bienvenido al Backend</h1>');
});

app.post('/registro', (req, res) => {
    const { email, password, tipoUsuario } = req.body;
    console.log('Datos recibidos para registro:', { email, password, tipoUsuario });

    // AQUI LA LOGICA PARA FIREBASE


    res.json({
        message: 'Registro recibido',
        email,
        tipoUsuario
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
