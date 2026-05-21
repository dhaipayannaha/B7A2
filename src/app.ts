import express, { type Application, type Request, type Response } from 'express'
import { userRouter } from './modules/User/user.route';
import { authRouter } from './modules/auth/auth.route';
import { issueRouter } from './modules/issues/issue.router';

const app: Application = express();
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    "message": "Success",
    "author": "Sabbir Ahmed Jony"
  })
})

app.use('/api/auth', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/issues',issueRouter);

export default app;