import fs from 'node:fs'
import csv from 'csv-parser'

export async function readCSV(filePath: string, numRows: number = 5): Promise<string[]> {
  const results: string[] = []

  let rowsRead = 0

  const streamData = () =>
    new Promise<string[]>((resolve) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: string) => {
          if (rowsRead < numRows) {
            results.push(data)
            rowsRead++
          } else {
            // If the desired number of rows is reached, end the stream and resolve the promise
            resolve(results)
          }
        })
        .on('end', () => {
          resolve(results)
        })
    })

  const data = await streamData()
  //   console.log(data)
  return data
}
