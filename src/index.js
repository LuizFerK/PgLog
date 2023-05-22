const { connect, disconnect } = require('./db')
const populateDb = require('./populate_db')
const redoUndo = require('./redo_undo')

async function main() {
  const client = await connect()

  await redoUndo()
  
  await populateDb(client)

  await disconnect(client)
}

main()