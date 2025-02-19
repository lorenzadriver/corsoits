const { getConnection } = require('../connessione')

const listPersona = async () => {
  const connection = await getConnection();
  const [rows] = await connection.query('SELECT * FROM persona')
  return rows;
}

const personaExistById = async (id_persona) => {
  const connection = await getConnection();
  const query = 'SELECT 1 FROM persona WHERE id = ?';
  const [rows] = await connection.query(query, [id_persona]);
  return rows.length > 0;
}

const getPersonaById = async (id_persona) => {
  const connection = await getConnection();
  const query = 'SELECT * FROM persona WHERE id = ?';
  const [rows] = await connection.query(query, [id_persona]);
  return rows[0];
}
// ALT + 0 0 9 6 => `
const insertPersona = async (nome, cognome, codice_fiscale, data_nascita, percorsoFile) => {
  const connection = await getConnection();
  const query = `INSERT INTO persona (nome, cognome, codice_fiscale, data_nascita, foto_tessera_sanitaria)
  VALUES (?,?,?,?)`;
  const [res] = await connection.query(query, [nome, cognome, codice_fiscale, data_nascita, percorsoFile]);
  return res.insertId;
}

const updatePersona = async (id, nome, cognome, codice_fiscale, data_nascita) => {
  const connection = await getConnection();
  const query = `UPDATE persona SET nome = ?, cognome = ?, codice_fiscale = ?, data_nascita = ?
  WHERE id = ?`;
  const [res] = await connection.query(query, [nome, cognome, codice_fiscale, data_nascita, id]);
  return res.affectedRows === 1;
}

const updateFotoPersona = async (id, pathFoto) => {
  const connection = await getConnection();
  const query = `UPDATE persona SET foto_tessera_sanitaria = ? WHERE id = ?`;
  const [res] = await connection.query(query, [pathFoto, id]);
  return res.affectedRows === 1;
}

const updateCampiPersona = async (id, nome, cognome, codice_fiscale, data_nascita) => {
  const connection = await getConnection();
  const campi = [];
  const params = [];
  if (nome !== undefined) {
    campi.push('nome');
    params.push(nome);
  }
  if (cognome !== undefined) {
    campi.push('cognome');
    params.push(cognome);
  }
  if (codice_fiscale !== undefined) {
    campi.push('codice_fiscale');
    params.push(codice_fiscale);
  }
  if (data_nascita !== undefined) {
    campi.push('data_nascita');
    params.push(data_nascita);
  }
  // campi = ['nome', 'cognome']
  // campi = ['nome = ?', 'cognome = ?']

  params.push(id);
  const query = `UPDATE persona SET ${campi.map(campo => campo + ` = ?`).join(',')} WHERE id = ?`;
  const [res] = await connection.query(query, params);
  return res.affectedRows === 1;
}

const cancellaPerId = async (id) =>{
  const connection = await getConnection();
  const query = `DELETE FROM persona WHERE id = ?`;
  const deleteId = await connection.query(query,[id]);
  return res.affectedRows===1;
}

/**
 * @deprecated il soft delete non è prefisto per la persona 
*/
const softDelete = async (id_persona) => {
  const query = `UPDATE persona SET is_deleted = 1 WHERE id = ?`
  const [res] = await connection.query(query, [id_persona]);
  return res.affectedRows === 1;
}

module.exports = {
  listPersona,
  personaExistById,
  getPersonaById,
  insertPersona,
  updatePersona,
  updateCampiPersona,
  softDelete,
  updateFotoPersona,
  cancellaPerId
}