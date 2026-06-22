const money=n=>`L${Number(n).toFixed(2)}`;
const products=[
 {id:1,name:'Café Nayilu Tradicional 250 g',qty:'250 g',price:120,type:'tradicional',img:'img/producto_1.jpg',tag:'Tradicional',desc:'Presentación práctica para probar el sabor Nayilu.'},
 {id:2,name:'Café Nayilu Premium 454 g',qty:'454 g / 1 libra',price:180,type:'tradicional',img:'img/producto_2.jpg',tag:'Más vendido',desc:'Bolsa premium ideal para el consumo diario en casa.'},
 {id:3,name:'Café Nayilu Familiar 908 g',qty:'908 g / 2 libras',price:320,type:'tradicional',img:'img/producto_3.jpg',tag:'Familiar',desc:'Presentación grande para compartir con toda la familia.'}
];
const launches=[
 {id:4,name:'Café Nayilu con Cacao',qty:'250 g',price:165,type:'nuevo',img:'img/lanzamiento_1.jpg',tag:'Nuevo',desc:'Notas suaves de cacao para una experiencia cálida y especial.'},
 {id:5,name:'Café Nayilu con Canela',qty:'454 g / 1 libra',price:230,type:'nuevo',img:'img/lanzamiento_2.jpg',tag:'Nuevo',desc:'Aroma dulce y especiado, perfecto para tardes en familia.'},
 {id:6,name:'Café Nayilu con Pimienta',qty:'908 g / 2 libras',price:390,type:'nuevo',img:'img/lanzamiento_3.jpg',tag:'Intenso',desc:'Una mezcla atrevida, elegante y ligeramente especiada.'},
 {id:7,name:'Nayilu Gourmet 3 Sabores',qty:'Edición especial 250 g',price:210,type:'gourmet',img:'img/lanzamiento_4.jpg',tag:'Edición especial',desc:'Canela, cacao y pimienta en una mezcla premium exclusiva.'}
];
const all=[...products,...launches];
let cart=JSON.parse(localStorage.getItem('nayilu_cart')||'[]');
let favs=JSON.parse(localStorage.getItem('nayilu_favs')||'[]');
let pendingMessage='';

window.addEventListener('load',()=>setTimeout(()=>document.getElementById('loader').classList.add('hidden'),700));

function productCard(p){return `<article class="product-card" data-name="${p.name.toLowerCase()}" data-type="${p.type}">
 <div class="product-image"><img src="${p.img}" alt="${p.name}"><span class="shine"></span></div>
 <div class="product-body"><span class="label">${p.tag}</span><h3>${p.name}</h3><p><b>${p.qty}</b></p><div class="stars">★★★★★</div><p>${p.desc}</p><div class="price">${money(p.price)}</div><div class="product-actions"><button class="btn" onclick="addCart(${p.id})">Agregar</button><button class="mini-btn" onclick="buyNow(${p.id})">Comprar ahora</button><button class="mini-btn" onclick="toggleFav(${p.id})">${favs.includes(p.id)?'❤️':'🤍'}</button><button class="mini-btn" onclick="zoomProduct(${p.id})">Zoom</button></div></div>
 </article>`}
function renderProducts(){document.getElementById('productGrid').innerHTML=products.map(productCard).join('');document.getElementById('launchGrid').innerHTML=launches.map(productCard).join('');filterProducts()}
function filterProducts(){const q=(document.getElementById('searchInput')?.value||'').toLowerCase();const f=document.getElementById('filterSelect')?.value||'todos';document.querySelectorAll('.product-card').forEach(c=>{const okName=c.dataset.name.includes(q);const okType=f==='todos'||c.dataset.type===f;c.style.display=okName&&okType?'block':'none'})}
document.getElementById('searchInput').addEventListener('input',filterProducts);document.getElementById('filterSelect').addEventListener('change',filterProducts);

