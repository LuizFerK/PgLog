const { Client } = require('pg')

async function connect() {
  // Instancia o client do banco
  const client = new Client({
    host: 'localhost',
    database: 'db_test',
    user: 'postgres',
    password: 'postgres',
    port: 5432,
  })
  
  // Conecta o client
  await client.connect()

  return client
}

// Encerra conexão do client
async function disconnect(client) {
  await client.end()
}

module.exports = { connect, disconnect }