const select = (el) =>{
    return document.querySelector(el)
};
const all = (el) =>{
    return document.querySelectorAll(el);
};
let cart = [];
let modalQt = 1;
let modalkey = 0;

pizzaJson.map((pizza, valueID) =>{
    let pizzaItem = select ('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', valueID);
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;
    //janela click
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalkey = key;
            select('.pizzaBig img').src = pizzaJson[key].img
            select('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
            select('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
            select('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
            select('.pizzaInfo--size.selected').classList.remove('selected');            
            all('.pizzaInfo--size').forEach((size, sizeValue) =>{
                if(sizeValue === 2){
                    size.classList.add('selected');
                }
                size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeValue];
            });
            select('.pizzaInfo--qt').innerHTML = modalQt;
            select('.pizzaWindowArea').style.opacity = 0;
            select('.pizzaWindowArea').style.display = 'flex';
            setTimeout(() =>{
                select('.pizzaWindowArea').style.opacity = 1;
            },150);
    });
    
    select ('.pizza-area').append( pizzaItem );
});
//eventos da janela
function closeJ(){
    select('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() =>{
        select('.pizzaWindowArea').style.display = 'none';
    },500);
}
all('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) =>{
    item.addEventListener('click',closeJ);
});
// +/-
select('.pizzaInfo--qtmenos').addEventListener('click',(() =>{
    if(modalQt > 1){
    modalQt--;
    select('.pizzaInfo--qt').innerHTML = modalQt;
    }
}));
select('.pizzaInfo--qtmais').addEventListener('click', (() =>{
    modalQt++;
    select('.pizzaInfo--qt').innerHTML = modalQt;
}));
//opçoes.
all('.pizzaInfo--size').forEach((size, sizeValue) =>{
        size.addEventListener('click', ((e) =>{
            select('.pizzaInfo--size.selected').classList.remove('selected');
            size.classList.add('selected');
        }))
});
//add
select('.pizzaInfo--addButton').addEventListener('click', (() =>{
    let size = parseInt(select('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalkey].id + '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if(key >-1){
        cart[key].qt += modalQt;
    }else{
    cart.push({
        identifier,
        id:pizzaJson[modalkey].id,
        size:size,
        qt:modalQt
    });
}   
    updateCart();
    closeJ();
}));
select('.menu-openner').addEventListener('click', () =>{
    if(cart.length > 0){
        select('aside').style.left = '0';
    }
});
select('.menu-closer').addEventListener('click', () =>{
    select('aside').style.left = '100vw'
})
function updateCart(){
    select('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0){
        select('aside').classList.add('show');
        select('.cart').innerHTML = '';
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            let cartItem = select('.models .cart--item').cloneNode(true);
            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                        case 1:
                            pizzaSizeName = 'M';
                            break
                                case 2:
                                    pizzaSizeName = 'G'
            }
            let pizzaName = `${pizzaItem.name}(${pizzaSizeName})`;
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',(() =>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }
                updateCart()
            }));
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', (() => {
                cart[i].qt++;
                updateCart();
            }));
            select('.cart').append(cartItem)
            
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        select('.subtotal span:last-child').innerHTML = ` R$ ${subtotal.toFixed(2)}`
        select('.desconto span:last-child').innerHTML = ` R$ ${desconto.toFixed(2)}`
        select('.total span:last-child').innerHTML = ` R$ ${total.toFixed(2)}`
    }else{
        select('aside').classList.remove('show');
        select('aside').style.left = '100vw';
    }
};