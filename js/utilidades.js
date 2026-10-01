/* Utilidades: dibuja las tarjetas del catálogo */
function ptInitCatalog(list){
 var cat=document.getElementById('cat');if(!cat)return;
 cat.innerHTML=list.map(function(p){return '<article class="bx pc"><div class="th" style="background:'+p.c+'"><i>Gen '+p.g+'</i><svg viewBox="0 0 60 80" aria-hidden="true"><rect x="5" y="4" width="50" height="72" rx="9" fill="#fff" stroke="#000" stroke-width="4"/><rect x="12" y="12" width="36" height="28" rx="4" fill="#000" stroke="#000" stroke-width="3"/><circle cx="20" cy="56" r="6" fill="'+p.c+'" stroke="#000" stroke-width="3"/><circle cx="42" cy="52" r="4" fill="#0075BE" stroke="#000" stroke-width="2"/><circle cx="42" cy="64" r="4" fill="#000"/></svg></div><div class="bd"><h3>Pokédex '+p.n+'</h3><p>'+p.d+'</p><div class="pr"><b>$'+p.p+'</b></div></div></article>'}).join('');
}
