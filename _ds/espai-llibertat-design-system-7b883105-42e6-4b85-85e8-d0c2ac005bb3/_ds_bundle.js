/* @ds-bundle: {"format":4,"namespace":"EspaiLlibertatDesignSystem_7b8831","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Tag","sourcePath":"components/feedback/Tag.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Dialog","sourcePath":"components/overlay/Dialog.jsx"}],"sourceHashes":{"components/core/Button.jsx":"dc7db5703430","components/core/Card.jsx":"3fd4570304d3","components/core/Icon.jsx":"b0b81832803a","components/core/IconButton.jsx":"0c183b80c63a","components/feedback/Badge.jsx":"1c466ed796a8","components/feedback/Tag.jsx":"4bd5d1f3b78e","components/feedback/Toast.jsx":"380345f260ab","components/feedback/Tooltip.jsx":"0beebe3cc086","components/forms/Checkbox.jsx":"c64d864112c5","components/forms/Input.jsx":"c9ab4566ae9f","components/forms/Radio.jsx":"16ccc685c0ef","components/forms/Select.jsx":"57525515811d","components/forms/Switch.jsx":"cc18cb809bbd","components/navigation/Tabs.jsx":"f12c6fc87f3f","components/overlay/Dialog.jsx":"d5afbad8f1cf","ui_kits/marketing-site/Booking.jsx":"f05cba146772","ui_kits/marketing-site/Contact.jsx":"a98d2d03e38a","ui_kits/marketing-site/Footer.jsx":"b70dcf932a87","ui_kits/marketing-site/Header.jsx":"450c31effc30","ui_kits/marketing-site/Home.jsx":"fe0400ab2013","ui_kits/marketing-site/Spaces.jsx":"fbbc638435a5"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.EspaiLlibertatDesignSystem_7b8831 = window.EspaiLlibertatDesignSystem_7b8831 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
const sizeStyles = {
  sm: {
    padding: '6px 12px',
    fontSize: 13,
    borderRadius: 'var(--radius-md)',
    minHeight: 36
  },
  md: {
    padding: '10px 18px',
    fontSize: 14,
    borderRadius: 'var(--radius-md)',
    minHeight: 44
  },
  lg: {
    padding: '13px 22px',
    fontSize: 15,
    borderRadius: 'var(--radius-lg)',
    minHeight: 48
  }
};
const variantStyles = {
  primary: {
    background: 'var(--color-primary)',
    color: 'var(--color-on-primary)',
    border: '1px solid transparent'
  },
  secondary: {
    background: 'var(--color-canvas)',
    color: 'var(--color-ink)',
    border: '1px solid var(--color-border-strong)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-primary)',
    border: '1px solid transparent'
  }
};
const hoverBg = {
  primary: 'var(--color-primary-hover)',
  secondary: 'var(--color-surface-1)',
  ghost: 'var(--color-primary-light)'
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon = null,
  onClick,
  type = 'button'
}) {
  const [hover, setHover] = React.useState(false);
  const v = variantStyles[variant] || variantStyles.primary;
  const s = sizeStyles[size] || sizeStyles.md;
  const style = {
    ...v,
    ...s,
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: `background var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease)`,
    background: !disabled && hover ? hoverBg[variant] : v.background,
    outline: 'none'
  };
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: style,
    onFocus: e => {
      e.target.style.boxShadow = '0 0 0 2px var(--color-canvas), 0 0 0 4px var(--color-focus-ring)';
    },
    onBlur: e => {
      e.target.style.boxShadow = 'none';
    }
  }, icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  children,
  padding = 'content',
  hoverable = false,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  const paddingMap = {
    compact: 'var(--layout-card-padding-compact)',
    content: 'var(--layout-card-padding-content)',
    primary: 'var(--layout-card-padding-primary)'
  };
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => hoverable && setHover(true),
    onMouseLeave: () => hoverable && setHover(false),
    style: {
      background: 'var(--color-canvas)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: paddingMap[padding] || paddingMap.content,
      boxShadow: hover ? 'var(--shadow-elevated)' : 'var(--shadow-card)',
      transition: 'box-shadow var(--duration-base) var(--ease)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
/**
 * Thin wrapper around Lucide's static SVG icon set, loaded from CDN.
 * Intentional addition — the design context specifies icon *usage*
 * (status glyphs, chevrons) but names no icon system, so Lucide was
 * chosen for its neutral stroke weight that matches the clinical-calm tone.
 */
