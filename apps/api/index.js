import app from './app.js';
import dbConnection from './database/config.js';

const PORT = process.env.PORT || 4001;

dbConnection();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
