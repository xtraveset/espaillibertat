#!/usr/bin/env python3
"""Compila la plantilla de Claude Design (x-dc) a HTML estàtic.

Entrada: index/template.html (plantilla original extreta del bundle) + vals.json (dades
avaluades de la lògica del component, per a CA i ES).
Sortida: site/index.html (CA) i site/es/index.html (ES).
"""
import json, re, html, os
from bs4 import BeautifulSoup, NavigableString, Comment, Tag

W = os.path.dirname(os.path.abspath(__file__))
VALS = json.load(open(f'{W}/vals.json'))
TPL = open(f'{W}/index/template.html', encoding='utf-8').read()
LUCIDE = f'{W}/node_modules/lucide-static/icons/'
SITE = 'https://espaillibertat.es'

# ---------------------------------------------------------------- assets
IMG_MAP = {
    'uploads/segment-entrenadors.png': 'segment-entrenadors.webp',
    'uploads/segment-fisio.png': 'segment-fisio.webp',
    'uploads/segment-nutricio.png': 'segment-nutricio.webp',
    'uploads/segment-beauty.png': 'segment-beauty.webp',
    'uploads/service-residus.png': 'service-residus.webp',
    'uploads/service-consumibles.png': 'service-consumibles.webp',
    'uploads/service-sala-grupal.png': 'service-sala-grupal.webp',
    'uploads/service-climatitzacio.png': 'service-climatitzacio.webp',
    'uploads/service-entorn.png': 'service-entorn.webp',
    'uploads/service-wifi.png': 'service-wifi.webp',
    'uploads/slot-hero-photo.webp': 'hero.webp',
    'uploads/slot-avatar-angels.webp': 'avatar-angels.webp',
    'uploads/slot-avatar-marti.webp': 'avatar-marti.webp',
    'uploads/WhatsApp%20Image%202026-07-28%20at%2017.45.24.jpeg': 'avatar-ramon.webp',
    'b125bc1b-655f-496b-9788-f2e6889d580c': 'hero.webp',
    'c75f5070-21a9-44d6-9d6a-aa89a5b67ab2': 'calendar.webp',
    '4381d505-720e-4d25-a4eb-54f004af738d': 'logo.svg',
}
for i in range(1, 13):
    IMG_MAP[f'uploads/slot-gallery-{i}.webp'] = f'gallery-{i}.webp'
IMG_DIMS = {}
try:
    from PIL import Image
    for f in os.listdir(f'{W}/site/assets/img'):
        if f.endswith('.webp'):
            IMG_DIMS[f] = Image.open(f'{W}/site/assets/img/{f}').size
except Exception:
    pass
IMG_DIMS['logo.svg'] = (211, 60)


def asset(src, prefix):
    name = IMG_MAP.get(src)
    if not name:
        raise KeyError(src)
    return f'{prefix}assets/img/{name}', name


# ---------------------------------------------------------------- helpers
def esc(s):
    return html.escape(str(s), quote=False)


def esca(s):
    return html.escape(str(s), quote=True)


def lookup(expr, scope):
    expr = expr.strip()
    if expr == 'true':
        return True
    if expr == 'false':
        return False
    parts = expr.split('.')
    for sc in reversed(scope):
        if parts[0] in sc:
            v = sc[parts[0]]
            for p in parts[1:]:
                v = v.get(p) if isinstance(v, dict) else None
            return v
    return None


def tostr(v):
    if v is True:
        return 'true'
    if v is False:
        return 'false'
    if v is None:
        return ''
    return str(v)


EXPR = re.compile(r'\{\{\s*(.*?)\s*\}\}')

CALC_TEXT = {'calcHours': 'hours', 'calc.planName': 'plan', 'calc.monthly': 'monthly',
             'calc.perHour': 'perhour', 'calc.savingText': 'savingtext', 'calcMaxLabel': 'maxlabel'}


def interp_text(s, scope):
    def rep(m):
        e = m.group(1)
        v = esc(tostr(lookup(e, scope)))
        if e == 'roomSummary':
            return f'<span data-room-summary>{v}</span>'
        if e.startswith('activeTestimonial.'):
            return f'<span data-modal>{v}</span>'
        if e in CALC_TEXT:
            return f'<span data-calc="{CALC_TEXT[e]}">{v}</span>'
        return v
    return EXPR.sub(rep, s)


