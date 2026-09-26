# Fonts de la web estàtica

Aquesta carpeta no es publica (GitHub Pages ignora les carpetes que comencen per `_`).

La web es va convertir de l'exportació de Claude Design (un únic HTML de 10 MB que es
renderitzava amb React al navegador) a HTML estàtic. Per fer canvis petits (textos, preus),
edita directament `index.html`, `es/index.html` o les pàgines legals.

Per regenerar-ho tot des de la plantilla original:
1. `npm i lucide-static` i `pip install beautifulsoup4 pillow`
2. Copia `plantilles/*` a la carpeta de treball com a `index/`, `avis-legal/`, etc.
3. `node dump.js` → `vals.json`; `python3 build.py`; `python3 legal.py`
