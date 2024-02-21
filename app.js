import { fileURLToPath } from 'url';

import fs from 'fs';
import path from 'path';
import cors from 'cors';

import express from 'express';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import config from 'config';

const port = config.get('port');
const app = express();

// App configuration
app.use(express.static(path.join(__dirname, 'public')));  // Use static public directory
app.use(express.json());                                  // Enable direct transfers of JSON for the backend
app.use(cors());                                          // Enable CORS

// Routes
app.get('/', (req, res) => {
  res.render('index.html');
});

// File transfer
app.post('/upload_json', (req, res) => {
  console.log(req.body);
  fs.writeFile("simulations/ProjectParameters.json", JSON.stringify(req.body, null, 2), function(err) {
      if(err) { return console.log(err); }
  }); 

  res.sendStatus(200);
});

// Spawn simulation process and stream output
app.get('/run_simulation', async (req, res) => {
  let process_env = {
      'env': {
          'LD_LIBRARY_PATH'   : `${config.kratos_path}/libs`,
          'PYTHONPATH'        : `${config.kratos_path}/`
      },
      'cwd': config.working_dir || `./simulations/`
  }

  console.log("Trying to run the case", process_env)

  var child = spawn('ls', ['MainKratos.py'], process_env);

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function(data) {
      console.log('stdout: ' + data);
      res.write(`${data}`);
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function(data) {
      console.log('stderr: ' + data);
      res.write(`${data}`);
  });

  child.on('close', function(code) {
      console.log('closing code: ' + code);
      console.log('Full output of script: ');
  });
})

// Start server
app.listen(port, () => {
  console.log(`Flowgrapg is running on port ${port}`);
});