# Markdown to PDF
Convert Markdown files to pdf files using JavaScript

## Estructura de la aplicación (Fase 1: Interfaz)
Para convertir Markdown a PDF, necesitamos tres elementos clave en nuestro `<section>`: un área de escritura, un área de previsualización y un botón de acción. Vamos a darle vida a ese HTML:

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
##### El CSS
```bash
CSS
#main-view {
    display: flex;
    align-content: space-between;
    padding: 1em;

    textarea {
        width: 50%;
    }

    #preview {
        display: inline-block;
        padding: 0.5em;
        width: 50%;

        border: 1px solid #ddd;
        background-color: #fff;
        min-height: 400px;
        line-height: 1.6;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        
        h1 { 
            border-bottom: 2px solid #eee; 
            padding-bottom: 10px; 
        }

        code { 
            background: #f4f4f4; 
            padding: 2px 4px; 
            border-radius: 4px; 
        }

        blockquote { 
            border-left: 4px solid #dfe2e5; 
            color: #6a737d; 
            padding-left: 16px; 
        }
    }
}

.actions {
    text-align: center;
    margin: 1em 0 1em;

    button {
        padding: 1em;
    }
}
```
##### El JS 
###### Integración de Marked.js (la librería)
Añadimos esta línea a nuestro `<head>`, justo antes de `eventos.js`:
```bash
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
```
###### Nuestro `eventos.js`

