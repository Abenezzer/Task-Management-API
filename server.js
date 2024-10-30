const express = require("express");
require("express-async-errors");
const app = express();

require('./startup/db')();
require('./startup/routes')(app);
require('./startup/globalErrorHandling')

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server Listning at port ${PORT}...`));
