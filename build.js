const { exec } = require('child_process');
const dbConfig = require('./sdist/config/combiner');
var argv = require('yargs')
  .option('run', {
    alias: 'c',
    describe: 'see your database configuration options'
  })
  .usage('please specify -custom or -c')
  .help('help')
  .demandOption(['c'])
  .argv

if (argv.custom === 'y') {
  console.log("current database settings: ", dbConfig);

  exec('npm install', (error, stdout, stderr) => { // install modules and run application using custom db config
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    } else {
      console.log('npm install', `stdout: ${stdout}`);
      // console.log('npm install', `stderr: ${stderr}`);
      exec('npm run start', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
      })
    }
  })

} else {
  try {
      let dbCustom = require('./sdist/config/db-custom.json');
      console.log('It seems you have a custom file, but do not wish to use it. Please remove it from the config folder. Otherwise use "-c"')
  } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') { // create the environment to use default settings
        console.log('using default database settings');
        exec('psql postgres -a -f ./records/database-user.sql', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          } else {
            exec('psql -d formapp -U formadmin -a -f ./records/database-build.sql', (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              } else {
                exec('npm install', (error, stdout, stderr) => {
                  if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                  } else {
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
      }
      else {
        console.log('there was a problem, contact the developer')
      }
  }

}
