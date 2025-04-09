const express = require('express');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const app = express();
const PORT = 3000;
const NOTES_DIR = path.join(__dirname, 'notes');

app.use(express.json());

// Créer le dossier 'notes' s’il n’existe pas
if (!fs.existsSync(NOTES_DIR)) {
  fs.mkdirSync(NOTES_DIR);
}

// POST /notes - crée une nouvelle note
app.post('/notes', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Contenu requis.' });

  const id = nanoid(8); // identifiant unique court
  const filePath = path.join(NOTES_DIR, `${id}.txt`);

  fs.writeFile(filePath, content, (err) => {
    if (err) return res.status(500).json({ error: 'Erreur d\'écriture.' });

    res.json({ id, link: `/notes/${id}` });
  });
});

// GET /notes/:id - lit une note existante
app.get('/notes/:id', (req, res) => {
  const filePath = path.join(NOTES_DIR, `${req.params.id}.txt`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).json({ error: 'Note non trouvée.' });

    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
