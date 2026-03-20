# Markdown to PDF
Convert Markdown files to pdf files using JavaScript

## Estructura de la aplicación (Fase 1: Interfaz)
Para convertir Markdown a PDF, necesitamos tres elementos clave en nuestro `section`: un área de escritura, un área de previsualización y un botón de acción. Vamos a darle vida a ese HTML:

##### El HTML
```bash
HTML
<section class="editor-container">
    <div id="main-view">
        <textarea name="markdown-input" id="markdown-input" placeholder="Escribe tu markdown aquí...."></textarea>

        <div id="preview" class="preview-area">
            <p>La previsualización aparecerá aquí...</p>
        </div>
    </div>

    <div class="actions">
        <button id="btn-download">Exportar a PDF</button>
    </div>
</section>
```
<br/>

##### El CSS
```bash
CSS
#main-view {
    display: flex;
    gap: 20px;
    padding: 20px;
    width: 100%; /* Cambiado de 95% para evitar recortes */
    justify-content: center;
}

#markdown-input {
    flex: 1;
    height: 80vh;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    resize: none;
}

#preview {      
    padding: 20mm;
    width: 210mm;       /* Ancho A4 exacto */
    background-color: var(--paper-color);
    box-shadow: var(--shadow);
    box-sizing: border-box;
    overflow-wrap: break-word;
    min-height: 297mm;  /* Alto A4 exacto */
    line-height: 1.6;
    font-family: Arial, sans-serif;
    
    /* Regla crítica para evitar que elementos internos se alineen en center */
    text-align: left; 
}

/* Estilos para elementos internos del preview */
#preview h1 { 
    border-bottom: 1px solid #eee; 
    padding-bottom: 10px;
    color: #2c3e50;
    text-align: left; /* El h1 global era center, aquí lo reseteamos */
}

#preview p {
    text-align: justify;
    color: #333;
    margin-bottom: 1em;
}

#preview code { 
    background: #f4f4f4; 
    padding: 2px 4px; 
    border-radius: 4px; 
}

#preview pre, #preview code {
	white-space: pre-wrap;
	word-wrap: break-word;
	word-break: break-all;  
}

.actions {
	text-align: center;
	margin: 1em 0 1em;

	button {
		padding: 1em;
	}
}
```
<br/>

##### El JS 
###### Integración de Marked.js (la librería)
Añadimos esta línea a nuestro `<head>`, justo antes de `eventos.js`:
```bash
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
```
###### Nuestro `eventos.js`
```bash
"use strict"; 

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');

    input.addEventListener('input', (e) => {
        const texto = e.target.value;
        preview.innerHTML = marked.parse(texto)
    });
});
```

## El siguiente gran reto: Generar el PDF
#### Añadimos la librería
Primero, añadimos la librería a nuestro `<head>`, justo antes de tu eventos.js:
```bash
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

```

#### Implementación en `eventos.js`
Vamos a añadir una nueva función a nuestro archivo. Recuerda que es una buena práctica separar la **lógica de eventos** de la **lógica de generación**. Definimos nuestro botón para generar el PDF, añadimos la función que se encarga de la conversión y capturamos el evento que dispara la funcionalidad.
```bash
"use strict"; 

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');
    const buttonDownload = document.getElementById('btn-download');

    input.addEventListener('input', (e) => {
        const texto = e.target.value;
        preview.innerHTML = marked.parse(texto)
    });

    buttonDownload.addEventListener('click', () => {
        exportToPdf(preview);
    });
});

/**
 * Configuración y generación del PDF
 * @param {HTMLElement} element - El div que queremos convertir
 * @param {HTMLButtonElement} btn - El botón que dispara la acción
 */
function exportToPdf(element) {       
    // Setting the PDF options
    const options = {
        margin: 0,
        filename: "mi-documento.pdf",
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 3, // Subimos a 3 para una nitidez cristalina
            useCORS: true,
            letterRendering: true,
            scrollX: 0,
            scrollY: 0,
            // Eliminamos windowWidth y width manuales para que 
            // use el tamaño real del div #preview de 210mm
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }    
    };

    html2pdf()
        .set(options)
        .from(element)
        .save()        
}
```
#### El concepto técnico: Promesas y "Asincronía"
Generar un PDF no es instantáneo. El navegador tiene que renderizar, capturar y comprimir. La librería `html2pdf` utiliza **Promesas**.

Ahora mismo, si el usuario hace clic muchas veces seguidas, se dispararán varias descargas. Vamos a optimizar esto.

Aunque en el código de arriba lo hacemos de forma simple, en una aplicación profesional querríamos mostrar un mensaje de "Generando..." mientras se procesa.

