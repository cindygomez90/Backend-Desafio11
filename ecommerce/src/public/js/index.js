const socket = io() 

//manejo de formulario de carga de productos (vista realTimeProducts.handlebars)
function addProduct() {
    
    let title = document.getElementById("title").value
    let description = document.getElementById("description").value
    let price = document.getElementById("price").value
    let thumbnail = document.getElementById("thumbnail").value
    let code = document.getElementById("code").value
    let stock = document.getElementById("stock").value
    let category = document.getElementById("category").value
    
    if (parseFloat(price) < 0 || parseInt(stock) < 0) {
        alert("El precio y el stock no pueden ser números negativos.")
        return;
    }

    socket.emit("addProduct", { title, description, price, thumbnail, code, stock, category})

    document.getElementById("title").value = ""
    document.getElementById("description").value = ""
    document.getElementById("price").value = ""
    document.getElementById("thumbnail").value = ""
    document.getElementById("code").value = ""
    document.getElementById("stock").value = ""
    document.getElementById("category").value = ""
}


function deleteProduct(productId) {
    socket.emit("deleteProduct", { pid: productId });
}

socket.on("updateProducts", (data) => {
    console.log("Tipo de 'data.products':", typeof data)
    console.log("Contenido de 'data.products':", data)

const productList = document.getElementById("productList")

if (productList && Array.isArray(data)) {
    productList.innerHTML = "";
    
    data.forEach((product) => {
    const productContainer = document.createElement("li")
        productContainer.innerHTML = `   
        Nombre: ${product.title}<br>
        Descripción: ${product.description}<br>
        Precio: ${product.price}<br>
        Imagen: ${product.thumbnail}<br>
        Código: ${product.code}<br>
        Stock: ${product.stock}<br>
        Categoría: ${product.category}<br>
        
        <button type="button" class="boton-eliminar" onclick="deleteProduct('${product._id}')">Eliminar</button>
        `;
        productList.appendChild(productContainer);
    })
} else {
    console.log("Error: La estructura de datos de 'data' no es válida.")
}
})

//manejo de chat (vista chat.handlebars)
let user

Swal.fire({
    title: 'Identifícate',
    input: 'text',
    text: 'Ingresá el usuario para identificarte en el chat',
    inputValidator: value =>{       
        return !value && 'Necesitas ingresar un usuario para continuar'
    },
    allowOutsideClick: false    
}).then( result =>  {         
    user=result.value
    console.log(user)
})


const chatbox = document.getElementById('chatbox')  

chatbox.addEventListener('submit', (event) => {
    event.preventDefault()

    const messageInput = document.querySelector('input[name="message"]')
    const message = messageInput.value.trim()

    if (message.length > 0) {
        socket.emit('message', { user, message })

        messageInput.value = ''
    }
})

socket.on('chat', data => {
    let chat = document.querySelector('#chat') 
    let messages = ''
    data.forEach(message => {      
        messages += `<li><strong>${message.user} dice:</strong> ${message.message}</li>` 
    })
    chat.innerHTML += messages 
})

