import { Options, PythonShell } from 'python-shell'
import { getDatasetPath } from '../../../main'

export default async function runMultiGNN() {
  const options: Options = {
    mode: 'json',
    pythonPath: 'C:\\ProgramData\\miniforge3\\python.exe',
    pythonOptions: ['-u'],
    scriptPath: 'D:\\Projects\\neurasight\\src\\python-scripts',
    args: [getDatasetPath(), ]
  }

  // console.log('D:\\Projects\\neurasight\\src\\python-scripts')
  // console.log('Dataset Path: ', datasetPath)
  // console.log('B: Starting MultiGNN Script!')

  const results = await PythonShell.run('multignn.py', options)

  return results[0]
}


"python main.py --data Small_HI --model gin --tqdm --unique_name 'gin' --testing --inference"