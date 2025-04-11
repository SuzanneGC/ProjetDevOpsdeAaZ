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
    const { content, expiration, editable } = req.body;  // expiration est en heures
    if (!content) return res.status(400).send('Contenu requis.');
  
    const id = crypto.randomBytes(8).toString('hex').slice(0, 8); // Identifiant unique via crypto
    const filePath = path.join(NOTES_DIR, `${id}.txt`);
    const metaFilePath = path.join(NOTES_DIR, `${id}.meta`);
  
    // Si l'expiration n'est pas fournie, par défaut on met 24h (en millisecondes)
    const expirationTimeInMs = expiration ? expiration * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  
    if (expiration && expiration > 24) {
        expirationTimeInMs = 24 * 60 * 60 * 1000;
      }    

    const createdAt = new Date().toISOString();
    const expirationTime = new Date(new Date().getTime() + expirationTimeInMs);
  
    // Créer le fichier de la note
    fs.writeFile(filePath, content, (err) => {
      if (err) return res.status(500).send('Erreur lors de la sauvegarde.');
  
      // Créer le fichier .meta avec les informations de date de création et d'expiration
      const metaData = { createdAt, expirationTime,editable: editable === 'true'};
      fs.writeFile(metaFilePath, JSON.stringify(metaData), (err) => {
        if (err) return res.status(500).send('Erreur lors de la sauvegarde du fichier .meta.');
  
        res.redirect(`/notes/${id}`);
      });
    });
  });

// Lecture de note en HTML
app.get('/notes/:id', (req, res) => {
  const filePath = path.join(NOTES_DIR, `${req.params.id}.txt`);
  const metaFilePath = path.join(NOTES_DIR, `${req.params.id}.meta`);

  // Lire le fichier .meta pour vérifier la date d'expiration
  fs.readFile(metaFilePath, 'utf8', (err, metaData) => {
    if (err) return res.status(404).send('Note non trouvée.');

    const { expirationTime } = JSON.parse(metaData);

    // Vérifier si la note a expiré
    if (new Date() > new Date(expirationTime)) {
      // Si la note a expiré, la supprimer
      fs.unlink(filePath, (err) => { if (err) console.log(err); });
      fs.unlink(metaFilePath, (err) => { if (err) console.log(err); });

      return res.status(404).send('La note a expiré.');
    }

    // Lire le contenu de la note si elle n'est pas expirée
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return res.status(404).send('Note non trouvée.');

      res.render('note', { id: req.params.id, content: data });
    });
  });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur dispo sur http://localhost:${PORT}`);
});



// Tâche en arrière-plan pour purger les notes expirées
setInterval(() => {
    fs.readdir(NOTES_DIR, (err, files) => {
      if (err) return console.error('Erreur lors de la lecture du répertoire des notes', err);
  
      files.forEach((file) => {
        if (file.endsWith('.meta')) {
          const metaFilePath = path.join(NOTES_DIR, file);
          
          // Lire le fichier .meta
          fs.readFile(metaFilePath, 'utf8', (err, metaData) => {
            if (err) return console.error(`Erreur lors de la lecture du fichier .meta ${file}`, err);
  
            const { expirationTime } = JSON.parse(metaData);
            
            // Vérifier si la note est expirée
            if (new Date() > new Date(expirationTime)) {
              const noteId = file.replace('.meta', '');
              const noteFilePath = path.join(NOTES_DIR, `${noteId}.txt`);
  
              // Supprimer le fichier de la note et le fichier .meta
              fs.unlink(noteFilePath, (err) => { if (err) console.log(err); });
              fs.unlink(metaFilePath, (err) => { if (err) console.log(err); });
  
              console.log(`Note expirée et supprimée : ${noteId}`);
            }
          });
        }
      });
    });
  }, 60 * 60 * 1000); // Vérifier toutes les heures
  