import { Options, PythonShell } from 'python-shell'
import { getDatasetPath } from '../../../main'

export default async function runTimeSeriesForecastScript(filter: any) {
  const options: Options = {
    mode: 'json',
    pythonPath: 'C:\\ProgramData\\miniforge3\\python.exe',
    pythonOptions: ['-u'],
    scriptPath: 'D:\\Projects\\neurasight\\src\\python-scripts',
    args: [getDatasetPath(), filter]
  }

  const results = await PythonShell.run('time_series_forecasting.py', options)

  return results
}
