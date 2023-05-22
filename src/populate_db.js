const fs = require('fs/promises')

const jsToPgType = {
    number: "int",
    string: "varchar(50)"
}

async function populate(client) {
    // Lê o arquivo .json
  const metadataText = await fs.readFile('assets/metadata.json', { encoding: 'utf8' })
  const metadata = JSON.parse(metadataText)
  const tableName = Object.keys(metadata)[0]

  // Caso já exista uma tabela com o nome, deleta ela
  await client.query(`DROP TABLE IF EXISTS ${tableName};`)

  // CREATE TABLE INITIAL (A int, B int);
  const columns = Object.entries(metadata[tableName]).map(([k, v]) => {
      const type = jsToPgType[typeof v[0]]
      return k + " " + type
  })

  await client.query(`CREATE TABLE ${tableName} (id int, ${columns.join(", ")});`)

  // INSERT INTO INITIAL (A, B) values (20, 55), (20, 30);
  const columnNames = Object.keys(metadata[tableName]).join(", ")

  const tableValues = Object.values(metadata[tableName])

  const values = tableValues[0].map((v, i) => {
    const ov = tableValues.slice(1).map(p => p[i])
    return [i + 1, v].concat(ov)
  })

  const strValues = values.map(v => `(${v.join(", ")})`).join(", ")

  await client.query(`INSERT INTO ${tableName} (id, ${columnNames}) values ${strValues};`)

  return tableName
}

module.exports = populate