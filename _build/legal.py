#!/usr/bin/env python3
"""Genera les pàgines legals estàtiques (mateix disseny que les originals de Claude Design)."""
import re, os, html, json
from bs4 import BeautifulSoup
import build as B

W = B.W
UPDATED = '26 de setembre de 2026'
EMAIL = 'libertad.cg@hotmail.com'
H2 = 'font-family: var(--font-display); font-size:18px; font-weight:600; margin:0 0 12px;'
P = 'font-size:15px; line-height:1.7; color: var(--color-ink-muted); margin:0 0 12px;'
UL = 'font-size:15px; line-height:1.8; color: var(--color-ink-muted); margin:0 0 12px; padding-left:20px;'
TH = 'text-align:left; padding:8px 10px; border-bottom:1px solid var(--color-border); color: var(--color-ink); font-weight:600;'
TD = 'padding:8px 10px; border-bottom:1px solid var(--color-border); vertical-align:top;'


def sec(title, *blocks):
    body = ''.join(blocks)
    return f'<section style="margin-bottom: 32px;"><h2 style="{H2}">{title}</h2>{body}</section>'


def p(t):
    return f'<p style="{P}">{t}</p>'


def ul(*items):
    return f'<ul style="{UL}">' + ''.join(f'<li>{i}</li>' for i in items) + '</ul>'


def b(label):
    return f'<strong style="color: var(--color-ink);">{label}</strong>'


def table(head, rows):
    h = ''.join(f'<th style="{TH}">{c}</th>' for c in head)
    r = ''.join('<tr>' + ''.join(f'<td style="{TD}">{c}</td>' for c in row) + '</tr>' for row in rows)
    return (f'<div style="overflow-x:auto; margin:0 0 12px;"><table style="width:100%; border-collapse:collapse; '
            f'font-size:14px; line-height:1.5; color: var(--color-ink-muted);"><thead><tr>{h}</tr></thead><tbody>{r}</tbody></table></div>')


mail = f'<a href="mailto:{EMAIL}">{EMAIL}</a>'
titular = [
    f'{b("Titular:")} Libertad Cazorla Guerrero (Espai Llibertat)',
    f'{b("NIF:")} 30976721E',
    f'{b("Domicili:")} Carrer de la Llibertat, 63, planta baixa · 08800 Vilanova i la Geltrú (Barcelona)',
    f'{b("Correu electrònic:")} {mail}',
    f'{b("Telèfon / WhatsApp:")} 660 913 103',
]