function Icon({
  name,
  size = 18,
  color = 'currentColor',
  strokeWidth = 2
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: `https://unpkg.com/lucide-static@latest/icons/${name}.svg`,
    width: size,
    height: size,
    alt: "",
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      verticalAlign: 'middle',
      filter: color === 'currentColor' ? 'none' : undefined
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
const sizeMap = {
  sm: 32,
  md: 40,
  lg: 44
};
function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  disabled = false,
  onClick,
  label
}) {
  const [hover, setHover] = React.useState(false);
  const dim = sizeMap[size] || 40;
  const bg = variant === 'filled' ? hover ? 'var(--color-primary-hover)' : 'var(--color-primary)' : hover ? 'var(--color-surface-2)' : 'transparent';
  const color = variant === 'filled' ? 'var(--color-on-primary)' : 'var(--color-ink-muted)';
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: dim,
      height: dim,
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: bg,
      color,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--duration-base) var(--ease)'
    }
  }, icon);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
const statusMap = {
  urgent: {
    fg: 'var(--color-urgent)',
    bg: 'var(--color-urgent-bg)',
    glyph: '⚠'
  },
  warning: {
    fg: 'var(--color-warning)',
    bg: 'var(--color-warning-bg)',
    glyph: '⚠'
  },
  normal: {
    fg: 'var(--color-normal)',
    bg: 'var(--color-normal-bg)',
    glyph: '✓'
  },
  'follow-up': {
    fg: 'var(--color-follow-up)',
    bg: 'var(--color-follow-up-bg)',
    glyph: '↩'
  },
  info: {
    fg: 'var(--color-info)',
    bg: 'var(--color-info-bg)',
    glyph: 'ℹ'
  }
};
function Badge({
  status = 'info',
  children
}) {
  const s = statusMap[status] || statusMap.info;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      background: s.bg,
      color: s.fg,
      fontFamily: 'var(--font-label, var(--font-body))',
      fontSize: 'var(--text-label-size)',
      fontWeight: 'var(--text-label-weight)',
      letterSpacing: 'var(--text-label-tracking)',
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, s.glyph), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tag.jsx
try { (() => {
function Tag({
  children,
  selected = false,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      background: selected ? 'var(--color-primary)' : 'var(--color-primary-light)',
      color: selected ? 'var(--color-on-primary)' : 'var(--color-primary)',
      border: 'none',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 14px',
      fontSize: 13,
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background var(--duration-fast) var(--ease)'
    }
  }, children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const kindMap = {
  info: {
    fg: 'var(--color-info)',
    bg: 'var(--color-info-bg)'
  },
  normal: {
    fg: 'var(--color-normal)',
    bg: 'var(--color-normal-bg)'
  },
  urgent: {
    fg: 'var(--color-urgent)',
    bg: 'var(--color-urgent-bg)'
  }
};
function Toast({
  kind = 'info',
  children,
  onDismiss
}) {
  const k = kindMap[kind] || kindMap.info;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'var(--color-canvas)',
      border: `1px solid var(--color-border)`,
      borderLeft: `3px solid ${k.fg}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-elevated)',
      padding: '12px 14px',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--color-ink)',
      minWidth: 260
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: k.fg
    }
  }, "\u25CF"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, children), onDismiss && /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss,
    "aria-label": "Tancar",
    style: {
      border: 'none',
      background: 'transparent',
      color: 'var(--color-ink-subtle)',
      cursor: 'pointer',
      fontSize: 16
    }
  }, "\xD7"));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  children,
  label,
  position = 'top'
}) {
  const [show, setShow] = React.useState(false);
  const posStyle = {
    top: {
      bottom: '125%',
      left: '50%',
      transform: 'translateX(-50%)'
    },
    bottom: {
      top: '125%',
      left: '50%',
      transform: 'translateX(-50%)'
    }
  }[position] || {};
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-block'
    },
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false)
  }, children, show && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      ...posStyle,
      background: 'var(--color-ink)',
      color: '#fff',
      fontSize: 12,
      fontFamily: 'var(--font-body)',
      padding: '5px 9px',
      borderRadius: 'var(--radius-sm)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-elevated)',
      zIndex: 10
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  disabled = false
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--color-ink)',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--radius-sm)',
      border: `1.5px solid ${checked ? 'var(--color-primary)' : 'var(--color-border-strong)'}`,
      background: checked ? 'var(--color-primary)' : 'var(--color-canvas)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--duration-fast) var(--ease), border-color var(--duration-fast) var(--ease)',
      flexShrink: 0
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#fff',
      fontSize: 13,
      lineHeight: 1
    }
  }, "\u2713")), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      display: 'none'
    }
  }), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  type = 'text'
}) {
  const [focused, setFocused] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-label-size)',
      fontWeight: 'var(--text-label-weight)',
      letterSpacing: 'var(--text-label-tracking)',
      textTransform: 'uppercase',
      color: 'var(--color-ink-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value,
    placeholder: placeholder,
    disabled: disabled,
    onChange: onChange,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      fontSize: 15,
      fontFamily: 'var(--font-body)',
      color: 'var(--color-ink)',
      padding: '10px 12px',
      minHeight: 44,
      boxSizing: 'border-box',
      borderRadius: 'var(--radius-md)',
      border: `1px solid ${error ? 'var(--color-urgent)' : focused ? 'var(--color-primary)' : 'var(--color-border-strong)'}`,
      outline: focused ? 'var(--focus-ring)' : 'none',
      outlineOffset: 'var(--focus-ring-offset)',
      background: disabled ? 'var(--color-surface-1)' : 'var(--color-canvas)',
      transition: 'border-color var(--duration-base) var(--ease)'
    }
  }), error && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--color-urgent)'
    }
  }, error));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  checked,
  onChange,
  disabled = false,
  name
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--color-ink)',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      border: `1.5px solid ${checked ? 'var(--color-primary)' : 'var(--color-border-strong)'}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'border-color var(--duration-fast) var(--ease)'
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--color-primary)'
    }
  })), /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      display: 'none'
    }
  }), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  onChange,
  disabled = false
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-label-size)',
      fontWeight: 'var(--text-label-weight)',
      letterSpacing: 'var(--text-label-tracking)',
      textTransform: 'uppercase',
      color: 'var(--color-ink-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("select", {
    value: value,
    disabled: disabled,
    onChange: onChange,
    style: {
      fontSize: 15,
      fontFamily: 'var(--font-body)',
      color: 'var(--color-ink)',
      padding: '10px 12px',
      minHeight: 44,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border-strong)',
      background: disabled ? 'var(--color-surface-1)' : 'var(--color-canvas)',
      outlineOffset: 'var(--focus-ring-offset)'
    }
  }, options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  onChange,
  disabled = false,
  label
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": checked,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 40,
      height: 24,
      borderRadius: 'var(--radius-pill)',
      background: checked ? 'var(--color-primary)' : 'var(--color-border-strong)',
      position: 'relative',
      flexShrink: 0,
      transition: 'background var(--duration-base) var(--ease)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: checked ? 19 : 3,
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
      transition: 'left var(--duration-base) var(--ease)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--color-ink)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  tabs,
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderBottom: '1px solid var(--color-border)',
      gap: 4
    }
  }, tabs.map(t => {
    const isActive = t.value === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      onClick: () => onChange && onChange(t.value),
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 16px',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 500,
        color: isActive ? 'var(--color-primary)' : 'var(--color-ink-muted)',
        borderBottom: `2px solid ${isActive ? 'var(--color-primary)' : 'transparent'}`,
        marginBottom: -1,
        transition: 'color var(--duration-base) var(--ease), border-color var(--duration-base) var(--ease)'
      }
    }, t.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Dialog.jsx