##### Deshabilitando el botón durante la generación del PDF
Vamos a modificar la función `exportarAPdf` en `eventos.js` para que reciba también el botón, lo deshabilite y le cambie el texto para dar feedback al usuario.
```bash
"use strict"; 

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');
    const buttonDownload = document.getElementById('btn-download');

    input.addEventListener('input', (e) => {
        const texto = e.target.value;
        preview.innerHTML = marked.parse(texto)
    });

    buttonDownload.addEventListener('click', () => {
        exportToPdf(preview, buttonDownload);
    });
});

/**
 * Configuración y generación del PDF
 * @param {HTMLElement} element - El div que queremos convertir
 * @param {HTMLButtonElement} btn - El botón que dispara la acción
 */
function exportToPdf(element, btn) {
    btn.disabled = true;        
    const originalText = btn.innerText;
    btn.innerText = "Generando PDF... ⏳";
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";    

    // Setting the PDF options
    const options = {
        margin: 0,
        filename: "mi-documento.pdf",
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 3, // Subimos a 3 para una nitidez cristalina
            useCORS: true,
            letterRendering: true,
            scrollX: 0,
            scrollY: 0,
            // Eliminamos windowWidth y width manuales para que 
            // use el tamaño real del div #preview de 210mm
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        }    
    };

    html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(() => {
            btn.disabled = false;            
            btn.innerHTML = originalText;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';            
            console.log("!PDF generado con éxito!");
        })
        .catch(error => {
            console.log("Error al generar el PDF", error);
            btn.disabled = false;
            btn.innerText = "Error, reintentar";
        });
}
```
<br/>

##### Manejo de múltiples páginas
Añadimos estas reglas a nuestro `css/estilo.css`:
```bash
/* Evita que un elemento se rompa a la mitad entre dos páginas */
#preview p, 
#preview blockquote, 
#preview pre,
#preview li {
    page-break-inside: avoid;
    break-inside: avoid;
}

/* Fuerza que los títulos siempre empiecen en una página nueva si están muy abajo */
#preview h1, 
#preview h2 {
    page-break-after: avoid;
    break-after: avoid;
}

/* Clase de utilidad por si quieres forzar un salto de página manual en tu Markdown */
.html2pdf__page-break {
    display: block;
    height: 0;
    page-break-before: always;
    break-before: always;
}
```
<br/>

##### Configurando la Segmentación en `eventos.js`
```bash
const options = {
    margin: 0,
    filename: "mi-documento.pdf",
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
        scale: 3, 
        useCORS: true,
        letterRendering: true,
        scrollX: 0,
        scrollY: 0
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    // NUEVA PROPIEDAD: Control de saltos de página
    pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'], 
        // 'avoid-all' intenta no romper elementos por la mitad
        // 'css' busca las reglas que pusimos en el CSS arriba
    }
};
```
Modificamos el `min-height` en la regla `#preview`:
```bash
#preview {      
    padding: 20mm;
    width: 210mm;       
    background-color: var(--paper-color);
    box-shadow: var(--shadow);
    box-sizing: border-box; /* Esto es vital para que el padding no sume al ancho */
    overflow-wrap: break-word;
    
    /* CAMBIO: Quitamos el min-height fijo de 297 para evitar que 
       el navegador añada una página extra si el contenido es corto. */
    min-height: 250mm; 
    
    line-height: 1.6;
    font-family: Arial, sans-serif;
    text-align: left;
}
```
Añadimos estas nuevas reglas en `css/estilo.css`:
```bash
/* Evita que párrafos o listas se partan a la mitad */
#preview p, #preview li, #preview h1, #preview h2 {
    page-break-inside: avoid;
    break-inside: avoid;
}

/* Elimina márgenes extra del body al imprimir que 
   pueden estar empujando el contenido */
@media print {
    /* Limpieza total del body para que no interfiera con el PDF */
    body { 
        margin: 0 !important; 
        border: none !important; 
        box-shadow: none !important;
        width: 100% !important;
        background: white !important;
    }

    /* Ocultamos elementos que no deben salir en el PDF */
    header, #markdown-input, .actions, hr {
        display: none !important;
    }

    /* Forzamos que el contenedor sea invisible para el flujo */
    #main-view {
        display: block !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    #preview {
        box-shadow: none !important;
        margin: 0 !important;
        /* Aseguramos que empiece arriba del todo */
        position: absolute;
        top: 0;
        left: 0;
    }
}
```
Modificamos el `eventos.js` concretamente esta parte:
```bash
const options = {
    margin: 10, // Cambia de 0 a 10 para dar un respiro a las páginas
    filename: "mi-documento.pdf",
    // ... resto de opciones igual ...
};
```
## Limpiando el editor
Añadimos el nuevo botón:

```bash
<button id="btn-clear-editor">Limpiar Editor</button>
```

Definimos la función que se va a encargar de ello en nuestro `js/eventos.js`:

```bash
function clearEditor(input, preview) {
    const message = "¿Estás seguro de que quieres borrar todo el contenido? Esta acción no se puede deshacer.";

    if(confirm(message)) {
        input.value = "";
        preview.innerHTML = "<p>La previsualización aparecerá aquí...</p>";
        input.focus();
    }
}
```

Capturamos el evento:

```bash
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');
    const buttonDownload = document.getElementById('btn-download');
    const btnClearEditor = document.getElementById('btn-clear-editor');

    input.addEventListener('input', (e) => {
        const texto = e.target.value;
        preview.innerHTML = marked.parse(texto)
    });

    buttonDownload.addEventListener('click', () => {
        exportToPdf(preview, buttonDownload);
    });

    btnClearEditor.addEventListener('click', () => {
        clearEditor(input, preview);
    });
});
```