def interp_attr(s, scope):
    return EXPR.sub(lambda m: tostr(lookup(m.group(1), scope)), s)


def parse_style(s):
    d = []
    for decl in s.split(';'):
        if ':' in decl:
            k, v = decl.split(':', 1)
            d.append((k.strip(), v.strip()))
    return d


def style_str(d):
    return ' '.join(f'{k}:{v};' for k, v in d if v != '')


# ---------------------------------------------------------------- icons (SVG sprite)
USED_ICONS = []


def icon_symbol(name):
    svg = open(f'{LUCIDE}{name}.svg').read()
    inner = svg[svg.index('>', svg.index('<svg')) + 1: svg.rindex('</svg>')]
    inner = re.sub(r'<!--.*?-->', '', inner, flags=re.S)
    inner = re.sub(r'\s+', ' ', inner).strip()
    return f'<symbol id="i-{name}" viewBox="0 0 24 24">{inner}</symbol>'


def Icon(props, extra_cls=''):
    name = props.get('name')
    size = props.get('size', '18')
    if name not in USED_ICONS:
        USED_ICONS.append(name)
    cls = f' class="i {extra_cls}"' if extra_cls else ' class="i"'
    # Nota: l'original carregava <img> de Lucide sense aplicar color → traç negre.
    return (f'<svg{cls} width="{size}" height="{size}" aria-hidden="true" focusable="false" '
            f'style="display:inline-block; vertical-align:middle; flex-shrink:0;">'
            f'<use href="#i-{name}"/></svg>')


# ---------------------------------------------------------------- DS components
BTN_SIZE = {
    'sm': [('padding', '6px 12px'), ('font-size', '13px'), ('border-radius', 'var(--radius-md)'), ('min-height', '36px')],
    'md': [('padding', '10px 18px'), ('font-size', '14px'), ('border-radius', 'var(--radius-md)'), ('min-height', '44px')],
    'lg': [('padding', '13px 22px'), ('font-size', '15px'), ('border-radius', 'var(--radius-lg)'), ('min-height', '48px')],
}
BTN_VAR = {
    'primary': [('background', 'var(--color-primary)'), ('color', 'var(--color-on-primary)'), ('border', '1px solid transparent')],
    'secondary': [('background', 'var(--color-canvas)'), ('color', 'var(--color-ink)'), ('border', '1px solid var(--color-border-strong)')],
    'ghost': [('background', 'transparent'), ('color', 'var(--color-primary)'), ('border', '1px solid transparent')],
}


def button_style(variant, size, full=False):
    v = variant if variant in BTN_VAR else 'primary'
    d = BTN_VAR[v] + BTN_SIZE.get(size, BTN_SIZE['md']) + [
        ('font-family', 'var(--font-body)'), ('font-weight', '500'),
        ('display', 'flex' if full else 'inline-flex'), ('align-items', 'center'),
        ('justify-content', 'center'), ('gap', '8px'), ('box-sizing', 'border-box'),
        ('text-decoration', 'none'), ('line-height', 'normal'), ('text-align', 'center')]
    if full:
        d.append(('width', '100%'))
    return style_str(d), v


def Card(props, children, extra_style=None, hoverable=False):
    pad = {'compact': 'var(--layout-card-padding-compact)', 'content': 'var(--layout-card-padding-content)',
           'primary': 'var(--layout-card-padding-primary)'}.get(props.get('padding', 'content'))
    d = [('background', 'var(--color-canvas)'), ('border', '1px solid var(--color-border)'),
         ('border-radius', 'var(--radius-lg)'), ('padding', pad), ('box-shadow', 'var(--shadow-card)'),
         ('transition', 'box-shadow var(--duration-base) var(--ease)')]
    for k, v in (extra_style or []):
        d = [(a, b) for a, b in d if a != k] + [(k, v)]
    cls = ' class="card-hover"' if hoverable else ''
    return f'<div{cls} style="{style_str(d)}">{children}</div>'


