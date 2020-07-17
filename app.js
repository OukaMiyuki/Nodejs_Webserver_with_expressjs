const Joi = require('joi');
const express = require('express');
const { request, response } = require('express');
const app = express();

app.use(express.json()); //enable the json parsing for expressjs

const postId = [
    { id : 1, name : 'post1' },
    { id : 2, name : 'post2' },
    { id : 3, name : 'post3' },
    { id : 4, name : 'post4' },
    { id : 5, name : 'post5' },
    { id : 6, name : 'post6' }
];

app.get('/', (request, response) => {
    response.send('walla!!!!!!');
});

app.get('/api/test', (request, response) => {
    response.send('tes api');
});

// app.get('/api/post/:year/:id', (request, response) => {
//     response.send(request.params);
//     //response.send(request.params.year);
//     //response.send(request.params.id);
// });

app.post('/api/post', (request, response) => {
    // const schema = Joi.object({  
    //     name: Joi.string().min(3).required()
    //  });
        
    // const validation = schema.validate(request.body);

    const { error } = validateInput(request.body); //using object destructing
    if(error){
        response.status(400).send(error.details[0].message);
        return; //place return in here, so the rest of the code wouldn't be executed (return null;)
    };

    const posting = {
        id : postId.length+1,
        name : request.body.name
    };
    postId.push(posting);
    response.send(postId);
});

app.get('/api/search_post/:id', (request, response) => {
    let postSearch = postId.find(c => c.id == parseInt(request.params.id));
    if(!postSearch) response.status(404).send('Post not found!')
    response.send(postSearch);
});

app.put('/api/post/:id', (request, response) => {
    let postSearch = postId.find(c => c.id == parseInt(request.params.id));
    if(!postSearch) response.status(404).send('Post not found!');

    // const validation = validateInput(request.body);
    const { error } = validateInput(request.body); //using object destructing
    if(error){
        response.status(400).send(error.details[0].message);
        return; //place return in here, so the rest of the code wouldn't be executed (return null;)
    };

    postSearch.name = request.body.name;
    response.send(postSearch);
});

function validateInput(masukan){
    const schema = Joi.object({  
        name: Joi.string().min(3).required()
     });
    return schema.validate(masukan);
}

const port = process.env.Port_Number || 3000; //use the environtment variable to determine the port due to hosting purpose note : use command set PORT = (port number) to set an environtment variable
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});