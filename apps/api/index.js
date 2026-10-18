import app from './app.js';
import dbConnection from './database/config.js';

const PORT = process.env.PORT || 4001;

console.log("Using PORT: ", PORT)

dbConnection();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
