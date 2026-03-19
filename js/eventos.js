"use strict"; 

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');

    input.addEventListener('input', (e) => {
        const texto = e.target.value;
        preview.innerHTML = marked.parse(texto)
    });
});