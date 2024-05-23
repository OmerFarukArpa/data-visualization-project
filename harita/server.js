const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/bolgeler', (req, res) => {
    fs.readFile('bolgeler.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading the JSON file');
        } else {
            res.send(JSON.parse(data));
        }
    });
});

app.post('/update-bolge', (req, res) => {
    const updatedBolge = req.body;

    fs.readFile('bolgeler.json', 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading the JSON file');
            return;
        }

        let bolgeler = JSON.parse(data);
        const index = bolgeler.findIndex(bolge => bolge.id === updatedBolge.id);

        if (index !== -1) {
            bolgeler[index] = updatedBolge;

            fs.writeFile('bolgeler.json', JSON.stringify(bolgeler, null, 2), 'utf8', (err) => {
                if (err) {
                    res.status(500).send('Error writing to the JSON file');
                } else {
                    res.send('Bolge updated successfully');
                }
            });
        } else {
            res.status(404).send('Bolge not found');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
