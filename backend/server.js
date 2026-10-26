import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import postgres from '@prisma/orm-postgres/runtime';
import contractJson from './prisma/schema.json' with { type: 'json' };
import jwt from 'jsonwebtoken';
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());
const db = postgres({
  contractJson,
  url: process.env.DATABASE_URL,
});
await db.connect();
console.log('Драйвер базы данных подключен')
async function connectToDatabase() {
    try {
        await db.connect();
        console.log('Регистрация прошла успешно');
    }
    catch (error){
        console.error ('Не удалось подключится',error);
    }
}
connectToDatabase()
app.get('/', (req, res) => {
    res.send('Привет будущим лоховозам')
})
app.post('/api/register', async (req, res) =>{
    console.log('Регайся лоховоз')
    const  {username, email, password} = req.body;
    console.log(`Данные нового лоховозика: ${username}, ${email}`);
    if (!username || !email || !password){
        return res.status(400).json({
            success: false,
            message: 'Заполни все данные , балбес'})
    }

    try {
        const userExists = await db.orm.public.User.where({ email: email }).first();
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'Такой email уже есть у лоховозах'
            });
        }
const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await db.orm.public.User.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword
            }
        });
        console.log(`Создан новый лоховозик: ${newUser.username}, ${newUser.email}`);
        return res.status(201).json({
            success: true,
            message: 'Регистрация прошла успешно, красава',
            user: {
                id: newUser.id,
                username: newUser.username,
            }
        });
    }
    catch (error) {
        console.error('Ошибка при регистрации лоховоза:', error);
        return res.status(500).json({success: false, message: 'Ошибка сервера при регистрации лоховоза'});
    }
    const token = jwt.sign(
        {userId : newUser.id, email: newUser.email},
        process.env.JWT_SECRET || 'SUPER_SECRET_KEY_123',
        {expiresIn:'24h'}
    )
    return res.status(201).json({
        success: true,
        message: 'Регистрация прошла успешно',
        token: token,
        user:{
            id:newUser.id,
            username: newUser.username,
    email: newUser.email,
        }
    })
});
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});