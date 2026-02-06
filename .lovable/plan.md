

## Plan: Hacer visible el Canal de Denuncias en la web

### Problema actual
La pagina `/canal-denuncias` existe y funciona, pero no hay ningun enlace visible en la navegacion del sitio (ni en el Navbar ni en el Footer). La Ley 2/2023 requiere que el canal de denuncias sea facilmente accesible.

### Cambios propuestos

#### 1. Footer - Seccion de enlaces legales (Bottom Bar)
Anadir un enlace "Canal de Denuncias" en la barra inferior del Footer, junto a los otros enlaces legales (Aviso Legal, Privacidad, Cookies, Condiciones).

**Archivo:** `src/components/layout/Footer.tsx` (lineas 235-259)
- Anadir un nuevo `LanguageLink` a `/canal-denuncias` con el texto traducido

#### 2. Footer - Columna "Empresa"
Anadir tambien el enlace en la columna de navegacion "Empresa" del Footer, entre "Carreras" y "Contacto".

**Archivo:** `src/components/layout/Footer.tsx` (lineas 207-217)
- Anadir un nuevo `LanguageLink` a `/canal-denuncias`

#### 3. Traducciones
Anadir las claves de traduccion necesarias para los tres idiomas:
- ES: "Canal de Denuncias"
- EN: "Whistleblower Channel"  
- CA: "Canal de Denuncies"

**Archivos de traduccion** afectados (segun el sistema i18n del proyecto).

### Resultado esperado
- El canal de denuncias sera accesible desde cualquier pagina del sitio a traves del Footer
- Cumple con el requisito de accesibilidad de la Ley 2/2023
- Se mantiene el estilo visual consistente con los otros enlaces

### Detalles tecnicos
- Se usa el componente `LanguageLink` existente para manejar las rutas localizadas
- Se anade la clave `footer.whistleblower` al sistema de traduccion con `t()`
- No se modifica el Navbar principal para no sobrecargar la navegacion; el Footer es el lugar estandar para este tipo de enlace legal/compliance
