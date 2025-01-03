import express from 'express';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();
const app = express();
app.use(express.json());
app.use(router);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