try { (() => {
function Dialog({
  open,
  title,
  children,
  onClose,
  actions
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(17,24,39,0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--color-canvas)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-overlay)',
      padding: 'var(--layout-card-padding-content)',
      width: 380,
      maxWidth: '90vw',
      fontFamily: 'var(--font-body)'
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-display-xs-size)',
      fontWeight: 'var(--text-display-xs-weight)',
      color: 'var(--color-ink)',
      marginBottom: 12
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--color-ink)',
      fontSize: 15,
      lineHeight: 1.65
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 20
    }
  }, actions)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Dialog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Booking.jsx
try { (() => {
const SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
const UNAVAILABLE = ['11:00', '16:00'];
function Booking() {
  const {
    Select,
    Tag,
    Button,
    Dialog,
    Toast,
    Card
  } = window.EspaiLlibertatDesignSystem_7b8831;
  const [room, setRoom] = React.useState('vitalitat');
  const [slot, setSlot] = React.useState(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const roomLabel = {
    vitalitat: 'Sala Vitalitat',
    equilibri: 'Sala Equilibri',
    arrel: 'Sala Arrel'
  }[room];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 32px',
      maxWidth: 640,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 28,
      fontWeight: 600,
      color: 'var(--color-ink)'
    }
  }, "Reservar un espai"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--color-ink-muted)',
      marginTop: 8
    }
  }, "Tria l'espai, la franja hor\xE0ria i confirma."), /*#__PURE__*/React.createElement(Card, {
    padding: "content",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: 'var(--color-primary)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      fontWeight: 600
    }
  }, "1"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 2,
      background: 'var(--color-primary)',
      alignSelf: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: slot ? 'var(--color-primary)' : 'var(--color-border-strong)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      fontWeight: 600
    }
  }, "2"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 2,
      background: slot ? 'var(--color-primary)' : 'var(--color-border-strong)',
      alignSelf: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: done ? 'var(--color-primary)' : 'var(--color-border-strong)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      fontWeight: 600
    }
  }, "3")), /*#__PURE__*/React.createElement(Select, {
    label: "Espai",
    value: room,
    onChange: e => setRoom(e.target.value),
    options: [{
      value: 'vitalitat',
      label: 'Sala Vitalitat — 18€/hora'
    }, {
      value: 'equilibri',
      label: 'Sala Equilibri — 15€/hora'
    }, {
      value: 'arrel',
      label: 'Sala Arrel — 40€/hora'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-label-size)',
      fontWeight: 'var(--text-label-weight)',
      letterSpacing: 'var(--text-label-tracking)',
      textTransform: 'uppercase',
      color: 'var(--color-ink-muted)',
      marginTop: 20,
      marginBottom: 8
    }
  }, "Dijous, 16 de juliol"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 8
    }
  }, SLOTS.map(s => {
    const unavailable = UNAVAILABLE.includes(s);
    return /*#__PURE__*/React.createElement(Tag, {
      key: s,
      selected: slot === s,
      onClick: unavailable ? undefined : () => setSlot(s)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: unavailable ? 0.4 : 1
      }
    }, s));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    disabled: !slot,
    onClick: () => setConfirmOpen(true)
  }, "Continuar"))), /*#__PURE__*/React.createElement(Dialog, {
    open: confirmOpen,
    title: "Confirmar reserva",
    onClose: () => setConfirmOpen(false),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setConfirmOpen(false)
    }, "Cancel\xB7lar"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setConfirmOpen(false);
        setDone(true);
      }
    }, "Confirmar"))
  }, roomLabel, ", dijous 16 de juliol, ", slot, "\u2013", slot && String(Number(slot.slice(0, 2)) + 1).padStart(2, '0') + slot.slice(2), "."), done && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    kind: "normal",
    onDismiss: () => setDone(false)
  }, "Reserva confirmada per ", roomLabel.toLowerCase(), ".")));
}
window.Booking = Booking;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Booking.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Contact.jsx
try { (() => {
function Contact() {
  const {
    Input,
    Checkbox,
    Button,
    Card
  } = window.EspaiLlibertatDesignSystem_7b8831;
  const [sent, setSent] = React.useState(false);
  const [remind, setRemind] = React.useState(true);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 32px',
      maxWidth: 520,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 28,
      fontWeight: 600,
      color: 'var(--color-ink)'
    }
  }, "Contacte"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--color-ink-muted)',
      marginTop: 8
    }
  }, "Escriu-nos i et responem en menys de 24 hores."), /*#__PURE__*/React.createElement(Card, {
    padding: "content",
    style: {
      marginTop: 24
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--color-normal)',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u2713"), " Missatge enviat. Gr\xE0cies!") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nom complet",
    placeholder: "Anna Puig"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Correu",
    placeholder: "anna@exemple.cat",
    type: "email"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Missatge",
    placeholder: "Vull saber-ne m\xE9s sobre..."
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Vull rebre novetats per correu",
    checked: remind,
    onChange: e => setRemind(e.target.checked)
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    onClick: () => setSent(true)
  }, "Enviar missatge")))));
}
window.Contact = Contact;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Footer.jsx
try { (() => {
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--color-border)',
      padding: '32px',
      background: 'var(--color-surface-1)',
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--color-ink-muted)'
    }
  }, /*#__PURE__*/React.createElement("div", null, "\xA9 2026 Espai Llibertat \xB7 Coworking de Salut"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("span", null, "Carrer de la Salut, Barcelona"), /*#__PURE__*/React.createElement("span", null, "hola@espaillibertat.cat")));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Header.jsx
