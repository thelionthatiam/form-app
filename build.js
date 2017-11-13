// yargs parse cl arguements
const { exec } = require('child_process');


exec('psql postgres -a -f ./records/database-user.sql', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  } else {
    console.log('creating user and db', `stdout: ${stdout}`);
    console.log('creating user and db', `stderr: ${stderr}`);
    exec('psql -d formapp -U formadmin -a -f ./records/database-build.sql', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      } else {
        console.log('creating tables', `stdout: ${stdout}`);
        console.log('creating tables', `stderr: ${stderr}`);
        exec('npm install', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          } else {
            console.log('npm install', `stdout: ${stdout}`);
            console.log('npm install', `stderr: ${stderr}`);
            exec('npm run start', (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
            })
          }
        })
      }
    })
  }
});
