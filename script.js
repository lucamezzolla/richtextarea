let cursorPosition;

function apply(command) {
    document.execCommand(command);
    updateHtmlCode();
    window.getSelection()?.removeAllRanges();
}

function wrapSelectedText(tag) {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();
    const wrapper = document.createElement(tag);
    let parentNode = range.commonAncestorContainer;
    while (parentNode && !parentNode.nodeName.match(/^(H1|H2|H3)$/)) {
        parentNode = parentNode.parentNode;
    }
    if (parentNode) {
        // Rimuovi il tag di intestazione esistente
        const parent = parentNode.parentNode;
        while (parentNode.firstChild) {
            parent.insertBefore(parentNode.firstChild, parentNode);
        }
        parent.removeChild(parentNode);
    }
    wrapper.appendChild(selectedText);
    range.insertNode(wrapper);
    updateHtmlCode();
    window.getSelection()?.removeAllRanges();
}

function openImageModal() {
    // Verifica se il cursore è presente nell'editor
    const editor = document.getElementById('editor');
    const selection = window.getSelection();
    if (!editor.contains(selection.anchorNode)) {
        alert('Place the cursor in the editor before inserting an image.');
        return;
    }
    cursorPosition = saveSelection();
    document.getElementById('imageModal').style.display = 'block';
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

function handleModifyOption() {
    const modifyOption = document.getElementById('modifyOption').value;
    const widthInput = document.getElementById('imageWidthDiv');
    const heightInput = document.getElementById('imageHeightDiv');

    if (modifyOption === 'both') {
        widthInput.style.display = 'block';
        heightInput.style.display = 'block';
    } else if (modifyOption === 'width') {
        widthInput.style.display = 'block';
        heightInput.style.display = 'none';
        heightInput.value = '';
    } else if (modifyOption === 'height') {
        widthInput.style.display = 'none';
        heightInput.style.display = 'block';
        widthInput.value = '';
    }
}

function insertImage() {
    const imageUrl = document.getElementById('imageUrl').value;
    const imageWidth = document.getElementById('imageWidth').value;
    const imageHeight = document.getElementById('imageHeight').value;
    const imageAlign = document.getElementById('imageAlign').value;
    const imageMargin = document.getElementById('imageMargin').value;

    let imageStyle = '';
    if (imageWidth) {
        imageStyle += `width: ${imageWidth}; `;
    }
    if (imageHeight) {
        imageStyle += `height: ${imageHeight}; `;
    }
    if (imageMargin) {
        imageStyle += `margin: ${imageMargin}; `;
    }

    const imageTag = `<img src="${imageUrl}" style="${imageStyle}" align="${imageAlign}">`;
    console.log(imageTag);
    restoreSelection(cursorPosition);
    document.execCommand('insertHTML', false, imageTag);

    closeImageModal();
    updateHtmlCode();
}

function updateHtmlCode() {
    const editorContent = document.getElementById('editor').innerHTML;
    document.getElementById('html-code').value = editorContent;
}

function updateEditorContent() {
    const htmlCode = document.getElementById('html-code').value;
    document.getElementById('editor').innerHTML = htmlCode;
}

function handleEnterKey() {
    updateHtmlCode();
}

function saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        return selection.getRangeAt(0);
    }
    return null;
}

function restoreSelection(range) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function updateCursorPosition() {
    cursorPosition = saveSelection();
}

function openLinkModal() {
    // Verifica se il cursore è presente nell'editor
    const editor = document.getElementById('editor');
    const selection = window.getSelection();
    if (!editor.contains(selection.anchorNode)) {
        alert('Place the cursor in the editor before inserting a link.');
        return;
    }
    document.getElementById('linkText').value = '';  // Pulisce il campo del testo
    document.getElementById('linkUrl').value = '';   // Pulisce il campo dell'URL
    document.getElementById('linkTarget').value = '_blank';  // Imposta il target predefinito
    document.getElementById('linkModal').style.display = 'block';  // Apre il modal
}

function openColorModal() {
    // Verifica se il cursore è presente nell'editor
    const editor = document.getElementById('editor');
    const selection = window.getSelection();
    if (!editor.contains(selection.anchorNode)) {
        alert('Place the cursor in the editor before inserting an image.');
        return;
    }
    document.getElementById('colorModal').style.display = 'block';
}

function insertColor() {
    // Recupera i valori da inserire
    const linkText = document.getElementById('colorText').value;
    const linkColor = document.getElementById('color').value;
    // Costruisci il tag 'div'
    const linkTag = `<div style='color: ${linkColor}'>${linkText}</div>\r\n`;
    document.execCommand('insertHTML', false, linkTag);
    // Chiudi il modal
    closeColorModal();
}

function insertLink() {
    // Recupera i valori da inserire
    const linkText = document.getElementById('linkText').value;
    const linkUrl = document.getElementById('linkUrl').value;
    const linkTarget = document.getElementById('linkTarget').value;
    // Costruisci il tag 'a'
    const linkTag = `<a href="${linkUrl}" target="${linkTarget}">${linkText}</a>`;
    // Ripristina la selezione e inserisci il link
    restoreSelection(cursorPosition);
    document.execCommand('insertHTML', false, linkTag);
    // Chiudi il modal
    closeLinkModal();
}

function removeLink() {
    document.execCommand('unlink');
    updateHtmlCode();
}

function closeLinkModal() {
    // Chiudi il modal
    document.getElementById('linkModal').style.display = 'none';
    // Pulisci i campi del modal
    document.getElementById('linkText').value = '';
    document.getElementById('linkUrl').value = '';
    document.getElementById('linkTarget').value = '_blank';
}

function closeColorModal() {
    // Chiudi il modal
    document.getElementById('colorModal').style.display = 'none';
    document.getElementById('colorText').value = '';
    document.getElementById('color').value = '#000000';
}

function toggleEditorView() {
    const editorArea = document.getElementById('editor');
    const codeArea = document.getElementById('code');
    const toolbarButtons = document.querySelectorAll('.editor-toolbar button');
    var hideButtons = 'none';
    if (editorArea.style.display === 'block' || editorArea.style.display === '') {
        editorArea.style.display = 'none';
        codeArea.style.display = 'block';
    } else {
        editorArea.style.display = 'block';
        codeArea.style.display = 'none';
        hideButtons = 'block';
    }
    toolbarButtons.forEach(button => {
        if (button.id !== 'code-button') {
            button.style.display = hideButtons;
        }
    });
}