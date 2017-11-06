
// fix this
// yargs parse cl arguements
// "psql postgres -a -f ./records/database-user.sql && psql -d formapp -U formadmin -a -f ./records/database-build.sql && npm install && node ./sdist/app.js",

const { exec } = require('child_process');


exec('psql postgres -a -f ./records/database-user.sql', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  } else {
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    exec('psql postgres -a -f ./records/database-user.sql', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      } else {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        exec('psql postgres -a -f ./records/database-user.sql', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          } else {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            exec('psql postgres -a -f ./records/database-user.sql', (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              } else {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
              }
            })
          })
        })
      })
});
