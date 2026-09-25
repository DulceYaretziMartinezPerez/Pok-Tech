function ptGetCart(){try{return JSON.parse(localStorage.getItem('pt_cart')||'[]')}catch(e){return[]}}
function ptSetCart(c){try{localStorage.setItem('pt_cart',JSON.stringify(c))}catch(e){}}
function ptRenderDrawer(){
 var cart=ptGetCart(),cn=document.getElementById('cn'),cl=document.getElementById('cl'),ct=document.getElementById('ct');
 if(cn)cn.textContent=cart.length;
 if(!cl)return;
 cl.innerHTML=cart.length?cart.map(function(p,i){return '<li><span>Pokédex '+p.n+' — $'+p.p+'</span><button data-r="'+i+'">Quitar</button></li>'}).join(''):'<li>Tu carrito está vacío. Elige una Pokédex del catálogo.</li>';
 ct.textContent='$'+cart.reduce(function(a,p){return a+p.p},0);
}
function ptAdd(n,p){var c=ptGetCart();c.push({n:n,p:p});ptSetCart(c);ptRenderDrawer();ptOpen(true)}
function ptRemove(i){var c=ptGetCart();c.splice(i,1);ptSetCart(c);ptRenderDrawer()}
function ptOpen(o){var dr=document.getElementById('dr'),ov=document.getElementById('ov'),cm=document.getElementById('cm');if(!dr)return;dr.classList.toggle('on',o);ov.classList.toggle('on',o);if(o&&cm)cm.textContent=''}
function ptInitCatalog(list){
 var cat=document.getElementById('cat');if(!cat)return;
 cat.innerHTML=list.map(function(p,i){return '<article class="bx pc"><div class="th" style="background:'+p.c+'"><i>Gen '+p.g+'</i><svg viewBox="0 0 60 80" aria-hidden="true"><rect x="5" y="4" width="50" height="72" rx="9" fill="#fff" stroke="#000" stroke-width="4"/><rect x="12" y="12" width="36" height="28" rx="4" fill="#000" stroke="#000" stroke-width="3"/><circle cx="20" cy="56" r="6" fill="'+p.c+'" stroke="#000" stroke-width="3"/><circle cx="42" cy="52" r="4" fill="#0075BE" stroke="#000" stroke-width="2"/><circle cx="42" cy="64" r="4" fill="#000"/></svg></div><div class="bd"><h3>'+p.n+'</h3><p>'+p.d+'</p><div class="pr"><b>$'+p.p+'</b><button class="btn r" data-add="'+i+'">Añadir</button></div></div></article>'}).join('');
 cat.addEventListener('click',function(e){var t=e.target;if(t.dataset.add!==undefined){var p=list[+t.dataset.add];ptAdd(p.n,p.p)}});
}
document.addEventListener('DOMContentLoaded',function(){
 ptRenderDrawer();
 var cb=document.getElementById('cb');if(cb)cb.onclick=function(){ptOpen(true)};
 var cx=document.getElementById('cx');if(cx)cx.onclick=function(){ptOpen(false)};
 var ov=document.getElementById('ov');if(ov)ov.onclick=function(){ptOpen(false)};
 var co=document.getElementById('co');if(co)co.onclick=function(){
  var cm=document.getElementById('cm'),cart=ptGetCart();
  cm.textContent=cart.length?'Gracias por tu pedido. Este es un sitio de demostración: no se realizó ningún cobro.':'Añade al menos una Pokédex para continuar.';
 };
 document.addEventListener('click',function(e){var t=e.target;if(t.dataset.r!==undefined)ptRemove(+t.dataset.r)});
});