def Tag_(children):
    return ('<span style="display:inline-flex; align-items:center; background:var(--color-primary-light); '
            'color:var(--color-primary); border-radius:var(--radius-pill); padding:6px 14px; font-size:13px; '
            f'font-family:var(--font-body); font-weight:500; line-height:normal;">{children}</span>')


def Tabs(tabs, active):
    out = ['<div role="group" data-room-tabs style="display:flex; border-bottom:1px solid var(--color-border); gap:4px;">']
    for t in tabs:
        on = t['value'] == active
        out.append(
            f'<button type="button" data-action="room" data-room="{t["value"]}" aria-pressed="{tostr(on)}" '
            f'style="background:none; border:none; cursor:pointer; padding:10px 16px; font-family:var(--font-body); '
            f'font-size:14px; font-weight:500; color:{"var(--color-primary)" if on else "var(--color-ink-muted)"}; '
            f'border-bottom:2px solid {"var(--color-primary)" if on else "transparent"}; margin-bottom:-1px; '
            f'transition:color var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease);">'
            f'{esc(t["label"])}</button>')
    out.append('</div>')
    return ''.join(out)


# ---------------------------------------------------------------- renderer
VOID = {'img', 'input', 'br', 'meta', 'link', 'hr', 'source'}
ACTIONS = {
    'toggleMobileMenu': 'menu', 'closeMobileMenu': 'close-menu',
    'closeTestimonialModal': 'close-modal', 'closeLightbox': 'close-lightbox',
    'scrollGalleryLeft': 'gallery-prev', 'scrollGalleryRight': 'gallery-next',
}


class Ctx:
    def __init__(self, lang, vals, prefix):
        self.lang, self.vals, self.prefix = lang, vals, prefix
        self.room_mode = None  # per renderitzar pricing de les dues sales


def component_name(node):
    return node.get('component-from-global-scope', '').split('.')[-1]


def render_children(node, scope, ctx):
    return ''.join(render(c, scope, ctx) for c in node.children)


