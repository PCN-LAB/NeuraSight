## 📍 Overview

***Objective***

Analyze financial transactions and find possible money laundering attempts via GNN

---

## 📂 Repository Structure

```
├── src
│   ├── renderer → Frontend Code
│   │   ├── src
│   │        ├── app
│   │            ├── gnn
│   │            ├── motif
│   │            ├── overview
│   │        ├── routes → Routes are defined here
│   │        ├── components
│   │        ├── ...
│   │
│   ├── ipc → Contains functions which are invoked from frontend
│   │   ├── native → Functions to call native OS apis like opening explorer window etc
│   │   ├── scripts → Functions which spawn python processes
│   │
│   ├── main 
│   ├── preload
│   ├── python-scripts → Contains the python scripts for motif analysis, data overview
│
├── multignn → Contains the core gnn code   
├── resources
├── package.json
├── package-lock.json
└── ...
```

---

## 🧩 Frontend

### Tech Stack

- [Electron-Vite](https://electron-vite.org/): Desktop application framework.
- **React**: Frontend library.
- [shadcn/ui](https://ui.shadcn.com/): UI components.
- **TailwindCSS**: CSS framework.
- [React Flow](https://reactflow.dev/): Library for rendering interactive graphs.
- [Zustand](https://github.com/pmndrs/zustand): State management library.
- [PythonShell](https://github.com/extrabacon/python-shell): Running Python scripts from Node.js.

### Responsiveness

Please note that the application's UI is not responsive at this time.

### Routing

We use the `NextJS App Directory` routing strategy ([Routing: Defining Routes](https://nextjs.org/docs/app/building-your-application/routing/defining-routes)), where each folder represents a route. In reality, the routes are created via the `react-router-dom` library. Refer to [index.tsx](https://github.com/mizrabsheikh/neurasight/blob/main/src/renderer/src/routes/index.tsx) in the routes folder for detailed routing implementation.

### UI Components

The [shadcn/ui](https://ui.shadcn.com/) component library is utilized to build the UI. If you need to install additional components, use the manual strategy provided by shadcn. The CLI tool can also be used, but it will create the `components/ui/xyz.tsx` files in the root directory of the project, so you will need to manually move them to the renderer's component folder.

### IPC (Inter-Process Communication)

For IPC, we have employed the second method provided by the official Electron guide ([Inter-Process Communication | Electron](https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-2-renderer-to-main-two-way)). This allows for efficient two-way communication between the renderer and main processes.

### Executing Python Scripts

To execute Python scripts from the backend, we use [PythonShell](https://github.com/extrabacon/python-shell). This facilitates running Python scripts from Node.js. For details on the data being sent and received, please refer to the relevant section in the codebase.

<!--
| ▹ | [readme-gitlab.md]() | [gitlab](https://github.com/eli64s/flink-flow) | GitLab |
| ▹ | [readme-bitbucket.md]() | [bitbucket](https://github.com/eli64s/flink-flow) | BitBucket |
-->

---

## 💻 Backend
Refer to `python-scripts` folder
