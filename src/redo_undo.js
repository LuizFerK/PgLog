const fs = require('fs/promises')

async function redoUndo() {
    // Lê o arquivo .txt
  const log = await fs.readFile('assets/log.txt', { encoding: 'utf8' })
  
  const logCommands = log.split("\n").map(row => row.replace("<", "").replace(">", "").split(","))

  const redoUndoLog = logCommands.reduce((acc, row) => {
    if (row[0].includes("start")) {
      const transaction = row[0].split(" ")[1]
      return {...acc, [transaction]: "UNDO"}
    }
    if (row[0].includes("commit")) {
      const transaction = row[0].split(" ")[1]
      return {...acc, [transaction]: "REDO"}
    }

    return acc
  }, {})

  Object.entries(redoUndoLog).map(([k, v]) => {
    console.log(`Transação ${k} realizou ${v}`)
  })
}

module.exports = redoUndo