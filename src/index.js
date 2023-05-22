const { connect, disconnect } = require('./db')
const populateDb = require('./populate_db')
const redoUndo = require('./redo_undo')
const printDb = require('./print_db')

async function main() {
  const client = await connect()

  const tableName = await populateDb(client)
  
  await redoUndo(client, tableName)

  await printDb(client, tableName)

  await disconnect(client)
}

main()