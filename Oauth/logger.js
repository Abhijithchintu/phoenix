const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.json()
  ),
  transports: [
      new transports.Console(),
      new transports.File({filename: '../logfiles/error.log', level: 'error'}),
      new transports.File({filename: '../logfiles/info.log', level: 'info'}),
      new transports.File({filename: '../logfiles/debug.log', level: 'debug'})
  ]
});

module.exports = logger;