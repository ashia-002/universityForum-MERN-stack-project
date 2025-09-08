const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3334;

app.use(express.json());

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.stack(500).json({
        success : false,
        message : 'Something went wrong'
    })
});

app.get('/', (req, res)=>{
    res.send("Backend is running smoothly!!");
})

app.listen(PORT, ()=>{
    console.log(`Server is running on: ${PORT}`)
});
