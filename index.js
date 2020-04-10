const express = require('express'); // return a function
const app = express();
const DataStore = require('nedb'); // return a class
const Joi = require('joi'); // return a class

app.use(express.json());

/* Base de datos creada en db folder */
/* const database = new DataStore('./db/database.db');
database.loadDatabase(); */

/* Datos ingresados a database.db manualmente */
/* database.insert(
    {
        name: 'Ad',
        lote: 123, 
        sampler: 'Ivan Arellano'
    }
); */

/* Prueba creando datos */
const products = [
    {lote:1, name:'ADECAN'},
    {lote:2, name:'PARACETAMOL'},
    {lote:3, name:'ASPIRINA'}
];

/* Productos mostrados por pantalla */
app.get('/api/products', (req, res) =>{
    res.send(products);
});

/* Pantalla principal */
app.get(
    '/', (req, res) => {
        res.send('Pagina principal');
    } 
);

/* Seleccion individual de un producto */
app.get('/api/products/:lote', (req, res) =>{
    const product = products.find(p => p.lote === parseInt(req.params.lote));

    if(!product) {
        /* Producto no encontrado */
        res.status(404).send(
            'The product with the given LOTE was not found'
        );
    }
    res.send(product);
});

/* Puerto por defecto */
const port = process.env.PORT || 3000;

app.listen(
    port, () =>{
        console.log(`Listening on port ${port}`);
    }
);

/* Nuevo medicamento registrado */
app.post('/api/products', (req, res) =>{

    /* Validacion del nuevo medicamento */
    const result = validateProduct(req.body);
    const {error} = validateProduct(req.body);
    if(error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const product = {
        lote: products.length + 1,
        name: req.body.name
    };
    products.push(product);
    res.send(product);
});

/* Actualizacion de productos */
app.put('/api/products/:lote', (req, res) =>{
    /* Buscando producto existente */
    const product = products.find(p => p.lote === parseInt(req.params.lote));
    if(!product) res.status(404).send('The product with the given LOTE was not found');

    /* Validacion de la consulta */
    const result = validateProduct(req.body);
    const {error} = validateProduct(req.body);
    if (error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    /* Producto actualizado */
    product.name = req.body.name;
    res.send(product);
});

/* Validacion del producto */
function validateProduct(product) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(product, schema);
}

app.post('/api/products', (req, res) =>{
    
});

/* Medicamento eliminado */
app.delete('/api/products/:lote', (req, res) =>{
    /* Validando producto existente */
    const product = products.find(p =>p.lote === parseInt(req.params.lote));
    if(!course) res.status(404).send('The product with the given LOTE was not found');

    /* Producto eliminado */
    const index = products.indexOf(product);
    products.splice(index, 1);
    res.send(
        `Deleted product: ${product}`
    );
});


