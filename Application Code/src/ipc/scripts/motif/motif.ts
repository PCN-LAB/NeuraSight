import { Options, PythonShell } from 'python-shell'
import { getDatasetPath } from '../../../main'

export default async function motifAnalysis(edges: [], filters) {
  const options: Options = {
    mode: 'json',
    pythonPath: 'C:\\ProgramData\\miniforge3\\python.exe',
    pythonOptions: ['-u'],
    scriptPath: 'D:\\Projects\\neurasight\\src\\python-scripts',
    args: [getDatasetPath(), JSON.stringify(edges), JSON.stringify(filters)]
  }

  const results = await PythonShell.run('motif_analysis.py', options)

  return results
}

// value being returned in ideal scnario:
// [ [Containts all motifs], [for each motif the account being mapped to nodes] ]