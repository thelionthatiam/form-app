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

const deleteTables = {
  properties: {
    deleteTables: {
      description:"Would you like to delete these tables?(boolean)",
      message:"Use true for delete and false to exit",
      type:"boolean"
    }
  }
}

const prevConn = {
  properties: {
    prevConn: {
      description:"Would you like to use true for previous connect information or false to delete previous?(boolean)",
      message:"Use true for connect and false to delete and use new credentials",
      type:"boolean"
    }
  }
}

export {
  connectPrompt,
  deleteTables,
  prevConn
}
