//importación de los módulos a utilizar 
const fs = require ('node:fs')
const path = require ('path')

//creación de clase

class ProductDaoFile {                             
        constructor () {
            this.path = path.resolve (__dirname,'../../../mockDB/Products.json')
            this.products = []
        } 

//método para leer el archivo de productos
    async readFileProducts(){                  
        try {
            if (fs.existsSync (this.path)) {
                const ProductsData = await fs.promises.readFile(this.path, 'utf-8')    
                const ProductsJs = await JSON.parse(ProductsData)                          
                return ProductsJs
            }else {
                return []
            }   

        } catch (error) {
            console.log ("Error en lectura de productos")               
        }
    }

//método para agregar un producto al array de productos inicial
    async addProduct(product){             
        try {
            const productsList = await this.readFileProducts ()

            //validación que todos los campos sean obligatorios
            if (!product.title ||                   
            !product.description ||
            !product.price ||
            !product.thumbail ||
            !product.code ||
            !product.stock)
            {
                return "Falta algún campo del producto"
            }                 

            //validación de campo code
            const result = productsList.find (prod => prod.code === product.code)  
            if (result) {
                return "Existe un producto con igual código"
            }

            //creación de id autoincrementable al agregar producto
            product.pid = productsList.length ? productsList.length + 1 : 1
            productsList.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(productsList, null, 2))
            return product
                        
        } catch (error) {
            console.log(error)
        }
    }

//método para devolver array con los productos existentes
    async get (){
        try {
            const ProductsJson = await fs.promises.readFile (this.path)
            const ProductsJs = JSON.parse (ProductsJson)
            return ProductsJs          

        } catch (error) {
            return new Error ("Not found products")
        }
    } 

//método para buscar en array producto por el id
    async getBy (pid) {
        try {
            const productsId = await this.readFileProducts ()
            const buscarId = productsId.find (product => product.pid === pid)
            if (buscarId) {
                return buscarId
            } else {
                return "Not found product"
        }
        } catch (error) {
            console.log(error)
        }
    }

//método para actualizar campo del producto en archivo según id
    async update (pid, price, newValue) {
        try {
            const datosActuales = await this.readFileProducts () 
            const elemActualizar = datosActuales.find (product => product.pid === pid)
            if (elemActualizar) {
                elemActualizar[price] = newValue
                await fs.promises.writeFile(this.path, JSON.stringify(datosActuales, null, 2))
                return elemActualizar
            } else {
                console.log ("No se encontró el id indicado")
        }
        } catch (error) {
            console.log(error)
        }
    }

//método para eliminar producto en archivo según id
    async delete (pid) {
        try {
            const datosActuales = await this.readFileProducts();
            const nvosDatos = datosActuales.filter((product) => product.pid !== pid);
        
            if (nvosDatos.length === datosActuales.length) {
            return "No se encontró producto con el id indicado";
            }
        
            await fs.promises.writeFile(this.path, JSON.stringify(nvosDatos, null, 2));
            return "Se eliminó el producto con el id indicado";
        } catch (error) {
            console.error(error);
        }
    } 
}

//creación de productos 
const product1 = {
    title: "product1", 
    description: "cartera de cuero", 
    price: 15000, 
    thumbail: "imagen", 
    code: "abc01", 
    stock: 30
}

const product2 = {
    title: "product2", 
    description: "billetera de cuero", 
    price: 3000, 
    thumbail: "imagen", 
    code: "abc02", 
    stock: 10
}

const product3 = {
    title: "product3", 
    description: "portalapicero", 
    price: 2000, 
    thumbail: "imagen", 
    code: "abc03", 
    stock: 5
}

const product4 = {
    title: "product4", 
    description: "bandolera animal print", 
    price: 13000, 
    thumbail: "imagen", 
    code: "abc04", 
    stock: 2
}

const product5 = {
    title: "product5", 
    description: "cartuchera", 
    price: 1500, 
    thumbail: "imagen", 
    code: "abc05", 
    stock: 15
}


const test = async () => {
    const products = new ProductManager()
    console.log(await products.addProduct(product1))
    console.log(await products.addProduct(product2))
    console.log(await products.addProduct(product3))
    console.log(await products.addProduct(product4))
    console.log(await products.addProduct(product5))
    console.log(await products.getProducts())
    //console.log(await products.getProductsById(1))
    //console.log(await products.updateProduct(5, "price", 2300))
    //console.log(await products.deleteProduct(5))
}

test ()

//exportación del módulo
module.exports = ProductDaoFile         