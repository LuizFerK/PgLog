const { connect, disconnect } = require('./db')

async function main() {
  const client = await connect()

  await disconnect(client)
}

main()