function saveCart(){localStorage.setItem('nayilu_cart',JSON.stringify(cart));renderCart();updateClubProgress()}
function addCart(id){let item=cart.find(i=>i.id===id);item?item.quantity++:cart.push({id,quantity:1});saveCart();openCart();toast('✅ Producto agregado al carrito')}
function buyNow(id){addCart(id);document.getElementById('cartPanel').classList.add('open')}
function removeCart(id){cart=cart.filter(i=>i.id!==id);saveCart()}
function changeQty(id,n){let item=cart.find(i=>i.id===id);if(!item)return;item.quantity+=n;if(item.quantity<=0)removeCart(id);else saveCart()}
function clearCart(){if(confirm('¿Deseas eliminar todos los productos del carrito?')){cart=[];saveCart()}}
function totals(){let subtotal=cart.reduce((s,i)=>{const p=all.find(x=>x.id===i.id);return s+(p?p.price*i.quantity:0)},0);let discount=subtotal>=1000?subtotal*.05:0;let shipping=subtotal===0?0:(subtotal>=500?0:70);let total=subtotal-discount+shipping;return{subtotal,discount,shipping,total}}
function renderCart(){const box=document.getElementById('cartItems');box.innerHTML=cart.length?cart.map(i=>{const p=all.find(x=>x.id===i.id);if(!p)return '';return `<div class="cart-item"><img src="${p.img}" alt="${p.name}"><div><h4>${p.name}</h4><p>${p.qty}</p><p>Precio unitario: ${money(p.price)}</p><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${i.quantity}</span><button onclick="changeQty(${p.id},1)">+</button><b>${money(p.price*i.quantity)}</b></div></div><button class="remove" onclick="removeCart(${p.id})">🗑</button></div>`}).join(''):'<p>Tu carrito está vacío.</p>';
 const t=totals();document.getElementById('subtotal').textContent=money(t.subtotal);document.getElementById('discount').textContent=money(t.discount);document.getElementById('shipping').textContent=t.shipping===0?'Gratis':money(t.shipping);document.getElementById('total').textContent=money(t.total);document.getElementById('cartCount').textContent=cart.reduce((s,i)=>s+i.quantity,0)}
function openCart(){document.getElementById('cartPanel').classList.add('open')}
document.getElementById('cartBtn').onclick=openCart;document.getElementById('closeCart').onclick=()=>document.getElementById('cartPanel').classList.remove('open');document.getElementById('clearCartBtn').onclick=clearCart;
function toggleFav(id){favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];localStorage.setItem('nayilu_favs',JSON.stringify(favs));renderProducts();toast(favs.includes(id)?'❤️ Agregado a favoritos':'Favorito eliminado')}
function zoomProduct(id){const p=all.find(x=>x.id===id);showModal(`<h2>${p.name}</h2><img src="${p.img}" alt="${p.name}"><p><b>Cantidad:</b> ${p.qty}</p><p>${p.desc}</p><h3>${money(p.price)}</h3><br><button class="btn gold" onclick="addCart(${p.id});closeModal()">Agregar al carrito</button>`) }

const steps=[
 ['Moler café','img/preparacion_1.jpg','Usa café fresco Nayilu y mide 1 o 2 cucharadas por taza. Si tienes molino, usa una molienda media.','Consejo Nayilu: prepara solo la cantidad que vas a consumir para conservar mejor el aroma.'],
 ['Hervir agua','img/preparacion_2.jpg','Calienta agua limpia sin dejarla hervir demasiado. La temperatura ideal está cerca de 90° a 96°.','Consejo Nayilu: el agua muy caliente puede afectar el sabor.'],
 ['Preparar','img/preparacion_3.jpg','Agrega el café al filtro o cafetera y vierte el agua lentamente para extraer mejor aroma y cuerpo.','Consejo Nayilu: deja que el café respire unos segundos antes de terminar el filtrado.'],
 ['Servir','img/preparacion_4.jpg','Sirve en una taza caliente para mantener mejor la temperatura y el aroma.','Consejo Nayilu: acompáñalo con pan artesanal o postre.'],
 ['Disfrutar','img/preparacion_5.jpg','Toma tu café con calma y comparte el momento con quienes más quieres.','Consejo Nayilu: cada taza puede convertirse en un momento especial.']
];
const recipes=[
 ['Café Latte Nayilu','img/receta_1.jpg','Café Nayilu, leche caliente, azúcar o miel y canela.','Prepara café fuerte, espuma la leche, mezcla suavemente y decora con canela.'],
 ['Café helado','img/receta_2.jpg','Café Nayilu frío, hielo, leche, vainilla y caramelo.','Prepara el café, enfría, agrega hielo y mezcla con leche y vainilla.'],
 ['Postre de café','img/receta_3.jpg','Café Nayilu, crema, galletas y leche condensada.','Mezcla crema con café, arma capas con galletas y refrigera.'],
 ['Café con canela','img/receta_4.jpg','Café Nayilu, canela, leche opcional y endulzante.','Agrega canela durante la preparación y sirve caliente.'],
 ['Café mocha','img/receta_5.jpg','Café Nayilu, cacao, leche y crema.','Mezcla café con cacao, agrega leche caliente y decora con crema.']
];
function renderInfoCards(){document.getElementById('stepsGrid').innerHTML=steps.map((s,i)=>`<article onclick="openStep(${i})"><img src="${s[1]}"><h3>${i+1}. ${s[0]}</h3><p>${s[2].slice(0,80)}...</p></article>`).join('');document.getElementById('recipeGrid').innerHTML=recipes.map((r,i)=>`<article onclick="openRecipe(${i})"><img src="${r[1]}"><h3>${r[0]}</h3><p>${r[2]}</p></article>`).join('')}
function openStep(i){const s=steps[i];showModal(`<h2>${i+1}. ${s[0]}</h2><img src="${s[1]}"><p>${s[2]}</p><h3>Consejo Nayilu</h3><p>${s[3]}</p>`)}
function openRecipe(i){const r=recipes[i];showModal(`<h2>${r[0]}</h2><img src="${r[1]}"><h3>Ingredientes</h3><p>${r[2]}</p><h3>Preparación</h3><p>${r[3]}</p><h3>Consejo Nayilu</h3><p>Sirve con una taza de Café Nayilu recién preparada para mejorar el aroma y la experiencia.</p>`)}

