const { exec } = require('child_process');
const dbConfig = require('./sdist/config/combiner');

var argv = require('yargs')
  .option('run', {
    alias: 'custom',
    describe: 'see your database configuration options'
  })
  .usage('please specify --custom y/n')
  .help('help')
  .demandOption(['custom'])
  .argv


if (argv.custom === 'y') {
  console.log("current database settings:\n", dbConfig);
  let user = dbConfig.dbConfig.user
  let host = dbConfig.dbConfig.host
  let database = dbConfig.dbConfig.database
  let port = dbConfig.dbConfig.port
  let password = dbConfig.dbConfig.password

  let command = "psql" +
      " --user=" + user
      " --host=" + host
      " --database=" + database
      " --port=" + port
      " --password"

  exec('npm install', (error, stdout, stderr) => { // install modules and run application using custom db config
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    } else {
      console.log(`stdout:${stdout}`);
      console.log(`app started`);
      exec('npm run start', (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
      })
    }
  })

} else if (argv.custom === 'n') {
  try {
      let dbCustom = require('./sdist/config/db-custom.json');
      console.log('It seems you have a custom file, but do not wish to use it. Please remove it from the config folder. Otherwise use select custom=y')
  } catch (e) {
      if (e.code === 'MODULE_NOT_FOUND') { // create the environment to use default settings
        console.log('using default database settings');
        exec('psql postgres -a -f ./records/database-user.sql', (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          } else {
            console.log(`stdout:${stdout}`);
            exec('psql -d formapp -U formadmin -a -f ./records/database-build.sql', (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              } else {
                console.log(`stdout:${stdout}`);
                exec('npm install', (error, stdout, stderr) => {
                  if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                  } else {
                    console.log(`stdout:${stdout}`);
                    console.log(`app started`);
                    exec('node ./sdist/app.js', (error, stdout, stderr) => {
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
