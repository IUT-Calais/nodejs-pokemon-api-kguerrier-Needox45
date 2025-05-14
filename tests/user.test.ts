import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';
import { error } from 'console';




  






describe('User API', () => {

  describe('GET /users', () => {
    it('should fetch all Users', async () => {
      const getUsers = [
          { id: 1, email: "userTest1@gmail.com", password: "12345678910" }
      ];

      prismaMock.user.findMany.mockResolvedValue(getUsers);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success :getUsers});
    });
  });



  describe('GET /users/:UserId', () => {
    it('should fetch all Users By ID', async () => {
      const getUsersALL =
          { id: 1, 
            email: "userTest1@gmail.com", 
            password: "12345678910" 
          };

      prismaMock.user.findUnique.mockResolvedValue(getUsersALL);

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success : getUsersALL});
    });

    it('should return 404 if User is not found', async () => {
          
          prismaMock.user.findUnique.mockResolvedValue(null);
    
          const response = await request(app).get('/users/999');
    
          expect(response.status).toBe(404);
          expect(response.body).toEqual({ error : 'User avec ID 999 non trouve' });
        });
  });
  
  




    describe('POST /users', () => {
      it('should create a new user', async () => {
        const token = 'mockedToken';
        const createdUser = { id: 1, 
            email: "userTest1@gmail.com", 
            password: "12345678910" 
          };

        prismaMock.user.create.mockResolvedValue(createdUser);
        const response = await request(app)
          .post('/users')
          .set('Authorization', `Bearer ${token}`)
          .send(createdUser);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success :createdUser});

      });
    });




    describe('PATCH /users/:UserId', () => {
      it('should edit a user', async () => {
        const token = 'mockedToken';

        const updateUser = { 
            id: 1, 
            email: "userTest2@gmail.com", 
            password: "12345678910" 
        };

        // Simule un utilisateur existant
        prismaMock.user.findUnique.mockResolvedValue(updateUser);

        // Simule la mise à jour de l'utilisateur
        prismaMock.user.update.mockResolvedValue(updateUser);

        const response = await request(app)
            .patch('/users/1')
            .set('Authorization', `Bearer ${token}`)
            .send(updateUser);
            
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: updateUser });
      });

      it('should return 404 if user to update is not found', async () => {
        const token = 'mockedToken';

        prismaMock.user.findUnique.mockResolvedValue(null); // Simule un utilisateur inexistant

        const updateUser = {
            id: 1,
            email: "userTest2@gmail.com",
            password: "12345678910"
        };

        const response = await request(app)
            .patch('/users/999') // ID inexistant
            .set('Authorization', `Bearer ${token}`)
            .send(updateUser);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Utilisateur avec ID 999 non trouve' });
      });
    });





     describe('DELETE /users', () => {

      it('should delete a user but not find', async () => {
        const token = 'mockedToken';

        prismaMock.user.findUnique.mockResolvedValue(null);

        const response = await request(app)
          .delete('/users/999')
          .set('Authorization', `Bearer ${token}`)
          
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error : 'Utilisateur avec ID 999 non trouve'});

      });

      it('should delete a user successfully', async () => {
        const token = 'mockedToken';

        const deleteUser = { id: 1, 
            email: "userTest1@gmail.com", 
            password: "12345678910" 
        };

          // Simule un utilisateur existant
        prismaMock.user.findUnique.mockResolvedValue(deleteUser);

          // Simule la suppression de l'utilisateur
        prismaMock.user.delete.mockResolvedValue(deleteUser);


        const response = await request(app)
            .delete('/users/1')
            .set('Authorization', `Bearer ${token}`)
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success : 'Utilisateur avec ID 1 supprime' });

      });
    });



/*

    describe('POST /login', () => {
      it('should login a user and return a token', async () => {
        const user = {};
        const token = 'mockedToken';

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          token,
          message: 'Connexion reussie',
        });
      });
    });
  });
*/
});