function showModal(html){document.getElementById('modalContent').innerHTML=html;document.getElementById('modal').classList.add('show')}function closeModal(){document.getElementById('modal').classList.remove('show')}document.getElementById('closeModal').onclick=closeModal;document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
document.getElementById('songBtn').onclick=()=>document.getElementById('songModal').classList.add('show');document.getElementById('closeSong').onclick=()=>document.getElementById('songModal').classList.remove('show');document.getElementById('songModal').addEventListener('click',e=>{if(e.target.id==='songModal')document.getElementById('songModal').classList.remove('show')});

document.getElementById('checkoutBtn').onclick=()=>{if(!cart.length){alert('Tu carrito está vacío.');return}const t=totals();const pay=document.getElementById('paymentMethod').value;const list=cart.map(i=>{const p=all.find(x=>x.id===i.id);return `• ${p.name} (${p.qty}) x${i.quantity} — ${money(p.price*i.quantity)}`}).join('\n');pendingMessage=`✨ ¡Todo listo! Aquí tienes el total de tu orden:

Quedamos atentos al comprobante de pago para empezar a preparar tu pedido. ¡Muchas gracias por elegir café nayilu! 🛍️

🛒 Detalle de productos:
${list}

📊 Resumen:
Subtotal: ${money(t.subtotal)}
Descuento: ${money(t.discount)}
Envío: ${t.shipping===0?'Gratis':money(t.shipping)}
Total referencial: ${money(t.total)}

💳 Método de pago seleccionado:
${pay}

📍 Datos del pedido:
Tienda: Café Nayilu
Ubicación: San Luis, Comayagua, Honduras
Cliente: Por confirmar
Dirección de entrega: Por confirmar

☕ Nuestro equipo confirmará disponibilidad, método de pago, seguimiento y tiempo de entrega.

Gracias por comprar en Café Nayilu. Será un gusto preparar tu pedido con cariño y calidad hondureña.`;showModal(`<h2>✅ Resumen del pedido</h2><p><b>Subtotal:</b> ${money(t.subtotal)}</p><p><b>Descuento:</b> ${money(t.discount)}</p><p><b>Envío:</b> ${t.shipping===0?'Gratis':money(t.shipping)}</p><h3>Total: ${money(t.total)}</h3><p><b>Método:</b> ${pay}</p><br><button class="btn gold" onclick="openWhatsApp()">Confirmar pedido por WhatsApp</button>`)};
function openWhatsApp(){window.open('https://wa.me/504988400093?text='+encodeURIComponent(pendingMessage),'_blank');closeModal()}
window.openWhatsApp=openWhatsApp;

