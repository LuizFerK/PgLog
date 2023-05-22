async function printDb(client, tableName) {
  const table = await client.query(`SELECT * FROM ${tableName};`)
  const defaultValues = Object.fromEntries(Object.entries(table.rows[0]).map(([k, v]) => [k, []]))
  
  const values =table.rows.reduce((acc, row) => {
    for (let k in row) acc[k] = [...acc[k], row[k]];
    return acc
  }, defaultValues)

  const print = { [tableName]: values }

  console.log(print)
}

module.exports = printDb