def render(node, scope, ctx, extra=None):
    if isinstance(node, Comment):
        return ''
    if isinstance(node, NavigableString):
        return interp_text(esc(str(node)).replace('&#x27;', "'"), scope) if '{{' in node else esc(str(node))
    if not isinstance(node, Tag):
        return ''
    name = node.name

    # ---- control flow
    if name == 'sc-for':
        expr = EXPR.search(node['list']).group(1)
        as_ = node['as']
        if expr == 'pricing':
            out = []
            for room in ('individual', 'grupal'):
                items = ctx.vals['ind' if room == 'individual' else 'grp']['pricing']
                hidden = '' if room == 'individual' else ' hidden'
                out.append(f'<div class="room-panel" data-room-panel="{room}"{hidden}>')
                for i, it in enumerate(items):
                    out.append(render_children(node, scope + [{as_: it, '_i': i}], ctx))
                out.append('</div>')
            return ''.join(out)
        items = lookup(expr, scope) or []
        out = []
        n = len(items)
        for i, it in enumerate(items):
            sc = {as_: it, '_i': i}
            if expr == 'testimonialsDisplay':
                sc['_dup'] = i >= n // 2
                sc['_ti'] = i % (n // 2)
            out.append(render_children(node, scope + [sc], ctx))
        return ''.join(out)

    if name == 'sc-if':
        expr = EXPR.search(node['value']).group(1)
        special = {
            'showDesktopNav': {'class': 'nav-desktop'},
            'isMobile': {'class': 'nav-mobile-btn'},
            'mobileMenuOpen': {'id': 'mobile-menu', 'class': 'mobile-menu', 'hidden': True},
            'testimonialModalOpen': {'id': 'testi-modal', 'hidden': True, 'class': 'overlay'},
            'lightboxOpen': {'id': 'lightbox', 'hidden': True, 'class': 'overlay'},
        }
        if expr in special:
            return render_first(node, scope, ctx, special[expr])
        if expr == 'st.expanded':
            i = lookup('_i', scope)
            return render_first(node, scope, ctx, {'id': f'step-{i}', 'hidden': not lookup(expr, scope)})
        if expr == 'f.open':
            i = lookup('_i', scope)
            return render_first(node, scope, ctx, {'id': f'faq-a-{i}', 'hidden': not lookup(expr, scope)})
        if expr in ('calc.hasSaving', 'calc.custom'):
            key = 'saving' if expr == 'calc.hasSaving' else 'custom'
            return render_first(node, scope, ctx, {'data-calc': key, 'hidden': not lookup(expr, scope)})
        if lookup(expr, scope):
            return render_children(node, scope, ctx)
        return ''

    if name == 'x-import':
        return render_component(node, scope, ctx, extra)

    if name == 'helmet':
        return ''

    return render_element(node, scope, ctx, extra)


def first_el(node):
    for c in node.children:
        if isinstance(c, Tag):
            return c
    return None


def render_first(node, scope, ctx, extra):
    out = []
    done = False
    for c in node.children:
        if isinstance(c, Tag) and not done:
            out.append(render(c, scope, ctx, extra))
            done = True
        else:
            out.append(render(c, scope, ctx))
    return ''.join(out)


def props_of(node, scope):
    p = {}
    for k, v in node.attrs.items():
        if isinstance(v, list):
            v = ' '.join(v)
        m = EXPR.fullmatch(v.strip()) if isinstance(v, str) else None
        p[k] = lookup(m.group(1), scope) if m else interp_attr(v, scope)
    return p


def extra_attrs(extra):
    if not extra:
        return ''
    s = ''
    for k, v in extra.items():
        if k == 'class':
            continue
        if v is True:
            s += f' {k}'
        elif v is False or v is None:
            continue
        else:
            s += f' {k}="{esca(v)}"'
    if extra.get('class'):
        s += f' class="{extra["class"]}"'
    return s


def render_component(node, scope, ctx, extra=None):
    comp = component_name(node)
    p = props_of(node, scope)
    raw_style = node.get('style', '')
    children = render_children(node, scope, ctx)
    if comp == 'Icon':
        if 'st.chevronIcon' in node.get('name', ''):
            inner = Icon({**p, 'name': 'chevron-down'}, 'chev')
        else:
            inner = Icon(p)
    elif comp == 'Button':
        st, v = button_style(p.get('variant') or 'primary', p.get('size') or 'md')
        inner = f'<button type="button" class="btn btn-{v}" style="{st}">{children}</button>'
    elif comp == 'Tag':
        inner = Tag_(children)
    elif comp == 'Card':
        es = []
        cp = p.get('dc-props')
        if isinstance(cp, dict) and cp.get('style'):
            s = cp['style']
            es = [('height', s.get('height')), ('box-sizing', s.get('boxSizing'))]
            # React: border:undefined elimina la vora (targetes no destacades)
            es.append(('border', s.get('border') or ''))
            es = [(k, v) for k, v in es if v or k == 'border']
        inner = Card(p, children, es, hoverable=p.get('hoverable') is True)
    elif comp == 'Tabs':
        inner = Tabs(p['tabs'], p['active'])
    else:
        raise ValueError(comp)
    # x-import amb style estàtic → embolcall amb aquest style (com fa el runtime)
    # (el runtime només conserva les propietats de mida a l'embolcall; la resta → display:contents)
    wrap = [(k, v) for k, v in parse_style(raw_style) if k in ('width', 'height', 'min-width', 'max-width', 'min-height', 'max-height')] \
        if raw_style and '{{' not in raw_style else []
    dup = lookup('_dup', scope)
    aria = ' aria-hidden="true" inert' if dup and comp == 'Card' else ''
    if wrap:
        return f'<div{extra_attrs(extra)}{aria} style="{esca(style_str(wrap))}">{inner}</div>'
    if aria:
        inner = re.sub(r'^<(\w+)', lambda m: f'<{m.group(1)}{aria}', inner, count=1)
    if extra:
        # aplica attrs extra a l'arrel
        inner = re.sub(r'^<(\w+)', lambda m: f'<{m.group(1)}{extra_attrs(extra)}', inner, count=1)
    return inner


def bg_to_img(attrs, style, ctx):
    """<div role=img style=background-image:url(...)> → <img loading=lazy>"""
    d = parse_style(style)
    dd = dict(d)
    m = re.search(r'url\(([^)]+)\)', dd.get('background-image', ''))
    if not m:
        return None
    src, fname = asset(m.group(1), ctx.prefix)
    fit = 'contain' if dd.get('background-size') == 'contain' else 'cover'
    keep = [(k, v) for k, v in d if k in ('width', 'height', 'aspect-ratio', 'border-radius', 'flex-shrink')]
    if 'height' not in dict(keep):
        keep.append(('height', 'auto'))
    keep += [('object-fit', fit), ('object-position', 'center'), ('display', 'block')]
    w, h = IMG_DIMS.get(fname, (None, None))
    if dd.get('width', '').endswith('px') and dd.get('height', '').endswith('px'):
        w, h = dd['width'][:-2], dd['height'][:-2]
    wh = f' width="{w}" height="{h}"' if w else ''
    alt = attrs.get('aria-label', '')
    return f'<img src="{src}" alt="{esca(alt)}"{wh} loading="lazy" decoding="async" style="{style_str(keep)}">'


def render_element(node, scope, ctx, extra=None):
    name = node.name
    attrs = {}
    classes = []
    for k, v in node.attrs.items():
        if isinstance(v, list):
            v = ' '.join(v)
        attrs[k] = v
    # drop editor-only attrs
    for k in list(attrs):
        if k.startswith('hint-') or k in ('data-comment-anchor',):
            del attrs[k]

    action = None
    for ev in ('sc-camel-on-click', 'sc-camel-on-change'):
        if ev in attrs:
            e = EXPR.search(attrs.pop(ev)).group(1)
            action = e

    # language switch buttons → enllaços reals
    if action in ('setLangCa', 'setLangEs'):
        target = 'ca' if action == 'setLangCa' else 'es'
        href = ('../' if ctx.prefix else './') if target == 'ca' else ('./' if ctx.prefix else 'es/')
        st = interp_attr(attrs.get('style', ''), scope)
        cur = ' aria-current="true"' if target == ctx.lang else ''
        return (f'<a href="{href}" hreflang="{target}" lang="{target}"{cur} class="lang-link" '
                f'style="{esca(st)} text-decoration:none; display:inline-block;">{target.upper()}</a>')

    style = attrs.get('style', '')
    if '{{ mobileLinkStyle }}' in style or '{{ mobileBtnStyle }}' in style:
        classes.append('cta-link')
        style = style.replace('{{ mobileLinkStyle }}', '').replace('{{ mobileBtnStyle }}', '')
    if '{{ servicesCols }}' in style:
        style = style.replace('grid-template-columns: {{ servicesCols }};', '')
        classes.append('services-grid')
    if '{{ testimonialsTrackStyle }}' in style:
        style = interp_attr(style, scope)
        classes.append('testi-track')
    if '{{ galleryArrowOffset }}' in style:
        side = 'left' if 'left:' in style else 'right'
        style = style.replace(f'{side}:{{{{ galleryArrowOffset }}}};', '')
        classes.append(f'gallery-arrow gallery-arrow-{side}')

    # role=img amb background → <img>
    if name == 'div' and attrs.get('role') == 'img':
        st = interp_attr(style, scope)
        if 'background-image' in st:
            img = bg_to_img({k: interp_attr(v, scope) for k, v in attrs.items()}, st, ctx)
            if img:
                return img
        elif not st.strip():
            # placeholders del modal/lightbox (sense imatge fins que JS l'ompli)
            pass

    # <a> que només conté un Button → un únic <a class="btn">
    if name == 'a':
        kids = [c for c in node.children if isinstance(c, Tag)]
        texts = ''.join(str(c) for c in node.children if isinstance(c, NavigableString)).strip()
        if len(kids) == 1 and kids[0].name == 'x-import' and component_name(kids[0]) == 'Button' and not texts:
            b = kids[0]
            bp = props_of(b, scope)
            full = 'display:grid' in style.replace(' ', '')
            st, v = button_style(bp.get('variant') or 'primary', bp.get('size') or 'md', full=full)
            inner = render_children(b, scope, ctx)
            a_attrs = ''
            for k in ('href', 'target', 'rel', 'aria-label'):
                if k in attrs:
                    a_attrs += f' {k}="{esca(interp_attr(attrs[k], scope))}"'
            if 'cta-link' in classes:
                # fidelitat mòbil: <a> ocupa tota la fila i el botó manté l'amplada natural
                cta = ' data-calc-cta' if 'calc.mailHref' in attrs.get('href', '') else ''
                return (f'<a{a_attrs}{cta} class="cta-link" style="text-decoration:none;">'
                        f'<span class="btn btn-{v}" style="{st}">{inner}</span></a>')
            cls = ' '.join(['btn', f'btn-{v}'] + classes)
            act = ''
            if 'calc.mailHref' in attrs.get('href', ''):
                act = ' data-calc-cta'
            if action == 'closeMobileMenu':
                act = ' data-action="close-menu"'
            return f'<a{a_attrs}{act} class="{cls}" style="{st}">{inner}</a>'

    # accions
    data = {}
    if action:
        if action in ACTIONS:
            data['data-action'] = ACTIONS[action]
            if action == 'toggleMobileMenu':
                data.update({'aria-expanded': 'false', 'aria-controls': 'mobile-menu'})
        elif action == 'stopPropagation':
            data['data-stop'] = True
        elif action == 'st.toggle':
            i = lookup('_i', scope)
            data.update({'data-action': 'step', 'data-index': i, 'role': 'button', 'tabindex': '0',
                         'aria-expanded': tostr(lookup('st.expanded', scope)), 'aria-controls': f'step-{i}'})
        elif action == 'f.toggle':
            i = lookup('_i', scope)
            data.update({'data-action': 'faq', 'data-index': i, 'aria-controls': f'faq-a-{i}', 'type': 'button'})
        elif action == 'r.seeRates':
            data.update({'data-action': 'room', 'data-room': lookup('r.key', scope)})
        elif action == 'tItem.openModal':
            data.update({'data-action': 'testi', 'data-index': lookup('_ti', scope), 'type': 'button'})
        elif action == 'g.open':
            i = lookup('_i', scope)
            data.update({'data-action': 'lightbox', 'data-index': i, 'role': 'button', 'tabindex': '0',
                         'aria-label': lookup('g.placeholder', scope)})
        elif action == 'setCalcHours':
            pass
        else:
            raise ValueError(action)
    if 'ref' in attrs:
        attrs.pop('ref')
        data['id'] = 'gallery-track'

    out_attrs = []
    for k, v in attrs.items():
        if k == 'style':
            v = style
        if k == 'sc-camel-view-box':
            k = 'viewBox'
        if name == 'button' and k == 'aria-expanded':
            continue
        val = interp_attr(v, scope)
        if k == 'href' and ctx.prefix and re.match(r'^[a-z-]+\.html', val):
            val = ctx.prefix + val
        if k == 'src' and name == 'img':
            val, fname = asset(v, ctx.prefix)
        if k == 'lang' and name == 'div':
            continue  # l'idioma va a <html lang>
        if k == 'style':
            val = val.strip()
            if not val:
                continue
        out_attrs.append(f' {k}="{esca(val)}"')
    if name == 'button' and data.get('data-action') == 'faq':
        out_attrs.append(f' aria-expanded="{tostr(lookup("f.open", scope))}"')
    if name == 'button' and 'type' not in attrs and 'type' not in data:
        out_attrs.append(' type="button"')
    for k, v in data.items():
        out_attrs.append(f' {k}' if v is True else f' {k}="{esca(v)}"')
    # img extres
    if name == 'img':
        fname = IMG_MAP.get(node.get('src', ''), '')
        w, h = IMG_DIMS.get(fname, (None, None))
        if w:
            out_attrs.append(f' width="{w}" height="{h}"')
        if fname == 'hero.webp':
            out_attrs.append(' fetchpriority="high" decoding="async" '
                             f'srcset="{ctx.prefix}assets/img/hero-480.webp 480w, {ctx.prefix}assets/img/hero.webp 756w" '
                             'sizes="(max-width: 700px) calc(100vw - 40px), 590px"')
        elif fname != 'logo.svg':
            out_attrs.append(' loading="lazy" decoding="async"')
    if extra:
        if extra.get('class'):
            classes.append(extra['class'])
        out_attrs.append(extra_attrs({k: v for k, v in extra.items() if k != 'class'}))
    if classes:
        out_attrs.append(f' class="{" ".join(classes)}"')
    a = ''.join(out_attrs)
    # height:auto per a imatges amb aspect-ratio (evita que l'atribut height mani)
    if name == 'img' and 'aspect-ratio' in style:
        a = a.replace('display:block;"', 'display:block; height:auto;"').replace('display: block;"', 'display:block; height:auto;"')
    if name in VOID:
        return f'<{name}{a}>'
    inner = render_children(node, scope, ctx)
    return f'<{name}{a}>{inner}</{name}>'


# ---------------------------------------------------------------- page assembly
def get_body_markup():
    i = TPL.index('<div lang="{{ lang }}"')
    j = TPL.index('</x-dc>')
    return TPL[i:j]


def get_tokens_css():
    blocks = re.findall(r'<style>(:root \{.*?)</style>', TPL, flags=re.S)
    # l'últim bloc agrupa tots els tokens
    css = max(blocks, key=len)
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    css = re.sub(r'@font-face\s*\{[^}]*\}', '', css)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{};:,])\s*', r'\1', css)
    return css


