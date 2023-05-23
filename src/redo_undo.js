const fs = require('fs/promises')

async function redoUndo(client, tableName) {
    // Lê o arquivo .txt
  const log = await fs.readFile('assets/log.txt', { encoding: 'utf8' })
  
  const logCommands = log.split("\n").map(row => row.replace("<", "").replace(">", "").split(","))

  const redoUndoLog = logCommands.reduce((acc, row) => {
    if (row[0].includes("start")) {
      const transaction = row[0].split(" ")[1]
      return {...acc, [transaction]: { type: "UNDO", queries: [] }}
    }
    if (row[0].includes("commit")) {
      const transaction = row[0].split(" ")[1]
      return {...acc, [transaction]: { ...acc[transaction], type: "REDO" }}
    }

    const transaction = row[0]

    return {...acc, [transaction]: { ...acc[transaction], queries: [...acc[transaction].queries, row] }}
  }, {})

  for (const [k, v] of Object.entries(redoUndoLog)) {
    if (v.type === "REDO") {
      for (const [t, id, c, ov, nv] of v.queries) {
        await client.query(`UPDATE ${tableName} SET ${c} = ${nv} WHERE id = ${id};`)
      }
    } else {
      for (const [t, id, c, ov, nv] of v.queries.reverse()) {
        await client.query(`UPDATE ${tableName} SET ${c} = ${ov} WHERE id = ${id};`)
      }
    }

    console.log(`Transação ${k} realizou ${v.type}`)
  }
}

module.exports = redoUndo