PAGES = {
    'avis-legal': {
        'title': 'Avís legal | Espai Llibertat',
        'desc': "Avís legal del lloc web d'Espai Llibertat, coworking de salut a Vilanova i la Geltrú: dades del titular, condicions d'ús i responsabilitat.",
        'h1': 'Avís Legal',
        'body': [
            sec('1. DADES IDENTIFICATIVES',
                p("En compliment de l'article 10 de la Llei 34/2002, d'11 de juliol, de serveis de la societat de la informació i de comerç electrònic (LSSI-CE), s'informen les dades identificatives del titular d'aquest lloc web:"),
                ul(*titular, f'{b("Activitat:")} lloguer per hores de sales equipades per a professionals de la salut i el benestar (coworking de salut).')),
            sec('2. OBJECTE I ACCEPTACIÓ',
                p("Aquest avís legal regula l'accés i l'ús del lloc web espaillibertat.es. Navegar-hi atribueix la condició d'usuari i implica l'acceptació d'aquestes condicions. El titular pot modificar-les en qualsevol moment; la versió vigent és la publicada en aquesta pàgina.")),
            sec("3. CONDICIONS D'ÚS",
                p("L'usuari es compromet a fer un ús del lloc web conforme a la llei, la bona fe i aquest avís legal, i a no fer-ne cap ús que pugui danyar-lo, inutilitzar-lo o perjudicar drets de tercers.")),
            sec('4. INFORMACIÓ SOBRE PREUS I RESERVES',
                p("Els preus i condicions que es mostren al web són informatius i poden variar. La calculadora de tarifes ofereix una estimació orientativa. Les condicions aplicables a cada reserva o contractació són les que es confirmen per escrit (correu electrònic o WhatsApp) abans de formalitzar-la.")),
            sec('5. PROPIETAT INTEL·LECTUAL I INDUSTRIAL',
                p("Els continguts del lloc web (textos, fotografies, disseny gràfic, logotips i codi font) són propietat de la titular o s'utilitzen amb la llicència o autorització corresponent, i estan protegits per la normativa de propietat intel·lectual i industrial. No se'n permet la reproducció, distribució o transformació sense autorització expressa, llevat de l'ús personal i privat.")),
            sec('6. ENLLAÇOS I SERVEIS DE TERCERS',
                p("El web conté enllaços i serveis de tercers (WhatsApp, Google Maps, LinkedIn, correu electrònic). La titular no controla aquests serveis i no es fa responsable del seu contingut, disponibilitat ni de les seves polítiques de privadesa.")),
            sec('7. LIMITACIÓ DE RESPONSABILITAT',
                p("La titular treballa perquè la informació del web sigui correcta i estigui actualitzada, però no garanteix l'absència d'errors ni la disponibilitat ininterrompuda del servei, i no es fa responsable dels danys derivats d'interrupcions, virus informàtics o desconnexions per causes alienes.")),
            sec('8. PROTECCIÓ DE DADES I COOKIES',
                p('El tractament de dades personals es regeix per la <a href="politica-privadesa.html">Política de privadesa</a> i l\'ús de cookies per la <a href="politica-cookies.html">Política de cookies</a>.')),
            sec('9. LEGISLACIÓ APLICABLE I JURISDICCIÓ',
                p("Aquestes condicions es regeixen per la legislació espanyola. Per a qualsevol controvèrsia, les parts se sotmeten als jutjats i tribunals de Vilanova i la Geltrú, llevat que la normativa aplicable estableixi un altre fur (per exemple, el del domicili del consumidor).")),
        ],
    },
    'politica-privadesa': {
        'title': 'Política de privadesa | Espai Llibertat',
        'desc': "Com tracta Espai Llibertat les dades personals de les persones que contacten per correu o WhatsApp i dels visitants del web, i com exercir els teus drets.",
        'h1': 'Política de Privadesa',
        'body': [
            p("D'acord amb el Reglament (UE) 2016/679 (RGPD) i la Llei orgànica 3/2018 (LOPDGDD), t'informem de com tractem les teves dades personals."),
            sec('1. RESPONSABLE DEL TRACTAMENT', ul(*titular)),
            sec('2. QUINES DADES TRACTEM',
                ul(f'{b("Dades que ens envies quan ens contactes")} per correu electrònic o WhatsApp: nom, dades de contacte, professió o especialitat i el contingut del missatge.',
                   f'{b("Dades de clients")}: les necessàries per gestionar la reserva, el lloguer, la facturació i el cobrament (per exemple, NIF i adreça fiscal).',
                   f'{b("Dades de navegació")}: només si acceptes les cookies analítiques, Google Analytics recull informació sobre com utilitzes el web (pàgines visitades, dispositiu, navegador, ubicació aproximada i identificadors en línia). Consulta la <a href="politica-cookies.html">Política de cookies</a>.',
                   f'{b("Registres tècnics")}: el proveïdor d\'allotjament del web (GitHub Pages) pot registrar l\'adreça IP dels visitants per motius de seguretat i funcionament del servei.'),
                p("Aquest web no té formularis: no demanem dades fins que tu decideixes escriure'ns. Espai Llibertat no tracta les dades de salut dels pacients o clients atesos pels professionals que lloguen les sales; cada professional n'és el responsable.")),
            sec('3. FINALITATS I BASE JURÍDICA',
                table(['Finalitat', 'Base jurídica'], [
                    ["Respondre consultes i sol·licituds d'informació o de visita", "Aplicació de mesures precontractuals a petició teva (art. 6.1.b RGPD) i interès legítim a atendre les consultes rebudes (art. 6.1.f)"],
                    ['Gestionar reserves, el lloguer de sales, la facturació i el cobrament', 'Execució del contracte (art. 6.1.b) i compliment d\'obligacions legals, fiscals i comptables (art. 6.1.c)'],
                    ["Analitzar l'ús del web amb Google Analytics", 'El teu consentiment (art. 6.1.a), que pots retirar en qualsevol moment'],
                    ['Garantir la seguretat i el funcionament del web', 'Interès legítim (art. 6.1.f)'],
                ]),
                p("No prenem decisions automatitzades ni elaborem perfils amb efectes jurídics sobre tu.")),
            sec('4. CONSERVACIÓ DE LES DADES',
                ul("Consultes que no acaben en contractació: fins a 12 mesos des de l'últim contacte.",
                   "Clients: mentre duri la relació i, després, durant els terminis legals (fins a 6 anys per a la documentació comptable i 4 anys per a obligacions tributàries).",
                   "Dades analítiques: durant el període de retenció configurat a Google Analytics (màxim 14 mesos). La durada de les cookies s'indica a la Política de cookies.")),
            sec('5. DESTINATARIS I ENCARREGATS DEL TRACTAMENT',
                p("No cedim les teves dades a tercers, llevat d'obligació legal (per exemple, a l'Agència Tributària o a entitats bancàries per gestionar cobraments). Per prestar el servei utilitzem proveïdors que poden accedir a dades en qualitat d'encarregats o de responsables independents:"),
                ul('Microsoft (correu electrònic Outlook/Hotmail).', 'WhatsApp / Meta (missatgeria, si ens escrius per aquest canal).',
                   'Google (Google Analytics, només amb el teu consentiment, i el mapa incrustat de Google Maps).', 'GitHub (allotjament del lloc web).'),
                p("Alguns d'aquests proveïdors poden tractar dades fora de l'Espai Econòmic Europeu, principalment als Estats Units. Aquestes transferències s'emparen en el Marc de Privacitat de Dades UE-EUA (Data Privacy Framework) o, si escau, en clàusules contractuals tipus aprovades per la Comissió Europea.")),
            sec('6. ELS TEUS DRETS',
                p(f"Pots exercir els drets d'accés, rectificació, supressió, oposició, limitació del tractament i portabilitat escrivint a {mail}. Si tenim dubtes raonables sobre la teva identitat, et podrem demanar informació addicional per confirmar-la."),
                p("Quan el tractament es basa en el consentiment, el pots retirar en qualsevol moment sense que això afecti la licitud del tractament anterior. Per a les cookies analítiques, fes servir l'enllaç «Configuració de cookies» al peu de la pàgina."),
                p('Si consideres que no hem tractat correctament les teves dades, pots presentar una reclamació davant l\'Agència Espanyola de Protecció de Dades (<a href="https://www.aepd.es" target="_blank" rel="noopener">www.aepd.es</a>).')),
            sec('7. SEGURETAT I VERACITAT',
                p("Apliquem mesures tècniques i organitzatives adequades per protegir les dades. Et demanem que les dades que ens facilitis siguin certes i que ens comuniquis qualsevol canvi. Els nostres serveis s'adrecen a professionals i persones majors d'edat.")),
            sec('8. CANVIS EN AQUESTA POLÍTICA',
                p(f"Podem actualitzar aquesta política per adaptar-la a canvis legals o del servei. Darrera actualització: {UPDATED}.")),
        ],
    },
    'politica-cookies': {
        'title': 'Política de cookies | Espai Llibertat',
        'desc': "Quines cookies utilitza el web d'Espai Llibertat, per a què serveixen i com acceptar-les, rebutjar-les o canviar la teva elecció.",
        'h1': 'Política de Cookies',
        'body': [
            sec('1. QUÈ SÓN LES COOKIES?',
                p("Les cookies i tecnologies similars (com l'emmagatzematge local del navegador) són petits fitxers o dades que un lloc web desa al teu dispositiu quan el visites. Serveixen, per exemple, per recordar preferències o per obtenir estadístiques d'ús.")),
            sec('2. COOKIES QUE UTILITZA AQUEST WEB',
                p("Aquest web utilitza una dada tècnica pròpia, necessària per recordar la teva elecció sobre les cookies, i cookies analítiques de Google Analytics, que <strong>només s'activen si les acceptes</strong> al bàner de cookies."),
                table(['Nom', 'Titular', 'Finalitat', 'Durada', 'Tipus'], [
                    ['el-cookie-consent', 'Espai Llibertat (pròpia)', 'Recorda si has acceptat o rebutjat les cookies analítiques', "Fins que l'esborris", 'Tècnica (emmagatzematge local), exempta de consentiment'],
                    ['_ga', 'Google Analytics', 'Distingeix usuaris de manera anònima per elaborar estadístiques', '2 anys', 'Analítica, requereix consentiment'],
                    ['_ga_D74F1426F3', 'Google Analytics', "Manté l'estat de la sessió", '2 anys', 'Analítica, requereix consentiment'],
                ]),
                p('El mapa de la secció «Ubicació» és un servei de Google Maps incrustat. En carregar-se, Google pot utilitzar les seves pròpies cookies o tecnologies similars d\'acord amb la seva <a href="https://policies.google.com/technologies/cookies?hl=ca" target="_blank" rel="noopener">política de cookies</a>.'),
                p("Els botons de WhatsApp, correu electrònic i LinkedIn són simples enllaços: no instal·len cap cookie fins que hi fas clic i surts del web.")),
            sec('3. COM ACCEPTAR, REBUTJAR O CANVIAR LA TEVA ELECCIÓ',
                p("La primera vegada que visites el web et mostrem un bàner on pots acceptar o rebutjar les cookies analítiques amb la mateixa facilitat. Si les rebutges, Google Analytics no es carrega."),
                p('Pots canviar d\'opinió en qualsevol moment amb el botó <button type="button" class="link-btn" data-action="cookie-settings" style="color: var(--color-primary); text-decoration: underline;">Configuració de cookies</button>, també disponible al peu de totes les pàgines.'),
                p('També pots bloquejar o eliminar les cookies des de la configuració del navegador: <a href="https://support.google.com/chrome/answer/95647?hl=ca" target="_blank" rel="noopener">Chrome</a>, <a href="https://support.mozilla.org/ca/kb/habilitar-i-deshabilitar-les-galetes" target="_blank" rel="noopener">Firefox</a>, <a href="https://support.apple.com/ca-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Safari</a> i <a href="https://support.microsoft.com/ca-es/microsoft-edge" target="_blank" rel="noopener">Edge</a>.')),
            sec('4. TRANSFERÈNCIES INTERNACIONALS',
                p('Google pot tractar dades als Estats Units. Aquestes transferències s\'emparen en el Marc de Privacitat de Dades UE-EUA. Més informació a la <a href="politica-privadesa.html">Política de privadesa</a> i a la <a href="https://business.safety.google/privacy/" target="_blank" rel="noopener">informació de privadesa de Google</a>.')),
            sec('5. ACTUALITZACIONS',
                p(f"Actualitzarem aquesta política si canviem les cookies que utilitzem. Darrera actualització: {UPDATED}.")),
        ],
    },
}