try { (() => {
function Header({
  page,
  onNavigate
}) {
  const links = [{
    key: 'home',
    label: 'Inici'
  }, {
    key: 'spaces',
    label: 'Espais'
  }, {
    key: 'booking',
    label: 'Reservar'
  }, {
    key: 'contact',
    label: 'Contacte'
  }];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 'var(--layout-header-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-canvas)',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => onNavigate('home'),
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 17,
      letterSpacing: '-0.01em',
      color: 'var(--color-ink)',
      cursor: 'pointer'
    }
  }, "Espai Llibertat ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-primary)'
    }
  }, "\xB7"), " Coworking de Salut"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 28
    }
  }, links.map(l => /*#__PURE__*/React.createElement("button", {
    key: l.key,
    onClick: () => onNavigate(l.key),
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      fontWeight: 500,
      padding: '4px 0',
      color: page === l.key ? 'var(--color-primary)' : 'var(--color-ink-muted)',
      borderBottom: `2px solid ${page === l.key ? 'var(--color-primary)' : 'transparent'}`
    }
  }, l.label))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Home.jsx
try { (() => {
function Home({
  onNavigate
}) {
  const {
    Button,
    Card,
    Icon,
    Badge
  } = window.EspaiLlibertatDesignSystem_7b8831;
  const rooms = [{
    name: 'Sala Vitalitat',
    desc: '6 places · llum natural',
    status: 'normal',
    statusLabel: 'Disponible'
  }, {
    name: 'Sala Equilibri',
    desc: '4 places · privada',
    status: 'warning',
    statusLabel: '2 places'
  }, {
    name: 'Sala Arrel',
    desc: '12 places · sala gran',
    status: 'normal',
    statusLabel: 'Disponible'
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 32px',
      textAlign: 'center',
      background: 'var(--color-canvas)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 44,
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: 'var(--color-ink)',
      maxWidth: 680,
      margin: '0 auto',
      lineHeight: 1.2
    }
  }, "Un espai de cowork per a professionals de la salut"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 17,
      color: 'var(--color-ink-muted)',
      maxWidth: 520,
      margin: '20px auto 0',
      lineHeight: 1.65
    }
  }, "Sales privades, llum natural i una comunitat que hi ent\xE9n. Reserva el teu espai en minuts."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      display: 'flex',
      gap: 12,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: () => onNavigate('booking')
  }, "Reservar un espai"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "secondary",
    onClick: () => onNavigate('spaces')
  }, "Veure espais"))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '64px 32px',
      background: 'var(--color-surface-1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 24,
      fontWeight: 600,
      color: 'var(--color-ink)',
      marginBottom: 24,
      textAlign: 'center'
    }
  }, "Espais disponibles avui"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 16,
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, rooms.map(r => /*#__PURE__*/React.createElement(Card, {
    key: r.name,
    hoverable: true,
    padding: "content"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 17,
      color: 'var(--color-ink)'
    }
  }, r.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--color-ink-muted)',
      marginTop: 4
    }
  }, r.desc)), /*#__PURE__*/React.createElement(Icon, {
    name: "door-open",
    size: 18,
    color: "var(--color-primary)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    status: r.status
  }, r.statusLabel)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '64px 32px',
      maxWidth: 900,
      margin: '0 auto',
      display: 'flex',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 600,
      color: 'var(--color-ink)'
    }
  }, "Pensat per reduir la fricci\xF3"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--color-ink-muted)',
      marginTop: 10,
      lineHeight: 1.65
    }
  }, "Molts professionals de la salut arriben al final del dia esgotats. El nostre espai \u2014 i la manera com el reserves \u2014 hauria de restar-hi calma, no afegir-n'hi.")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 20,
      fontWeight: 600,
      color: 'var(--color-ink)'
    }
  }, "Comunitat, no coincid\xE8ncia"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--color-ink-muted)',
      marginTop: 10,
      lineHeight: 1.65
    }
  }, "Fisioterapeutes, psic\xF2legs, nutricionistes i terapeutes comparteixen l'espai \u2014 i sovint, els pacients."))));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/Spaces.jsx
