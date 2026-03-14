

## Plan: Replace inline SEO script in `index.html`

Replace lines 19–108 (the entire `<script>...</script>` block after the hreflang links) with the user-provided version. Two key changes:

1. **Expanded route map** — adds ~15 new routes: `/servicios/compliance-fiscal`, `/servicios/auditoria-subvenciones`, `/servicios/contratos-laborales`, `/servicios/derecho-mercantil`, `/servicios/contratos-mercantiles`, `/servicios/taxonomia-europea`, `/servicios/canal-denuncias`, `/sobre-nosotros`, `/recursos`, `/carreras`, `/condiciones-contratacion`, `/aviso-legal`, `/ca/serveis/auditoria-subvencions-autonomiques`, `/ca/serveis/auditoria-subvencions-publiques`, `/ca/serveis/auditoria-sistemes-it-cobit`, `/ca/carreres`, `/en/services/eu-taxonomy-verification`

2. **Fixed `setMeta` function** — current version uses `attr === 'content' ? 'name' : 'property'` which is inverted logic for creating missing og: tags. New version uses `/og:|twitter:/.test(sel)` to correctly choose between `property` and `name` attributes.

3. **Native UTF-8 characters** — uses literal `ó`, `í`, `é`, `ñ`, `—` instead of `\u00f3` unicode escapes, which is cleaner and avoids any double-encoding risk.

### File
- **`index.html`** — replace lines 19–108