def font_css(prefix):
    lat = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
    ext = 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'
    f = f'{prefix}assets/fonts/'
    return (
        f"@font-face{{font-family:'Inter';font-style:normal;font-weight:400 700;font-display:swap;src:url({f}inter-latin.woff2) format('woff2');unicode-range:{lat}}}"
        f"@font-face{{font-family:'Inter';font-style:normal;font-weight:400 700;font-display:swap;src:url({f}inter-latin-ext.woff2) format('woff2');unicode-range:{ext}}}"
        f"@font-face{{font-family:'JetBrains Mono';font-style:normal;font-weight:400 500;font-display:swap;src:url({f}jetbrains-mono-latin.woff2) format('woff2');unicode-range:{lat}}}"
        f"@font-face{{font-family:'JetBrains Mono';font-style:normal;font-weight:400 500;font-display:swap;src:url({f}jetbrains-mono-latin-ext.woff2) format('woff2');unicode-range:{ext}}}"
    )


SITE_CSS = open(f'{W}/site.css').read()


def schema(lang, v):
    t = v['T']
    return [
        {'@context': 'https://schema.org', '@type': 'LocalBusiness', 'name': 'Espai Llibertat',
         'description': t['metaDesc'], 'url': f'{SITE}/', 'telephone': '+34660913103',
         'email': 'libertad.cg@hotmail.com', 'priceRange': '10€ - 280€',
         'image': f'{SITE}/assets/img/hero.webp', 'logo': f'{SITE}/assets/img/logo.svg',
         'address': {'@type': 'PostalAddress', 'streetAddress': 'Carrer de la Llibertat 63, planta baixa',
                     'addressLocality': 'Vilanova i la Geltrú', 'postalCode': '08800',
                     'addressRegion': 'Barcelona', 'addressCountry': 'ES'},
         'areaServed': ['Vilanova i la Geltrú', 'Sitges', 'Cubelles', 'Sant Pere de Ribes', 'Garraf']},
        {'@context': 'https://schema.org', '@type': 'FAQPage',
         'mainEntity': [{'@type': 'Question', 'name': f['q'], 'acceptedAnswer': {'@type': 'Answer', 'text': f['a']}}
                        for f in v['faqs']]},
    ]


