const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;
const NOTES_DIR = path.join(__dirname, 'notes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (!fs.existsSync(NOTES_DIR)) {
  fs.mkdirSync(NOTES_DIR);
}

// Page d'accueil avec formulaire
app.get('/', (req, res) => {
  res.render('index');
});

// Création de note depuis le formulaire
app.post('/notes', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).send('Contenu requis.');

  const id = crypto.randomBytes(8).toString('hex').slice(0, 8);
  const filePath = path.join(NOTES_DIR, `${id}.txt`);

  fs.writeFile(filePath, content, (err) => {
    if (err) return res.status(500).send('Erreur lors de la sauvegarde.');
    res.redirect(`/notes/${id}`);
  });
});

// Lecture de note en HTML
app.get('/notes/:id', (req, res) => {
  const filePath = path.join(NOTES_DIR, `${req.params.id}.txt`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).send('Note non trouvée.');

    res.render('note', { id: req.params.id, content: data });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur dispo sur http://localhost:${PORT}`);
});
