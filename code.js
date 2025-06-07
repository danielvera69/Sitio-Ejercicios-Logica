document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DEL ACORDEÓN ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const accordion = header.parentElement;
            const content = header.nextElementSibling;
            const isActive = accordion.classList.contains('active');

            document.querySelectorAll('.accordion.active').forEach(activeAccordion => {
                if (activeAccordion !== accordion) {
                    activeAccordion.classList.remove('active');
                    activeAccordion.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            if (isActive) {
                accordion.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                accordion.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // --- LÓGICA DE PESTAÑAS (TABS) ---
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();

            const tabContainer = button.parentElement;
            const codeContainer = tabContainer.parentElement;
            const allPanels = codeContainer.querySelectorAll('.code-panel');
            const allButtons = tabContainer.querySelectorAll('.tab-button');
            const tabIndex = Array.from(allButtons).indexOf(button);
            
            allButtons.forEach(btn => btn.classList.remove('active'));
            allPanels.forEach(panel => panel.classList.remove('active'));

            button.classList.add('active');
            allPanels[tabIndex].classList.add('active');
            
            const accordion = button.closest('.accordion');
            if (accordion && accordion.classList.contains('active')) {
                const content = accordion.querySelector('.accordion-content');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // --- LÓGICA PARA MANEJAR EL POPUP MODAL ---
    const modalContainer = document.getElementById('modal-container');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    const closeModal = () => modalContainer.classList.remove('visible');

    modalCloseBtn.addEventListener('click', closeModal);
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('visible')) closeModal();
    });
});

// ============ FUNCIÓN DE EJECUCIÓN DE CÓDIGO (CON MODAL) =============
function executeCode(codeBlockId) {
    const codeElement = document.getElementById(codeBlockId);
    if (!codeElement) {
        console.error("No se encontró el elemento de código con ID:", codeBlockId);
        return;
    }

    const code = codeElement.innerText;
    const modalContainer = document.getElementById('modal-container');
    const consoleOutput = document.getElementById('modal-console-output');

    consoleOutput.innerHTML = '';
    modalContainer.classList.add('visible');

    const oldLog = console.log;
    const oldError = console.error;

    const appendToModalConsole = (message, className = 'console-line') => {
        const line = document.createElement('div');
        line.className = className;
        line.textContent = message;
        consoleOutput.appendChild(line);
    };

    console.log = (...args) => {
        oldLog.apply(console, args);
        const message = args.map(arg => typeof arg === 'object' && arg !== null ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
        appendToModalConsole(message);
    };
    
    console.error = (error) => {
        oldError.apply(console, [error]);
        appendToModalConsole(`Error: ${error.message || error}`, 'console-line error');
    };

    try {
        new Function(code)();
    } catch (e) {
        console.error(e);
    } finally {
        console.log = oldLog;
        console.error = oldError;
    }
}