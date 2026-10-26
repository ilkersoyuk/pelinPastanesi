"""İlk kurulumda temsili Unsplash görsellerini ve açık lisanslı fontları indirir."""
from pathlib import Path
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor
import re

ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'assets'
ASSETS.mkdir(exist_ok=True)
PHOTOS={
 'hero-cake.jpg':('photo-1565958011703-44f9829ba187',1000,1100),
 'chocolate-cake.jpg':('photo-1578985545062-69928b1d9587',700,820),
 'fruit-dessert.jpg':('photo-1488477181946-6428a0291777',700,820),
 'croissant.jpg':('photo-1555507036-ab1f4038808a',700,820),
 'coffee.jpg':('photo-1495474472287-4d71bcdd2085',800,1000),
 'celebration-cake.jpg':('photo-1464305795204-6f5bbfc7fb81',700,820),
 'cookies.jpg':('photo-1499636136210-6f4ee915583e',700,820),
}
def fetch(url):
    with urlopen(Request(url,headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'}),timeout=45) as r: return r.read()
def photo(item):
    name,(id,w,h)=item
    data=fetch(f'https://images.unsplash.com/{id}?auto=format&fit=crop&w={w}&h={h}&q=85')
    (ASSETS/name).write_bytes(data)
    print(name,len(data))
if __name__=='__main__':
    with ThreadPoolExecutor(max_workers=5) as pool: list(pool.map(photo,PHOTOS.items()))
    fonts=[('editorial.woff2','Cormorant+Garamond:wght@400;500;600'),('editorial-italic.woff2','Cormorant+Garamond:ital,wght@1,400;1,500'),('body.woff2','DM+Sans:wght@400;500;600;700')]
    for filename,family in fonts:
        css=fetch('https://fonts.googleapis.com/css2?family='+family+'&display=swap').decode()
        urls=re.findall(r'url\((https://fonts.gstatic.com/[^)]+)\)',css)
        # Google Fonts latin-ext alt kümesini ayrı dosyada sakla; Türkçe karakterler dahil.
        blocks=re.findall(r'/\* (.*?) \*/\s*(@font-face\s*\{.*?\})',css,re.S)
        selected=next((b for label,b in blocks if label.strip()=='latin'),None)
        ext=next((b for label,b in blocks if label.strip()=='latin-ext'),None)
        u=re.search(r'url\(([^)]+)\)',selected or css).group(1)
        data=fetch(u); (ASSETS/filename).write_bytes(data); print(filename,len(data))
        if ext:
            u=re.search(r'url\(([^)]+)\)',ext).group(1)
            (ASSETS/filename.replace('.woff2','-ext.woff2')).write_bytes(fetch(u))
    print('Assets ready')
