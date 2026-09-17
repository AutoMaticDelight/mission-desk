/* Hold-to-confirm for every sheet: a tap does nothing, a 750 ms hold fires the original action. */
(function(){
  document.querySelectorAll('.sheet').forEach(function(sheet){
    var title = sheet.querySelector('h3,h2');
    if (title && !sheet.querySelector('.glove-kicker')) {
      var k = document.createElement('div'); k.className='glove-kicker'; k.innerHTML='<i></i>Operator decision · this changes what the machine does';
      title.parentNode.insertBefore(k, title);
    }
    var actions = sheet.querySelector('.sheet-actions,.actionsheet');
    if (actions && !sheet.querySelector('.glove-hint')) {
      var h = document.createElement('div'); h.className='glove-hint';
      h.innerHTML='<b>Nothing happens until you hold the green button.</b> Let go early to cancel. BACK changes nothing.';
      actions.parentNode.insertBefore(h, actions);
    }
  });
  document.querySelectorAll('.sheet .confirm').forEach(function(btn){
    var orig = btn.getAttribute('onclick'); if (!orig) return;
    btn.removeAttribute('onclick');
    var fire = new Function(orig), timer = null, busy = false;
    function start(e){ if (busy) return; if (e.pointerType==='mouse' && e.button!==0) return; btn.classList.add('holding');
      timer = setTimeout(function(){ timer=null; busy=true; btn.classList.remove('holding'); btn.classList.add('fired'); fire.call(btn);
        setTimeout(function(){ busy=false; btn.classList.remove('fired'); }, 1400); }, 750); }
    function cancel(){ if (timer){ clearTimeout(timer); timer=null; } btn.classList.remove('holding'); }
    btn.addEventListener('pointerdown', start);
    ['pointerup','pointerleave','pointercancel'].forEach(function(ev){ btn.addEventListener(ev, cancel); });
    btn.addEventListener('click', function(e){ e.preventDefault(); e.stopImmediatePropagation(); }, true);
    btn.addEventListener('keydown', function(e){ if ((e.key==='Enter'||e.key===' ') && !busy){ e.preventDefault(); busy=true; btn.classList.add('fired'); fire.call(btn); setTimeout(function(){ busy=false; btn.classList.remove('fired'); },1400); } });
  });
})();
