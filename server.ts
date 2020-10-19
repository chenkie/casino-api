require('dotenv').config();
import express, {
  NextFunction,
  Request,
  Response
} from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3001;

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
    }
  }
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

app.post(
  '/register',
  async (req: Request, res: Response) => {
    try {
      const { firstName, lastName } = req.body;

      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          credits: 0
        }
      });

      const token = jwt.sign(user, process.env.JWT_SECRET);

      res.json({ user, token });
    } catch (err) {
      res
        .status(400)
        .json({ message: 'Something went wrong' });
    }
  }
);

app.use(
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(
        'Bearer'
      )[1];

      if (!token) {
        res.status(401).json({ message: 'No token found' });
      } else {
        const decoded: any = jwt.verify(
          token.trim(),
          process.env.JWT_SECRET
        );

        const { id, firstName, lastName } = decoded;
        req.user = {
          id,
          firstName,
          lastName
        };
        next();
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({ message: 'Invalid token' });
    }
  }
);

app.get('/user', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findOne({
      where: { id: req.user.id }
    });
    res.json({ user });
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Something went wrong' });
  }
});

app.post('/redeem', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: {
        credits: {
          increment: 100
        }
      }
    });
    res.json({
      message: '$100 redeemed!',
      totalCredits: user.credits
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Something went wrong' });
  }
});
app.listen(PORT);
console.log(`Server listening on http://localhost:${PORT}`);
