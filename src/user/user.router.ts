import { Router } from 'express';
import { createUser, deleteUser, editUser, loginUser, getUserById, getUsers } from './user.controller';

export const userRouter = Router();

// Route pour enregistrer un nouveau user
userRouter.post('/', createUser); 

// Route pour obtenir la liste des utilisateurs
userRouter.get('/', getUsers);
userRouter.get('/:UserId', getUserById);

// Route pour modifier un user existant
userRouter.patch('/:UserId', editUser);

// Route pour supprimer un user
userRouter.delete('/:UserId', deleteUser);

// Route pour se connecter
userRouter.post('/login', loginUser);
