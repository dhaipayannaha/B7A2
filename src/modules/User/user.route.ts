import { Router } from "express";
import { userController } from "./user.controller";



const router = Router();

router.post('/signup', userController.createUser);
router.get('/signup', userController.getAllUsers);
router.get('/signup/:id', userController.getSingleUser);
router.put('/signup/:id', userController.updateUser);

export const userRouter = router;