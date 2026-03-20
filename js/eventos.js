"use strict"; 

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

function clearEditor(input, preview) {
    const message = "¿Estás seguro de que quieres borrar todo el contenido? Esta acción no se puede deshacer.";

    if(confirm(message)) {
        input.value = "";
        preview.innerHTML = "<p>La previsualización aparecerá aquí...</p>";
        input.focus();
    }
}

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
        margin: 10,
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