const quicks=[['🛍️ Productos','productos'],['💲 Precios','precios'],['🚚 Entregas','entregas'],['📦 Seguimiento','seguimiento'],['⭐ Recomendaciones','recomendaciones'],['🕒 Horarios','horarios'],['📞 Contacto','contacto'],['💳 Pagos','pagos'],['🎁 Promociones','promociones']];
function renderQuick(){document.getElementById('quickOptions').innerHTML=quicks.map(q=>`<button onclick="quickReply('${q[1]}')">${q[0]}</button>`).join('')}
function response(k){const t=k.toLowerCase();if(t.includes('horario'))return 'Nuestro horario es de lunes a sábado, de 8:00 a.m. a 6:00 p.m. ☕';if(t.includes('producto')||t.includes('café')||t.includes('cafe'))return 'Tenemos Café Nayilu en 250 g, 454 g y 908 g. También lanzamientos con cacao, canela, pimienta y edición gourmet.';if(t.includes('precio'))return 'Los precios principales son: 250 g L120, 454 g L180 y 908 g L320. Los lanzamientos tienen precios especiales desde L165.';if(t.includes('entrega')||t.includes('envio')||t.includes('envío'))return 'Realizamos entregas en Honduras. En compras mayores a L500 el envío es gratis 🚚';if(t.includes('seguimiento')||t.includes('pedido'))return 'Para seguimiento de pedido, escríbenos por WhatsApp con tu nombre y el detalle de tu orden.';if(t.includes('recomend'))return 'Te recomiendo 454 g para consumo diario, 908 g para familia, con cacao para un sabor dulce y gourmet si buscas algo exclusivo.';if(t.includes('contacto')||t.includes('whatsapp'))return 'Puedes contactarnos por WhatsApp al +504 9884-00093, Instagram @nayilu.cafe o correo yilianpadilla8@gmail.com 💬';if(t.includes('pago'))return 'Aceptamos tarjeta, transferencia bancaria, pago contra entrega, billetera móvil y pago por enlace.';if(t.includes('promo')||t.includes('descuento'))return 'Tenemos envío gratis en compras mayores a L500 y el Club Nayilu: compra 10 bolsas y recibe 1 gratis 🎁';return 'Puedo ayudarte con productos, precios, entregas, seguimiento de pedidos, recomendaciones, horarios, pagos, promociones y contacto.'}
function addMsg(text,type='bot'){const body=document.getElementById('chatBody');body.innerHTML+=`<div class="msg ${type}">${text}</div>`;body.scrollTop=body.scrollHeight}
function quickReply(k){addMsg(quicks.find(q=>q[1]===k)?.[0]||k,'user');setTimeout(()=>addMsg(response(k),'bot'),250)}
function sendChat(){const input=document.getElementById('chatInput');const text=input.value.trim();if(!text)return;addMsg(text,'user');input.value='';setTimeout(()=>addMsg(response(text),'bot'),350)}
document.getElementById('chatBtn').onclick=()=>document.getElementById('chatbot').classList.toggle('open');document.getElementById('closeChat').onclick=()=>document.getElementById('chatbot').classList.remove('open');document.getElementById('sendChat').onclick=sendChat;document.getElementById('chatInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendChat()});

function updateClubProgress(){const bags=cart.reduce((s,i)=>s+i.quantity,0)%10;document.getElementById('clubProgress').style.width=(bags*10)+'%';document.getElementById('clubProgressText').textContent=bags===0&&cart.length?'¡Ya puedes reclamar una bolsa gratis!':`${bags} de 10 bolsas`}
document.getElementById('clubForm').onsubmit=e=>{e.preventDefault();const data={name:clubName.value,whatsapp:clubWhats.value,email:clubEmail.value,city:clubCity.value,birthday:clubBirthday.value,favorite:clubFavorite.value};localStorage.setItem('nayilu_club',JSON.stringify(data));showModal(`<h2>🎉 ¡Bienvenido al Club Nayilu, ${data.name}!</h2><p>Desde hoy disfrutarás promociones exclusivas, lanzamientos antes que todos, descuentos especiales y una bolsa GRATIS al completar 10 bolsas compradas.</p>`)};
function loadClub(){const data=JSON.parse(localStorage.getItem('nayilu_club')||'null');if(data){document.querySelector('.club-info p').innerHTML=`👋 ¡Hola, <b>${data.name}</b>! Bienvenida nuevamente al Club Nayilu. Recuerda: por cada 10 bolsas, recibes 1 gratis.`}}

function startTimer(){let sec=2*3600+35*60+40;setInterval(()=>{sec=Math.max(0,sec-1);const h=String(Math.floor(sec/3600)).padStart(2,'0'),m=String(Math.floor(sec%3600/60)).padStart(2,'0'),s=String(sec%60).padStart(2,'0');document.getElementById('timer').textContent=`${h}:${m}:${s}`},1000)}
function createBeans(){const b=document.getElementById('beans');for(let i=0;i<34;i++){let e=document.createElement('span');e.className='bean';e.textContent='🫘';e.style.left=Math.random()*100+'%';e.style.fontSize=14+Math.random()*20+'px';e.style.animationDuration=8+Math.random()*12+'s';e.style.animationDelay=Math.random()*8+'s';b.appendChild(e)}}
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>obs.observe(e));
document.getElementById('themeBtn').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('nayilu_theme',document.body.classList.contains('dark')?'dark':'light')};if(localStorage.getItem('nayilu_theme')==='dark')document.body.classList.add('dark');
document.getElementById('menuBtn').onclick=()=>document.getElementById('navLinks').classList.toggle('open');document.querySelectorAll('.nav-links a').forEach(a=>a.onclick=()=>document.getElementById('navLinks').classList.remove('open'));
const topBtn=document.getElementById('toTop');window.addEventListener('scroll',()=>topBtn.classList.toggle('show',scrollY>650));topBtn.onclick=()=>scrollTo({top:0,behavior:'smooth'});
function toast(text){const t=document.createElement('div');t.textContent=text;t.style.cssText='position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#1B5E20;color:white;padding:13px 18px;border-radius:999px;z-index:7000;box-shadow:0 15px 35px rgba(0,0,0,.25);font-weight:900';document.body.appendChild(t);setTimeout(()=>t.remove(),1900)}

renderProducts();renderInfoCards();renderCart();renderQuick();startTimer();createBeans();loadClub();updateClubProgress();
