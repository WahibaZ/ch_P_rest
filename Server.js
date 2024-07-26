

require('dotenv').config({ path: './config/.env' });

const express=require('express'); 
const mongoose=require('mongoose');
const app=express();

const port=process.env.Port;
const uri=process.env.URI;

const User=require('./models/User');

app.use(express.json());



mongoose.connect(uri)
    .then(()=>console.log('Database connected successfully'))
    .catch(error=>console.error(`Error connectiong to database ${error}`))


// Route GET : Retourner tous les utilisateurs

app.get('/users',async(req,res)=>
{    
    try{
       const users=await User.find();
       // Retourner les utilisateurs en JSON
       res.json(users);
    }catch(err){
        res.status(500).json({ message: err.message }); // Gestion des erreurs
    }
}
);

app.post('/addUser',async(req,res)=>{
    const userToAdd=new User(req.body);
    try {
        const saveduser=await userToAdd.save();
        res.status(201).json({
            message: 'User added successfully',
            user:saveduser 
        }); // Retourne l'utilisateur créé avec un statut 201
    } catch (error) {
        res.status(400).json({ message: error.message }); // Gestion des erreurs
    }
});


// Route PUT : Mettre à jour un utilisateur par ID
app.put('/editUser/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password;

        const updatedUser = await user.save();
        res.json({
            message: 'User updated successfully',
            user: updatedUser // Retourner l'utilisateur 
        });
    } catch (error) {
        res.status(400).json({ message: error.message }); // Gestion des erreurs
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//lancer le serveur et ecouter sur le port 
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
}
);