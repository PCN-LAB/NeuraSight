import { Options, PythonShell } from 'python-shell'

export default async function runFindNeighboursScript(graph) {
  const options: Options = {
    mode: 'json',
    pythonPath: 'C:\\ProgramData\\miniforge3\\python.exe',
    pythonOptions: ['-u'],
    scriptPath: 'D:\\Projects\\neurasight\\src\\python-scripts',
    args: [JSON.stringify(graph)]
  }

  const results = await PythonShell.run('motif_neighbours.py', options)
  return results
}

// value being returned in ideal scnario:
// [ [Containts all motifs], [for each motif the account being mapped to nodes] ]
