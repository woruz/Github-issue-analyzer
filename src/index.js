import express from 'express';
import 'dotenv/config';
import router from './routes/routes.js'

const app = express();


app.use(express.json());
app.use(router);


app.listen(process.env.PORT, () => {
console.log(`Server running on port ${process.env.PORT}`);
});