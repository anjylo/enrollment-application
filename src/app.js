const express = require('express');
const app = express();

const PORT = 3000

// Allow request.body
app.use(express.json());

app.get('/', (request, response) => response.json({'message': 'hello'}))

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));