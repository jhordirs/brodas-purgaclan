require('dotenv').config(); // 
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 4000;

// Configuración de la base de datos SQLite
const db = new sqlite3.Database('./clan-database.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
    // Crear tablas si no existen
    db.run(`CREATE TABLE IF NOT EXISTS local_members (
      id TEXT PRIMARY KEY,
      bungie_id TEXT NOT NULL,
      supplemental_name TEXT NOT NULL,
      discord_id TEXT
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      member_id TEXT NOT NULL,
      bungie_id TEXT NOT NULL,
      supplemental_name TEXT NOT NULL,
      discord_id TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración Bungie
const BUNGIE_API_KEY = process.env.BUNGIE_API_KEY;
const CLAN_ID = process.env.CLAN_ID;

// Endpoint para información del clan
app.get('/clan-info', async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.bungie.net/Platform/GroupV2/${CLAN_ID}/`, 
      { headers: { 'X-API-Key': BUNGIE_API_KEY } }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error en clan-info:', error);
    res.status(500).json({ error: 'Error al obtener información del clan' });
  }
});

// Endpoint para miembros del clan
app.get('/clan-members', async (req, res) => {
  try {
    const response = await axios.get(
      `https://www.bungie.net/Platform/GroupV2/${CLAN_ID}/Members/`, 
      { headers: { 'X-API-Key': BUNGIE_API_KEY } }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error en clan-members:', error);
    res.status(500).json({ error: 'Error al obtener miembros del clan' });
  }
});

// Obtener miembros locales
app.get('/local-members', (req, res) => {
  db.all('SELECT * FROM local_members', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Guardar miembros locales
app.post('/save-local-members', (req, res) => {
  const members = req.body;
  
  // Comenzar transacción
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Eliminar todos los miembros actuales
    db.run('DELETE FROM local_members', (err) => {
      if (err) {
        db.run('ROLLBACK');
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Insertar los nuevos miembros
      const stmt = db.prepare('INSERT INTO local_members (id, bungie_id, supplemental_name, discord_id) VALUES (?, ?, ?, ?)');
      members.forEach(member => {
        stmt.run(member.id, member.bungie_id, member.supplemental_name, member.discord_id);
      });
      stmt.finalize();
      
      db.run('COMMIT', (err) => {
        if (err) {
          db.run('ROLLBACK');
          res.status(500).json({ error: err.message });
        } else {
          res.json({ success: true });
        }
      });
    });
  });
});

// Agregar miembro local
app.post('/add-local-member', (req, res) => {
  const { id, bungie_id, supplemental_name, discord_id } = req.body;
  
  db.run(
    'INSERT OR REPLACE INTO local_members (id, bungie_id, supplemental_name, discord_id) VALUES (?, ?, ?, ?)',
    [id, bungie_id, supplemental_name, discord_id || ''],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ success: true });
      }
    }
  );
});

// Eliminar miembro local
app.delete('/delete-local-member/:id', (req, res) => {
  const id = req.params.id;
  
  db.run('DELETE FROM local_members WHERE id = ?', id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ success: true });
    }
  });
});

// Agregar registro de historial
app.post('/add-history', (req, res) => {
  const { action, member_id, bungie_id, supplemental_name, discord_id } = req.body;
  
  db.run(
    'INSERT INTO history (action, member_id, bungie_id, supplemental_name, discord_id) VALUES (?, ?, ?, ?, ?)',
    [action, member_id, bungie_id, supplemental_name, discord_id || ''],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ success: true });
      }
    }
  );
});

// Obtener historial con paginación
app.get('/history', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  
  db.all(
    'SELECT * FROM history ORDER BY timestamp DESC LIMIT ? OFFSET ?', 
    [limit, offset],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(rows);
      }
    }
  );
});

// Obtener conteo de registros de historial
app.get('/history-count', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM history', (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(row);
    }
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor funcionando en http://localhost:${PORT}`);
});