def head(lang, v, prefix):
    t = v['T']
    url = f'{SITE}/' if lang == 'ca' else f'{SITE}/es/'
    kw = {
        'ca': "lloguer sala per hores Vilanova i la Geltrú, coworking de salut, coworking sanitari Garraf, llogar consulta fisioteràpia, sala per a terapeutes, sala de ioga per hores, alquiler sala por horas Vilanova, alquiler consulta fisioterapia, coworking sanitario Sitges",
        'es': "alquiler sala por horas Vilanova i la Geltrú, coworking de salud, coworking sanitario Garraf, alquilar consulta fisioterapia, sala para terapeutas, sala de yoga por horas, coworking sanitario Sitges, lloguer sala per hores Vilanova",
    }[lang]
    og_desc = {
        'ca': 'Sales equipades per a professionals de la salut. Des de 15€/h, sense permanència. Primera hora de visita gratuïta.',
        'es': 'Salas equipadas para profesionales de la salud. Desde 15€/h, sin permanencia. Primera hora de visita gratuita.',
    }[lang]
    return f'''<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(t['metaTitle'])}</title>
<meta name="description" content="{esca(t['metaDesc'])}">
<meta name="keywords" content="{esca(kw)}">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="ca" href="{SITE}/">
<link rel="alternate" hreflang="es" href="{SITE}/es/">
<link rel="alternate" hreflang="x-default" href="{SITE}/">
<meta property="og:type" content="website">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="Espai Llibertat">
<meta property="og:title" content="{esca(t['metaTitle'])}">
<meta property="og:description" content="{esca(og_desc)}">
<meta property="og:image" content="{SITE}/assets/social-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="{'ca_ES' if lang == 'ca' else 'es_ES'}">
<meta property="og:locale:alternate" content="{'es_ES' if lang == 'ca' else 'ca_ES'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0A9E8F">
<link rel="icon" type="image/svg+xml" href="{prefix}assets/img/favicon.svg">
<link rel="preload" href="{prefix}assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>{get_tokens_css()}{font_css(prefix)}{SITE_CSS}</style>
<script type="application/ld+json">{json.dumps(schema(lang, v), ensure_ascii=False)}</script>
<script src="{prefix}assets/site.js" defer></script>'''