try { (() => {
const ALL_ROOMS = [{
  name: 'Sala Vitalitat',
  desc: '6 places · llum natural · ideal per a sessions individuals',
  price: '18€/hora',
  status: 'normal',
  statusLabel: 'Disponible',
  tags: ['Privada', 'Finestra']
}, {
  name: 'Sala Equilibri',
  desc: '4 places · insonoritzada',
  price: '15€/hora',
  status: 'warning',
  statusLabel: '2 places',
  tags: ['Privada', 'Insonoritzada']
}, {
  name: 'Sala Arrel',
  desc: '12 places · per a tallers i formacions',
  price: '40€/hora',
  status: 'normal',
  statusLabel: 'Disponible',
  tags: ['Gran', 'Projector']
}, {
  name: 'Sala Calma',
  desc: '2 places · per a consultes 1:1',
  price: '12€/hora',
  status: 'follow-up',
  statusLabel: 'Llista d\u2019espera',
  tags: ['Privada']
}, {
  name: 'Espai Comú',
  desc: 'Places obertes · zona de treball compartida',
  price: '8€/dia',
  status: 'normal',
  statusLabel: 'Disponible',
  tags: ['Compartit', 'Llum natural']
}];
function Spaces({
  onNavigate
}) {
  const {
    Card,
    Badge,
    Tag,
    Button,
    Icon
  } = window.EspaiLlibertatDesignSystem_7b8831;
  const [filter, setFilter] = React.useState('Totes');
  const filters = ['Totes', 'Privada', 'Compartit', 'Gran'];
  const rooms = filter === 'Totes' ? ALL_ROOMS : ALL_ROOMS.filter(r => r.tags.includes(filter));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '48px 32px',
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 28,
      fontWeight: 600,
      color: 'var(--color-ink)'
    }
  }, "Espais"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--color-ink-muted)',
      marginTop: 8
    }
  }, "Cinc espais, cada un pensat per a un tipus de sessi\xF3 diferent."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 24
    }
  }, filters.map(f => /*#__PURE__*/React.createElement(Tag, {
    key: f,
    selected: filter === f,
    onClick: () => setFilter(f)
  }, f))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 16,
      marginTop: 24
    }
  }, rooms.map(r => /*#__PURE__*/React.createElement(Card, {
    key: r.name,
    padding: "content",
    hoverable: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 17,
      color: 'var(--color-ink)'
    }
  }, r.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--color-ink-muted)',
      marginTop: 4,
      maxWidth: 320
    }
  }, r.desc)), /*#__PURE__*/React.createElement(Icon, {
    name: "door-open",
    size: 18,
    color: "var(--color-primary)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    status: r.status
  }, r.statusLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--color-ink)'
    }
  }, r.price)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "secondary",
    onClick: () => onNavigate('booking')
  }, "Reservar"))))));
}
window.Spaces = Spaces;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/Spaces.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Dialog = __ds_scope.Dialog;

})();
