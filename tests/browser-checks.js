/* Tarayıcıda çalıştırılabilen regresyon testleri. Sayfa açıldıktan sonra bu dosyayı konsolda çalıştırın. */
window.pelinTests = {
  motion() {
    const assert=(ok,message)=>{if(!ok) throw new Error(message)};
    assert(document.querySelectorAll('.pastry-figure').length>=3,'En az üç hareketli pasta figürü olmalı');
    const toggle=document.querySelector('#motion-toggle');
    assert(toggle,'Hareketi durdurma düğmesi olmalı');
    if(toggle.getAttribute('aria-pressed')==='true') toggle.click();
    toggle.click();
    assert(toggle.getAttribute('aria-pressed')==='true','Hareket durdurulabilmeli');
    assert(document.documentElement.classList.contains('motion-paused'),'Durdurma durumu sayfaya uygulanmalı');
    toggle.click();
    assert(toggle.getAttribute('aria-pressed')==='false','Hareket yeniden başlatılabilmeli');
    return 'PASS: üç pasta figürü ve hareket kontrolü';
  },
  filter() {
    const assert=(ok,message)=>{if(!ok) throw new Error(message)};
    document.querySelector('[data-filter="pasta"]').click();
    const visible=[...document.querySelectorAll('.product')].filter(x=>!x.hidden);
    assert(visible.length===2 && visible.every(x=>x.dataset.category==='pasta'),'Pasta filtresi yalnızca iki pasta göstermeli');
    assert(document.querySelector('[data-filter="pasta"]').getAttribute('aria-pressed')==='true','Filtre seçimi erişilebilir olmalı');
    document.querySelector('[data-filter="all"]').click();
    assert([...document.querySelectorAll('.product')].every(x=>!x.hidden),'Tüm seçki altı ürünü geri getirmeli');
    return 'PASS: kategori filtresi ve sıfırlama';
  },
  dialog() {
    const assert=(ok,message)=>{if(!ok) throw new Error(message)};
    const trigger=document.querySelector('.product-open');
    trigger.click();
    const dialog=document.querySelector('#product-dialog');
    assert(dialog.open,'Ürün tıklanınca detay penceresi açılmalı');
    assert(document.querySelector('#dialog-title').textContent===trigger.querySelector('h3').textContent,'Seçilen ürünün başlığı gösterilmeli');
    document.querySelector('.dialog-close').click();
    assert(!dialog.open,'Kapat düğmesi pencereyi kapatmalı');
    assert(!document.body.classList.contains('modal-open'),'Kaydırma kilidi kaldırılmalı');
    return 'PASS: ürün detay penceresi';
  },
  menu() {
    const assert=(ok,message)=>{if(!ok) throw new Error(message)};
    const button=document.querySelector('.menu-toggle');
    button.click();
    assert(button.getAttribute('aria-expanded')==='true','Mobil menü açılmalı');
    assert(document.querySelector('#navigation').classList.contains('open'),'Gezinme görünür olmalı');
    document.querySelector('#navigation a').click();
    assert(button.getAttribute('aria-expanded')==='false','Bağlantı seçilince menü kapanmalı');
    return 'PASS: mobil menü';
  }
};
