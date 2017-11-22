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

function connectClient() {
  let user = dbConfig.dbConfig.user
  let host = dbConfig.dbConfig.host
  let dbname = dbConfig.dbConfig.dbname
  let connectCommand = "psql" +
      " -U " + user +
      " -h " + host +
      " -d " + dbname
  return connectCommand;
}

const connector = connectClient();
const userCreator = ' -a -f ./records/database-user.sql'
const tableCreator = ' -a -f ./records/database-build.sql'

if (argv.custom === 'y') {

  // console.log("current database settings:\n", dbConfig);
    exec(connector + userCreator, (error, stdout, stderr) => {
      if (error) {
          console.error(`exec error: ${error}`);
          return;
        } else {
          console.log(`stdout:${stdout}`);
          exec(connector + tableCreator, (error, stdout, stderr) => {
            console.log('in teh screept')
            if (error) {
                console.error(`exec error: ${error}`);
                return;
              } else {
                console.log(`stdout:${stdout}`);
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
