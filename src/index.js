const { connect, disconnect } = require('./db')
const populateDb = require('./populate_db')

async function main() {
  const client = await connect()

  await populateDb(client)

  await disconnect(client)
}

main()