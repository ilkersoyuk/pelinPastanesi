"""Bağımlılıksız kaynak ve taşınabilirlik testleri: python -m unittest discover -s tests -v"""
import unittest
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.ids=set(); self.refs=[]; self.assets=[]; self.lang=None; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='html': self.lang=a.get('lang')
        if 'id' in a: self.ids.add(a['id'])
        if tag=='a' and a.get('href','').startswith('#'): self.refs.append(a['href'][1:])
        if tag in ('img','script','link'):
            src=a.get('src') or a.get('href','')
            if src and not src.startswith(('https:','http:','data:')): self.assets.append(src)

class SiteTests(unittest.TestCase):
    def test_turkish_portable_landing_with_working_navigation(self):
        self.assertTrue((ROOT/'index.html').exists(), 'Türkçe açılış sayfası henüz oluşturulmadı')
        doc=Document((ROOT/'index.html').read_text(encoding='utf-8'))
        self.assertEqual(doc.lang,'tr')
        self.assertTrue({'lezzetler','hakkinda','ziyaret'} <= doc.ids)
        for ref in doc.refs: self.assertIn(ref, doc.ids)
        for asset in doc.assets: self.assertTrue((ROOT/asset).is_file(), f'Eksik yerel dosya: {asset}')

    def test_phone_only_appears_in_contact_card(self):
        html=(ROOT/'index.html').read_text(encoding='utf-8')
        self.assertEqual(html.count('0216 338 5284'),1)
        self.assertEqual(html.count('href="tel:02163385284"'),1)
        card=html.split('class="visit-note-card"',1)[1].split('</section>',1)[0]
        self.assertIn('Telefonun<br>ucundayız.',card)
        self.assertIn('href="tel:02163385284"',card)
        self.assertNotIn('class="mobile-call"',html)

    def test_instagram_is_a_profile_link_not_a_fake_gallery(self):
        html=(ROOT/'index.html').read_text(encoding='utf-8')
        self.assertIn('https://www.instagram.com/modapelinpastanesi/',html)
        self.assertIn('Instagram’da takip edin.',html)
        self.assertNotIn('Pastaneden kareler.',html)
        self.assertIn('06.00 – 22.00',html)

    def test_hero_uses_a_different_photo_than_product_cards(self):
        import runpy
        photos=runpy.run_path(str(ROOT/'tools'/'prepare_assets.py'))['PHOTOS']
        self.assertNotIn(photos['hero-cake.jpg'][0],[data[0] for name,data in photos.items() if name!='hero-cake.jpg'])

    def test_public_copy_has_no_designer_notes(self):
        html=(ROOT/'index.html').read_text(encoding='utf-8')
        for phrase in ['Web sitesi tasarım konsepti','Kaynaklar ve görsel kredileri','kaynaklar.html','ÖRNEK VİTRİN SEÇKİSİ','hayal ettiğimiz','Özenle tasarlandı. Afiyetle keşfedilsin.','Temsili konum illüstrasyonu']:
            self.assertNotIn(phrase,html)
        self.assertIn('Fotoğraflar sunum amaçlıdır.',html)

if __name__=='__main__': unittest.main()
