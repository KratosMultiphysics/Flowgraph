# FlowGraph

A node editor for Kratos Problemtypes

## Installation
Install [node.js](https://nodejs.org/en/download/package-manager)

Ej. Ubuntu
```console
sudo apt install nodejs
``` 

Clone this repo

```console
git clone https://github.com/KratosMultiphysics/Flowgraph.git
```

Install packages

```console
npm install
npm install -g nodemon
```

## How to run

For users use either

```console
npm run start 
```

```console
node app.js
```

For developers

```console
npm run devstart 
```

## Configuration

You can change the configuration file used by setting the `NODE_ENV` variable. For example

```console
export NODE_ENV=debug
```

will use `confg/debug.json` configure file.

<!-- ## Description 

### Tree of node dependencies

- Project Parameters: OK
  - Solver: OK
    - Assign materials to modelpart: WIP
      - Parse Modelpart WIP
      - Parse Materials WIP
    - Linear solver: OK
    - Time stepping WIP
    - Formulation: OK
  - List of processes: OK
    - … processes per application … : OK - WIP 
  - List of output processes: OK
    -  … processes per application … : OK - WIP


- Auxiliary modules
  - Export cases files
  - JSON Viewer

### Description of the nodes
#### Parse Materials:

 Lista de materiales. Que usar de nombres?
Assign materials to modelpart
Parse Modelpart file: MP settings
Parse materials file: Materials settings, lista de materiales

from MP settings creates list of materials as inputs.
Materials are connected to submp


#### Project parameters
*Required inputs*

solver
processes input
processes boundary conditions
processes output

*Optional inputs* (have sensitive defaults)
problem name
parallel type
echo level
start time
end time

*Output*: ProjectParameters object, that can be input for 
“Export case files”: need to pass data to get materials and model file.
“JSON Viewer”: actually, output is only json, so this is the only module available so far

WIP:
Project parameters module: reset input when connections change


#### Solvers
Solvers require data from other modules
“Parse modelparts file”, which returns Model parts settings (a json block with info about the model file name and type), and a list of submodelparts classified as volumetric, skin and non-skin
- Linear solvers
- Time stepping: Module that generate time stepping schemes
- Formulation: Module with options and setting for specific formulation of the solver
- Fluid Solver
*Required input*
Model part settings
Volume submodelpart
Skin submodelpart
Non-skin submodelparts
Linear solvers
Materials
Time stepping
Formulation

Structural Mechanics solver
*Time*
Time Stepping
    automatic_time_step: true / false
    time_step: 0.1
     "time_step_table": [
        [ 0.00, 0.01 ],
        [ 0.02, 0.01 ],
        [ 0.03, 0.10 ],
        [ 1.00, 0.10 ]
       ]
        }
WIP: Implement internal logic. Particularly, the time step table. Find a function that processes time in Kratos.
Formulation
Available formulations: fractional step, monolithic
Optional input:
element
orthogonal subscale
dynamic tau
Output:
Formulation object, to be connected to Solver module
Linear solvers
Setting for the AMGCL linear solver

*Optional parameters*
Coarsening:
Smoothing:
Krylov:
Processes
KratosMultiphysics
Fluid Dynamics Application
Structural Mechanics Application
Your Other Installed Application
Output
-->
