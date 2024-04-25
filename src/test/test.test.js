const CartManagerDB = require('../dao/mongo/cartDaoDB')
const UserManagerDB = require('../dao/mongo/userDaoDB')
const ProductManagerDB = require('../dao/mongo/productDaoDB')
const { connectDB } = require('../config/connectDB'); 
const mongoUrl = process.env.MONGO_URL
const supertest = require('supertest')
const requester = supertest.agent('http://localhost:5000')
const { generateResetToken } = require('../utils/tokenUtils');


connectDB(mongoUrl)

//#region carritos

describe('Cart test', async () => {
    //antes de todos los test se ejecuta:
    before(function() {
        this.cartService = new CartManagerDB();
        
    })
    
    //Obtener todos los carritos como un array de objetos
    it('Get all carts as an array of objects', async function(){
        
        //Obtengo la libreria por function para evitar errores de importación
        const chai = await import('chai');
        const expect = chai.expect;

        //solicitud para el testing
        const response = await requester.get('/api/carts')

        const body = response._body

        body.carts.forEach(cart => {
        //se espera un array
        expect(body.carts).to.be.an('array')
        expect(cart).to.be.an('object');
        });
    })

    //Traer un carrito con id random
    it('Get a cart by a random ID', async function(){

        //Obtengo la libreria por function para evitar errores de importación
        const chai = await import('chai');
        const expect = chai.expect;

        //primero traigo todos los carritos
        const response = await requester.get('/api/carts')
        const carts = response._body.carts

        //Busco cualquier ID de los carts existentes
        const randomIndex = Math.floor(Math.random() * carts.length);
        const cartId = carts[randomIndex]._id;

        //solicitud para el testing
        const result = await requester.get(`/api/carts/${cartId}`)
        //se espera respuesta ok
        expect(result).to.be.ok
    })

    //Actualizar carrito con ID harcodeado
    it('Update a cart by ID', async function (){

        //Obtengo la libreria por function para evitar errores de importación
        const chai = await import('chai');
        const expect = chai.expect;

        //dejo listos un cart y un body
        const cartId = '662145749e3a712e0ebbf9d3'
        const body = {
            "products": [
              {
                "productId": "65f61b9964b452e91a97e45e",
                "quantity": 2
              }
            ]
          }

        //solicitud para el testing
        const result = await requester
            .put(`/api/carts/${cartId}`)
            .send(body)
        //se espera actualización ok
        expect(result.status).to.be.equal(200)
    })

})

//#endregion


//#region sesiones

describe('Session test', async () => {
    //antes de todos los test se ejecuta:
    before(function() {
        this.userService = new UserManagerDB();
        
    })

    //Registro sin datos obligatorios
    it('Registration process without required data', async function (){

        //Obtengo la libreria por function para evitar errores de importación
        const chai = await import('chai');
        const expect = chai.expect;

        //solicitud para el testing
        const response = await requester.post('/api/session/register').send({}); 
        //se espera mensaje con datos faltantes
        expect(response.error.text).to.include('Faltan datos obligatorios: email o clave') 
    })

    //Obtener usuario actual
    it('Get current user', async function () {

        //Obtengo la libreria por function para evitar errores de importación
        const chai = await import('chai');
        const expect = chai.expect;

        const user = { email:'premium@gmail.com', password:'mel', role:'premium', first_name:'Mel' }
        
        //primero me logueo
        const login = await requester
        .post('/api/session/login')
        .send(user);
        //busco el token
        const tokenSearch = login.headers['set-cookie'][0];
        //separo el token de otros valores
        const tokenSplit = tokenSearch.split(';')[0] 
        const token = tokenSplit.split('=')[1]
        
        //solicitud para el testing
        const response = await requester
        .get('/api/session/current')
        .set('Authorization', `Bearer ${token}`)
        //se espera ver el email de usuario
        expect(response._body).to.have.property('email')
        
    })

    //Correo de restablecimiento de contraseña se envía ok
    it('Password reset email was delivered successfully', async function(){
        this.timeout(60000)

        //Obtengo la libreria por function para evitar errores de importación
        const chai = await import('chai');
        const expect = chai.expect;

        const user = { email: 'mel.olmos27@gmail.com' }
        const userId = '65fb7a37134080efbeee5b79'; 
        const token = generateResetToken(userId);
        
        //solicitud para el testing
        const response = await requester
        .post('/api/session/forgot-password')
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        //se espera un mensaje de éxito
        expect(response).to.have.property('text')
        expect(response.text).to.deep.include('Email Sent Successfully')
    })
})

