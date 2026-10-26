# Pelin Pastanesi Moda

HTML, CSS ve JavaScript ile hazırlanmış statik web sitesi. Kurulum veya derleme gerektirmez; index.html dosyasını tarayıcıda açabilirsiniz.

## GitHub Pages

Settings > Pages > Deploy from a branch > main > /(root) > Save.
.nojekyll dosyası statik dosyaların doğrudan yayınlanmasını sağlar. Kaynak bağlantıları göreli olduğu için depo alt yolunda da çalışır.

## Dosyalar

- index.html: Türkçe içerik ve sayfa yapısı
- styles.css, layout.css, motion.css: görünüm ve responsive tasarım
- app.js: menü, ürün filtresi ve detay penceresi
- motion.js: hareket kontrolü, kaydırma geçişleri ve hareketli şerit
- assets/: yerel görseller, SVG figürler ve fontlar
- tests/: kaynak ve tarayıcı etkileşim testleri
- tools/prepare_assets.py: görselleri ve fontları yeniden indirme aracı

Test: python -m unittest discover -s tests -v

## İçerik ve görseller

Telefon, Instagram hesabı ve çalışma saatleri işletme için kullanıcı tarafından verilmiştir. Sokak adresi kayıtlarda tutarsız olduğundan yalnızca Caferağa / Kadıköy gösterilmektedir. Görseller temsili, ürün seçkisi örnektir; gerçek işletme fotoğrafları ve güncel menü ile değiştirilebilir. Ödeme veya çevrimiçi sipariş altyapısı yoktur.

Fotoğraflar Unsplash kaynağından indirilmiştir. Fotoğraf kimlikleri tools/prepare_assets.py içindedir. Yazı tipleri Cormorant Garamond ve DM Sans, Google Fonts üzerinden indirilmiştir. SVG pasta figürleri bu proje için çizilmiştir.

Araştırma kayıtları:
- https://www.instagram.com/modapelinpastanesi/
- https://yandex.com.tr/maps/org/pelin_pastanesi_moda/93927934399/
- https://www.tikla.com.tr/pelin-pastanesi-moda.html

previews/ ve Python önbellekleri yerel geliştirme çıktısıdır; kişisel dosya yolları içerebildikleri için .gitignore ile depodan hariç tutulur.
