import { Options, PythonShell } from 'python-shell'
import { getDatasetPath } from '../../../main'

export default async function runOverviewScript() {
  const options: Options = {
    mode: 'json',
    pythonPath: 'C:\\ProgramData\\miniforge3\\python.exe',
    pythonOptions: ['-u'],
    scriptPath: 'D:\\Projects\\neurasight\\src\\python-scripts',
    args: [getDatasetPath()]
  }

  const results = await PythonShell.run('overview.py', options)

  return results[0]
}
