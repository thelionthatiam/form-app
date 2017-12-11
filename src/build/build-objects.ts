import * as fs from 'fs';

const connectPrompt = {
  properties: {
    database: {
      description:"database name",
      message:"use a string",
      type:"string"
    },
    user: {
      description:"username",
      message:"use a string",
      type:"string"
    },
    password: {
      description:"database password",
      message:"use a string",
      type:"string"
    },
    host: {
      description:"database host",
      message:"use a string",
      type:"string"
    }
  }
}


const prevConn = {
  properties: {
    prevConn: {
      description:"Would you like to use true for previous connect information or false to delete previous?(boolean)",
      message:"Use true for connect and false to delete and use new credentials",
      required:true,
      // default:true,
      type:"boolean"
    }
  }
}



const whatVersion = {
  properties: {
    version: {
      description:"What version of the database would you like to install? Enter for default up-to-date. (number)",
      message:"Use a number, check the database builds for version numbers.",
      required:true,
      default:(fs.readdirSync('./database-builds/up')).length,
      type:"number",
    }
  }
}

const deleteTables = {
  properties: {
    versionDown: {
      description:"Which version would you like to go down to? 0 removes all. Enter for full delete. (number)",
      message:"Use a number, check the database builds for version numbers.",
      required:true,
      default:0,
      type:"number"
    }
  }
}

export {
  connectPrompt,
  deleteTables,
  prevConn,
  whatVersion
}