def page_data(lang, v):
    t = v['T']
    return {'lang': lang, 'plan': v['planNames'], 'consult': t['calcConsult'],
            'savePre': t['calcSavingPre'], 'savePost': t['calcSavingPost'],
            'summary': {'individual': VALS[lang]['ind']['roomSummary'], 'grupal': VALS[lang]['grp']['roomSummary']},
            'testimonials': [{'name': x['name'], 'role': x['role'], 'quote': x['quote'],
                              'avatar': re.search(r'url\(([^)]+)\)', x['avatarStyle']).group(1)}
                             for x in v['ind']['testimonialsDisplay'][:3]],
            'gallery': [g['placeholder'] for g in v['ind']['galleryPhotos']]}


def build(lang):
    USED_ICONS.clear()
    v = VALS[lang]
    prefix = '' if lang == 'ca' else '../'
    ctx = Ctx(lang, v, prefix)
    ctx.vals = {'ind': v['ind'], 'grp': v['grp']}
    soup = BeautifulSoup(get_body_markup(), 'html.parser')
    scope = [v['ind']]
    body = ''.join(render(c, scope, ctx) for c in soup.children)
    # dades per al JS (asset paths de testimonis/galeria)
    pdata = page_data(lang, v)
    for tm in pdata['testimonials']:
        tm['avatar'] = asset(tm['avatar'], prefix)[0]
    pdata['gallerySrc'] = [f'{prefix}assets/img/gallery-{i}.webp' for i in range(1, 13)]
    pdata['legal'] = prefix
    sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + \
        ''.join(icon_symbol(n) for n in USED_ICONS) + '</svg>'
    consent = open(f'{W}/consent_{lang}.html').read().replace('{prefix}', prefix)
    doc = f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
{head(lang, v, prefix)}
</head>
<body>
{sprite}
{body}
{consent}
<script id="page-data" type="application/json">{json.dumps(pdata, ensure_ascii=False)}</script>
</body>
</html>
'''
    # compacta espais en blanc entre etiquetes
    cookie_lbl = 'Configuració de cookies' if lang == 'ca' else 'Configuración de cookies'
    doc = doc.replace('data-comment-anchor', 'data-x')
    doc = re.sub(r'(<a href="(?:\.\./)?politica-cookies\.html"[^>]*>[^<]*</a>)',
                 r'\1<button type="button" class="link-btn" data-action="cookie-settings">' + cookie_lbl + '</button>', doc, count=1)
    doc = re.sub(r'>\s+<', '> <', doc)
    return doc


if __name__ == '__main__':
    os.makedirs(f'{W}/site/es', exist_ok=True)
    open(f'{W}/site/index.html', 'w', encoding='utf-8').write(build('ca'))
    open(f'{W}/site/es/index.html', 'w', encoding='utf-8').write(build('es'))
    print('ok', os.path.getsize(f'{W}/site/index.html'), os.path.getsize(f'{W}/site/es/index.html'))