//#endregion


//#region productos

describe('Products test', async () => {
    //antes de todos los test se ejecuta:
    before(function() {
        this.productService = new ProductManagerDB();
    })
    
    //Obtener todos los productos como un array de objetos
    it('Get all products as an array of objects', async function(){
        
        //Obtengo la libreria por function para evitar errores de importación
        const chai = await import('chai');
        const expect = chai.expect;

        const user = { email:'premium@gmail.com', password:'mel' }

        //primero me logueo
        const login = await requester
        .post('/api/session/login')
        .send(user);
        //busco el token
        const tokenSearch = login.headers['set-cookie'][0]
        //separo el token de otros valores
        const tokenSplit = tokenSearch.split(';')[0] 
        const token = tokenSplit.split('=')[1]
        
        //solicitud para el testing
        const response = await requester
        .get('/api/products-db')
        .set('Authorization', `Bearer ${token}`)

        //parseo la respuesta
        const responseBody = JSON.parse(response.text);

        responseBody.products.forEach(product => {
            //se espera array conteniendo objetos
            expect(responseBody.products).to.be.an('array')
            expect(product).to.be.an('object');
        })
    })

    // Crear producto sin autenticación me redirecciona al login
    it('Create a product redirects to login page when not authenticated', async function(){

        //Obtengo la libreria por function para evitar errores de importación
        const chai = await import('chai');
        const expect = chai.expect;

        //cierro cualquier sesion
        const logout = await requester.post('/api/session/logout')
        
        const productMock = {
        title: 'Camisa de algodón',
        description: 'Camisa de manga larga para hombre',
        price: 3500,
        thumbnail: 'URL de imagen',
        code: 'CAM001',
        stock: 50,
        category: 'Camisa'
        }
        
        //solicitud para el testing
        const result = await requester
            .post('/api/products-db')
            .send(productMock)
        //se espera redirección
        expect(result.status).to.equal(302)
    })

    // Manejo de errores ok, en este caso producto no encontrado
    it('Should handle product not found with error message', async function (){
        
        //Obtengo la libreria por function para evitar errores de importación
        const chai = await import('chai');
        const expect = chai.expect;
    
        const pid = 'IdIncorrectoParaGenerarError'

        //solicitud para el testin
        const result = await requester.get(`/api/products-db/${pid}`)
        //se espera mensaje de error
        expect(result._body).to.have.property('error') 
    })

    //Ruta de crear producto permitido para el rol premium
    it('Create product is allowed for role: premium', async function(){

        //Obtengo la libreria por function para evitar errores de importación
        const chai = await import('chai');
        const expect = chai.expect;
        
        //dejo listos un usuario premium y un producto
        const user = { email:'premium@gmail.com', password:'mel', role:'premium' }
        const productMock = {
        title: 'Camisa de algodón',
        description: 'Camisa de manga larga para hombre',
        price: 3500,
        thumbnail: 'URL de imagen',
        code: 'CAM001',
        stock: 50,
        category: 'Camisa',
        owner: 'premium@gmail.com'
        }
        
        //primero me logueo
        const login = await requester
        .post('/api/session/login')
        .send(user);
        //busco el token
        const tokenSearch = login.headers['set-cookie'][0]
        //separo el token de otros valores
        const tokenSplit = tokenSearch.split(';')[0] 
        const token = tokenSplit.split('=')[1]
        
        //solicitud para el testing
        const response = await requester
        .post('/api/products-db')
        .set('Authorization', `Bearer ${token}`)
        .send(productMock)
        //se espera que permita avanzar ok
        expect(response.status).to.equal(200)
    })
})

//#endregion