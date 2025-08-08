const express = require('express');

const app = express();

app.use('/test', (req, res) => {
    res.send('Hello From Test Route');
})

app.use((request, response) => {
    response.send('Hello From node js Application')
})

app.listen(3000, () => {
    console.log('Application is running on 3000')
})