def build_legal(name):
    tpl = open(f'{W}/{name}/template.html', encoding='utf-8').read()
    i = tpl.index('<div style="font-family: var(--font-body)')
    j = tpl.index('</x-dc>')
    markup = tpl[i:j]
    # disseny responsiu (l'original tenia paddings i graella fixos)
    markup = markup.replace('padding: 12px 40px;', 'padding: 12px clamp(20px, 6vw, 40px);')
    markup = markup.replace('style="height:64px; width:auto;"', 'style="height:clamp(40px, 9vw, 64px); width:auto;"')
    markup = markup.replace('padding: 64px 40px 96px;', 'padding: clamp(40px, 8vw, 64px) clamp(20px, 6vw, 40px) 96px;')
    markup = markup.replace('<footer style="padding: 40px;', '<footer style="padding: clamp(32px, 6vw, 40px) clamp(20px, 6vw, 40px);')
    markup = markup.replace('grid-template-columns: 2fr 1fr 1fr 1fr;', 'grid-template-columns: repeat(auto-fit, minmax(min(100%, 170px), 1fr));')
    markup = markup.replace('libertad.cg@gmail.com', EMAIL)
    markup = markup.replace('flex-direction:column; gap:6px;', 'flex-direction:column; gap:10px;')
    markup = markup.replace('href="index.html', 'href="./')
    soup = BeautifulSoup(markup, 'html.parser')
    main = soup.find('main')
    pg = PAGES[name]
    new_main = (f'<main style="{main["style"]}"><h1 style="font-family: var(--font-display); font-size: clamp(28px, 3.4vw, 38px); '
                f'font-weight:600; letter-spacing:-0.02em; margin:0 0 32px;">{pg["h1"]}</h1>' + ''.join(pg['body']) + '</main>')
    main.replace_with(BeautifulSoup(new_main, 'html.parser'))
    # logo: la plantilla legal fa servir un altre uuid per al mateix logo
    for img in soup.find_all('img'):
        img['src'] = 'assets/img/logo.svg'
        img['width'] = '211'
        img['height'] = '60'
    body = str(soup)
    # enllaç «Configuració de cookies» al bloc Legal del peu
    body = re.sub(r'(<a href="politica-cookies\.html" style="[^"]*">Política de cookies</a>)',
                  r'\1<button type="button" class="link-btn" data-action="cookie-settings" style="text-align:left;">Configuració de cookies</button>', body, count=1)
    consent = open(f'{W}/consent_ca.html').read().replace('{prefix}', '')
    t = B.get_tokens_css() + B.font_css('') + B.SITE_CSS
    doc = f'''<!DOCTYPE html>
<html lang="ca">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(pg['title'])}</title>
<meta name="description" content="{html.escape(pg['desc'])}">
<link rel="canonical" href="{B.SITE}/{name}.html">
<meta name="theme-color" content="#0A9E8F">
<link rel="icon" type="image/svg+xml" href="assets/img/favicon.svg">
<link rel="preload" href="assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>{t}</style>
<script src="assets/site.js" defer></script>
</head>
<body>
{body}
{consent}
</body>
</html>
'''
    doc = re.sub(r'>\s+<', '> <', doc)
    open(f'{W}/site/{name}.html', 'w', encoding='utf-8').write(doc)
    return len(doc)


if __name__ == '__main__':
    for n in PAGES:
        print(n, build_legal(n))
