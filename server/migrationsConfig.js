module.exports = {
    database: 'dbname',
    user: 'user',
    password: 'password',
    host: 'db',
    port: 5432,
    migrationsTable: 'pgmigrations', // Nom de la table où les informations de migration seront stockées
    dir: 'migrations', // Répertoire où les fichiers de migration seront stockés
    schema: 'public', // Schéma de la base de données à utiliser pour les migrations
  };
  