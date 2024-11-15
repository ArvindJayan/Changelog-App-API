import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { signIn, signUp } from './handlers/user';
import { protect } from './modules/auth';
import router from './router';
const app = express();

const customLogger = (message) => (req, res, next) => {
    console.log(`Hello from ${message}`);
    next();
}

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(customLogger('custom logger'));
app.use((req, res, next) => {
    req.secret = 'test';
    next();
})

app.get('/', (req, res, next) => {
    res.json({ message: 'Server is up and running' });
});

app.use('/api', protect, router);
app.post('/signup', signUp);
app.post('/signin', signIn);

app.use((err, req, res, next) => {
    if (err.type === 'auth') {
        res.status(401).json({ message: 'Unauthorized' });
    } else if (err.type === 'input') {
        res.status(400).json({ message: 'Invalid input' });
    } else {
        res.status(500).json({ message: "That's on us. We will fix it soon" });
    }
});

export default app;