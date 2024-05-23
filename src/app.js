const express = require('express');
const app = express();

const { ObjectId } = require('mongodb');
const database = require('../configs/database');

const port = 3000;

let connection;

// Use middleware to allow request.body
app.use(express.json());

// Routes
app.get('/users', async (request, response) => {
    try {
        const collections = await connection.collection('users').find();
        const users = await collections.toArray() || [];

        return response.status(200).json(users);
    } catch (error) {
        return response.status(500).json({message: error.message});
    }
});

app.get('/users/:id', async (request, response) => {
    try {
        const id = request.params.id;
        
        if (! id || ! ObjectId.isValid(id)) {
            return response.status(400).json({message: 'Invalid user ID'});
        }

        const user = await connection.collection('users').findOne({_id: new ObjectId(id)});
            
        if (! user) {
            return response.status(404).json({message: 'User not found'});
        }
        
        return response.status(200).json(user);

    } catch (error) {
        return response.status(500).json({message: error.message});
    }
});

app.post('/users', async (request, response) => {
    try {
        const regex = /^[A-Za-z0-9._]+@[A-Za-z]+\.[A-Za-z]+(\.[A-Za-z]+)*$/;

        const name = request.body.name;
        const email = request.body.email;

        if (! name || ! email) {
            return response.status(400).json({message: 'Name and email cannot be empty'});
        }

        if (! regex.test(email)) {
            return response.status(400).json({message: 'Invalid email'});
        }

        await connection.collection('users').insertOne({name: name, email: email});

        return response.status(201).json({'message': 'Successfully added new user'});
    } catch (error) {
        return response.status(500).json({message: error.message});
    }
});

app.put('/users/:id', async (request, response) => {
    try {
        const regex = /^[A-Za-z0-9._]+@[A-Za-z]+\.[A-Za-z]+(\.[A-Za-z]+)*$/;

        const id = request.params.id;
        const name = request.body.name;
        const email = request.body.email;

        if (! name || ! email) {
            return response.status(400).json({message: 'Name and email cannot be empty'});
        }

        if (! regex.test(email)) {
            return response.status(400).json({message: 'Invalid email'});
        }

        if (! id || ! ObjectId.isValid(id)) {
            return response.status(400).json({message: 'Invalid user ID'});
        }

        const filter = { _id: new ObjectId(id) };
        const updateDocument = {
            $set: {
                name: name, 
                email: email, 
            }
        };

        await connection.collection('users').updateOne(filter, updateDocument);

        response.status(200).json({message: 'Successfully updated user'});

    } catch (error) {
        response.status(500).json({message: error.message});
    }
});

app.delete('/users/:id', async (request, response) => {
    try {
        const id = request.params.id;

        if (! id || ! ObjectId.isValid(id)) {
            return response.status(400).json({message: 'Invalid user ID'});
        }
        
        await connection.collection('users').deleteOne({_id: new ObjectId(id)});
        
        return response.status(200).json({message: 'Successfully deleted user'});
    } catch (error) {
        return response.status(500).json({message: error.message});
    }
});

app.use((request, response) => response.status(404).json({message: '404. Page Not Found.'}));

database.connect((error) => {
    if (! error) {
        app.listen(port, () => console.log(`Server running on port ${port}.`));

        connection = database.getDB();
    } else {
        console.log(error);
    }
});
