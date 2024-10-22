const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para manejar la subida de archivos
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos

// Ruta para listar los archivos
app.get('/listadodearchivos', (req, res) => {
    const directoryPath = path.join(__dirname, 'public', 'uploads');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.json(files);
    });
});

// Ruta para descargar un archivo
app.get('/archivo/:name', (req, res) => {
    const fileName = req.params.name;
    const filePath = path.join(__dirname, 'public', 'uploads', fileName);

    res.download(filePath, (err) => {
        if (err) {
            return res.status(404).send('Archivo no encontrado');
        }
    });
});

// Ruta para eliminar un archivo
app.delete('/archivo/:name', (req, res) => {
    const fileName = req.params.name;
    const filePath = path.join(__dirname, 'public', 'uploads', fileName);

    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(500).send('Error al eliminar el archivo');
        }

        res.send('Archivo eliminado correctamente');
    });
});

// Ruta para subir un archivo (ejemplo básico)
app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No se ha seleccionado ningún archivo');
    }

    const sampleFile = req.files.sampleFile;
    sampleFile.mv(__dirname + '/public/uploads/' + sampleFile.name, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.send('Archivo subido correctamente!');
    });
});

//Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});