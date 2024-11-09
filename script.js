const menu = document.getElementById("menu")
const CartBtn = document.getElementById("cart-btn")
const CartModal  = document.getElementById("cart-modal")
const cartitemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("andress")
const addressWarm = document.getElementById("andress-warn")

let cart = [];


// adiciionando evento de abrir o carrinho 

CartBtn.addEventListener ("click", function() {
    updateCartModal(); // so adicione essa tecla depois de ter criado o botão remover no modal
    CartModal.style.display ="flex"
}) 

// fechar o modal quando clicar fora

CartModal.addEventListener("click", function(Event){
    if(Event.target === CartModal) {
        CartModal.style.display = "none"
    }
})

// fechar o modal na opção "fechar"

closeModalBtn.addEventListener("click", function(){
    CartModal.style.display = "none"
})

// comando de ativar o buttom

menu.addEventListener("click", function(event){
    // console.log(event.target)

    const parentButtom = event.target.closest(".add-to-card-btn")
    if(parentButtom){
        const name = parentButtom.getAttribute("data-name")
        const price = parseFloat(parentButtom.getAttribute("data-price"))
        addtoCart(name, price)
    }
})

// Função adicionar ao carrinho

function addtoCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        // se o item existir, aumenta a quantidade
        existingItem.quantity += 1
        
    }else {

        cart.push({
            name,
            price,
            quantity: 1,
        })


    }
    
    updateCartModal()

}


// atualizar o carrinho 

function updateCartModal(){
    cartitemsContainer.innerHTML = "";
    let total = 0;


    cart.forEach(item => {
        const cartitemelement = document.createElement("div")                    // inserindo o botao remover 
        cartitemelement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartitemelement.innerHTML = `
        <div class="flex items-center justify-between">  
        
            <div>  
                <P class="font-bold" >${item.name}</p>
                <P>Qtd:  ${item.quantity}</p>
                <P class="font-medium ,mt-2"> R$ ${item.price.toFixed(2)}</p>
            </div>



            <buttom class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </buttom>
     
        </div>
        `
// somando os produtos
        total += item.price * item.quantity;


        cartitemsContainer.appendChild(cartitemelement)
    })

    cartTotal.textContent = total.toLocaleString("PT-BR", {

        style: "currency",
        currency:"BRL"
    });

    // atualiza o numero do footer

    cartCounter.innerHTML = cart.length;
//



}

// funçao remover item

cartitemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeitemCart(name);
    }
})

function removeitemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);  // splice serve para remover o item da lista

        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarm.classList.add("hidden")
    }
})

// finalizar pedido

checkoutBtn.addEventListener("click", function(){ 
 // Esses commits permitem bloquear ação do cliente de pedir comida durante o horario que o restaurante ta fechado
    
     const isOpen = checkRestaurantOpen();
     if(!isOpen){
     
    Toastify({  text: "Vixe... Estamos fechados no momento, volte daqui a pouco!",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
    }).showToast();
    return;
    }

    /////////////////////////







    if(cart.length === 0) return;
    if(addressInput.value === ""){
    addressWarm.classList.remove("hidden")
    addressInput.classList.add("border-red-500") 
    return;  
    }




// enviar o pedido para api whats


const cartItems = cart.map((item) => {
    return ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(2)} |`;
}).join("");

// Calculando o total geral do pedido
const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

// Formatando a mensagem com a lista de itens e o total final
const message = encodeURIComponent(`${cartItems} \nTotal do Pedido: R$${orderTotal.toFixed(2)} | \nEndereço: ${addressInput.value} `);
const phone = "#";

// Enviando a mensagem para o WhatsApp (sem duplicar o endereço)
window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    updateCartModal();
    
})








// mudando as cores da tarja de horario do restaurante
    function checkRestaurantOpen (){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 11 && hora < 19;
    // true = o restaurante esta aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}