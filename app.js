/**
 * QR Code Generator - Main Application
 * Professional QR Code Generator with customization options
 * NOTE: This file uses the 'qrcode.js' library (CDN in index.html)
 */

// ===================================
// State Management
// ===================================

const state = {
    contentType: 'url',
    content: 'https://example.com',
    fgColor: '#000000',
    bgColor: '#ffffff',
    size: 256,
    padding: 4,
    cornerStyle: 'square', // Library qrcode.js does not fully support advanced styling like corners.
    logo: null,
    animate: false,
    addUtm: false,
    theme: 'light',
    direction: 'ltr'
};

// ===================================
// DOM Elements
// ===================================

const elements = {
    // Content Type & Inputs
    contentType: document.getElementById('contentType'),
    urlInput: document.getElementById('urlInput'),
    urlValue: document.getElementById('urlValue'),
    textInput: document.getElementById('textInput'),
    textValue: document.getElementById('textValue'),
    emailInput: document.getElementById('emailInput'),
    emailValue: document.getElementById('emailValue'),
    emailSubject: document.getElementById('emailSubject'),
    phoneInput: document.getElementById('phoneInput'),
    phoneValue: document.getElementById('phoneValue'),
    vcardInput: document.getElementById('vcardInput'),
    vcardName: document.getElementById('vcardName'),
    vcardPhone: document.getElementById('vcardPhone'),
    vcardEmail: document.getElementById('vcardEmail'),
    vcardOrg: document.getElementById('vcardOrg'),
    
    // Customization
    fgColor: document.getElementById('fgColor'),
    bgColor: document.getElementById('bgColor'),
    qrSize: document.getElementById('qrSize'),
    qrSizeValue: document.getElementById('qrSizeValue'),
    qrPadding: document.getElementById('qrPadding'),
    qrPaddingValue: document.getElementById('qrPaddingValue'),
    cornerStyle: document.querySelectorAll('input[name="cornerStyle"]'),
    logoUpload: document.getElementById('logoUpload'),
    clearLogo: document.getElementById('clearLogo'),
    animateQr: document.getElementById('animateQr'),
    addUtm: document.getElementById('addUtm'),
    
    // Preview & Actions
    qrCanvas: document.getElementById('qrCanvas'),
    downloadPng: document.getElementById('downloadPng'),
    downloadSvg: document.getElementById('downloadSvg'),
    copyBtn: document.getElementById('copyBtn'),
    printBtn: document.getElementById('printBtn'),
    
    // Theme & RTL
    themeToggle: document.getElementById('themeToggle'),
    rtlToggle: document.getElementById('rtlToggle'),
    
    // Toast
    toast: document.getElementById('toast')
};

// ===================================
// Initialization
// ===================================

function init() {
    // Wait slightly for the DOM to be fully painted and elements measured
    setTimeout(() => {
        loadSettings();
        applyTheme();
        applyDirection();
        attachEventListeners();
        updateInputFields();
        generateQRCode();
    }, 50); 
}

// ===================================
// Settings Management (localStorage)
// ===================================

function loadSettings() {
    try {
        const saved = localStorage.getItem('qrGeneratorSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            
            // Only load customization settings (content is handled by UI values)
            ['contentType', 'fgColor', 'bgColor', 'size', 'padding', 'cornerStyle', 'animate', 'addUtm', 'theme', 'direction'].forEach(key => {
                if (settings[key] !== undefined) {
                    state[key] = settings[key];
                }
            });

            // Set content based on type from loaded state
            switch(state.contentType) {
                case 'url':
                    elements.urlValue.value = settings.content || state.content;
                    break;
                case 'text':
                    elements.textValue.value = settings.content || state.content;
                    break;
                case 'email':
                    // Note: Email content storage is simplified here
                    elements.emailValue.value = settings.contentEmail || '';
                    elements.emailSubject.value = settings.contentSubject || '';
                    break;
                case 'phone':
                    elements.phoneValue.value = settings.content || state.content;
                    break;
                case 'vcard':
                    // Note: vCard content storage is simplified here
                    elements.vcardName.value = settings.contentVcardName || '';
                    elements.vcardPhone.value = settings.contentVcardPhone || '';
                    elements.vcardEmail.value = settings.contentVcardEmail || '';
                    elements.vcardOrg.value = settings.contentVcardOrg || '';
                    break;
            }

            // Apply loaded settings to UI
            elements.contentType.value = state.contentType;
            elements.fgColor.value = state.fgColor;
            elements.bgColor.value = state.bgColor;
            elements.qrSize.value = state.size;
            elements.qrPadding.value = state.padding;
            elements.animateQr.checked = state.animate;
            elements.addUtm.checked = state.addUtm;
            
            elements.cornerStyle.forEach(radio => {
                if (radio.value === state.cornerStyle) {
                    radio.checked = true;
                }
            });
            
            // Restore logo (stored as DataURL in localStorage)
            state.logo = settings.logo || null;
            
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function saveSettings() {
    try {
        const settings = {
            // General Settings
            fgColor: state.fgColor,
            bgColor: state.bgColor,
            size: state.size,
            padding: state.padding,
            cornerStyle: state.cornerStyle,
            animate: state.animate,
            addUtm: state.addUtm,
            theme: state.theme,
            direction: state.direction,

            // Content State (Simplified to save necessary fields for restoration)
            contentType: state.contentType,
            content: elements.urlValue.value, // Save URL/default content for simplicity
            contentEmail: elements.emailValue.value,
            contentSubject: elements.emailSubject.value,
            contentVcardName: elements.vcardName.value,
            contentVcardPhone: elements.vcardPhone.value,
            contentVcardEmail: elements.vcardEmail.value,
            contentVcardOrg: elements.vcardOrg.value,
            
            // Logo Data (Can be large, but necessary for quick restore)
            logo: state.logo
        };
        localStorage.setItem('qrGeneratorSettings', JSON.stringify(settings));
        showToast('Settings saved automatically.', 'success');
    } catch (error) {
        console.error('Error saving settings:', error);
        showToast('Error saving settings.', 'error');
    }
}

// ===================================
// Theme Management
// ===================================

function applyTheme() {
    const theme = state.theme || detectPreferredTheme();
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
}

function detectPreferredTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme();
    saveSettings();
    showToast(state.theme === 'dark' ? 'Dark Mode Activated' : 'Light Mode Activated', 'success');
}

// ===================================
// RTL/LTR Management
// ===================================

function applyDirection() {
    document.documentElement.setAttribute('dir', state.direction);
    updateTranslations();
}

function toggleDirection() {
    state.direction = state.direction === 'ltr' ? 'rtl' : 'ltr';
    applyDirection();
    saveSettings();
    showToast(state.direction === 'rtl' ? 'تم التبديل إلى العربية (RTL)' : 'Switched to English (LTR)', 'success');
}

function updateTranslations() {
    const lang = state.direction === 'rtl' ? 'ar' : 'en';
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            // Check if it's a general text element
            if (element.tagName === 'SPAN' || element.tagName === 'BUTTON' || element.tagName === 'P') {
                element.textContent = text;
            } 
            // Handle titles and labels while preserving internal SVG icons
            else if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'LABEL') {
                 const svg = element.querySelector('svg');
                 element.textContent = text;
                 if (svg) {
                    element.prepend(svg); // Prepend icon back if it exists
                 }
            }
        }
    });
}

// ===================================
// Content Type Management
// ===================================

function updateInputFields() {
    // Hide all input fields
    elements.urlInput.classList.add('hidden');
    elements.textInput.classList.add('hidden');
    elements.emailInput.classList.add('hidden');
    elements.phoneInput.classList.add('hidden');
    elements.vcardInput.classList.add('hidden');
    
    // Show relevant input field
    switch(state.contentType) {
        case 'url':
            elements.urlInput.classList.remove('hidden');
            break;
        case 'text':
            elements.textInput.classList.remove('hidden');
            break;
        case 'email':
            elements.emailInput.classList.remove('hidden');
            break;
        case 'phone':
            elements.phoneInput.classList.remove('hidden');
            break;
        case 'vcard':
            elements.vcardInput.classList.remove('hidden');
            break;
    }
    // Re-generate QR code when type changes
    generateQRCode();
}

function getContent() {
    let content = '';
    
    switch(state.contentType) {
        case 'url':
            content = elements.urlValue.value.trim();
            if (state.addUtm && content) {
                content = addUtmParameters(content);
            }
            break;
        case 'text':
            content = elements.textValue.value.trim();
            break;
        case 'email':
            const email = elements.emailValue.value.trim();
            const subject = elements.emailSubject.value.trim();
            if (email) {
                 content = `mailto:${email}${subject ? '?subject=' + encodeURIComponent(subject) : ''}`;
            } else {
                return ''; // Return empty string if email field is empty
            }
            break;
        case 'phone':
            content = `tel:${elements.phoneValue.value.trim()}`;
            if (elements.phoneValue.value.trim() === '') return ''; // Return empty string if phone is empty
            break;
        case 'vcard':
            content = generateVCard();
            break;
    }
    
    return content;
}

function addUtmParameters(url) {
    try {
        const urlObj = new URL(url);
        urlObj.searchParams.set('utm_source', 'qr_code');
        urlObj.searchParams.set('utm_medium', 'qr');
        urlObj.searchParams.set('utm_campaign', 'qr_generator');
        return urlObj.toString();
    } catch (error) {
        // If URL is invalid (e.g., just 'www.example.com' without http://), return original string
        return url; 
    }
}

function generateVCard() {
    const name = elements.vcardName.value.trim();
    const phone = elements.vcardPhone.value.trim();
    const email = elements.vcardEmail.value.trim();
    const org = elements.vcardOrg.value.trim();
    
    // Require at least one field for vCard generation
    if (!name && !phone && !email && !org) {
        return '';
    }

    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n';
    if (name) vcard += `FN:${name}\n`;
    if (phone) vcard += `TEL:${phone}\n`;
    if (email) vcard += `EMAIL:${email}\n`;
    if (org) vcard += `ORG:${org}\n`;
    vcard += 'END:VCARD';
    
    return vcard;
}

// ===================================
// QR Code Generation
// ===================================

async function generateQRCode() {
    const content = getContent();
    
    // Clear previous canvas
    const canvas = elements.qrCanvas;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing

    if (!content) {
        // If content is legitimately empty (after trimming/validation)
        if (elements.qrCanvas.classList.contains('generated')) {
             showToast(state.direction === 'rtl' ? 'الرجاء إدخال محتوى صالح لإنشاء الرمز' : 'Please enter valid content to generate QR code', 'error');
             elements.qrCanvas.classList.remove('generated');
        }
        return;
    }
    
    elements.qrCanvas.classList.add('generated');

    try {
        
        // QR Code Generation Options
        const options = {
            errorCorrectionLevel: 'H',
            type: 'image/png', // This refers to the output format, not drawing type
            quality: 1,
            margin: state.padding,
            width: state.size,
            color: {
                dark: state.fgColor,
                light: state.bgColor
            }
        };
        
        // Generate to canvas using qrcode.js
        await QRCode.toCanvas(canvas, content, options);
        
        // Add logo if present
        if (state.logo) {
            await addLogoToCanvas();
        }
        
        // Apply animation class
        if (state.animate) {
            canvas.classList.add('animated');
        } else {
            canvas.classList.remove('animated');
        }
        
        // Save current state
        state.content = content;
        saveSettings();
        
    } catch (error) {
        console.error('Error generating QR code:', error);
        showToast(state.direction === 'rtl' ? 'خطأ في إنشاء رمز QR. حاول إدخال رابط أقصر.' : 'Error generating QR code. Try entering shorter content.', 'error');
    }
}

async function addLogoToCanvas() {
    return new Promise((resolve, reject) => {
        const canvas = elements.qrCanvas;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.crossOrigin = "anonymous"; // Needed if logo comes from an external source (though here it's DataURL)
        
        img.onload = () => {
            const logoSize = canvas.width * 0.2; // 20% of QR code size
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;
            
            // Draw background circle/square for logo (Optional: helps readability)
            const padding = 10;
            ctx.fillStyle = state.bgColor;
            ctx.fillRect(x - padding, y - padding, logoSize + 2 * padding, logoSize + 2 * padding);
            
            // Draw logo
            ctx.drawImage(img, x, y, logoSize, logoSize);
            resolve();
        };
        
        img.onerror = () => {
            showToast(state.direction === 'rtl' ? 'فشل تحميل الشعار.' : 'Failed to load logo.', 'error');
            reject();
        };
        img.src = state.logo;
    });
}

// ===================================
// Logo Upload
// ===================================

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
        showToast('Please upload an image file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        state.logo = e.target.result;
        generateQRCode();
        showToast(state.direction === 'rtl' ? 'تم إضافة الشعار بنجاح' : 'Logo added successfully', 'success');
    };
    reader.readAsDataURL(file);
}

function clearLogo() {
    state.logo = null;
    elements.logoUpload.value = '';
    generateQRCode();
    showToast(state.direction === 'rtl' ? 'تمت إزالة الشعار' : 'Logo removed', 'success');
}

// ===================================
// Download Functions
// ===================================

function downloadPNG() {
    try {
        const canvas = elements.qrCanvas;
        
        if (!canvas.classList.contains('generated')) {
            showToast(state.direction === 'rtl' ? 'قم بإنشاء الرمز أولاً للتحميل.' : 'Generate the QR code first to download.', 'error');
            return;
        }

        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `qrcode-${Date.now()}.png`;
        link.href = url;
        link.click();
        showToast(state.direction === 'rtl' ? 'تم تنزيل رمز PNG' : 'QR Code downloaded as PNG', 'success');
    } catch (error) {
        console.error('Error downloading PNG:', error);
        showToast(state.direction === 'rtl' ? 'فشل تنزيل PNG' : 'Error downloading PNG', 'error');
    }
}

function downloadSVG() {
    try {
        const content = getContent();
        if (!content) {
            showToast(state.direction === 'rtl' ? 'لا يوجد محتوى لإنشاء SVG' : 'No content to generate SVG', 'error');
            return;
        }

        // Generate SVG using QRCode library's toString method
        QRCode.toString(content, {
            type: 'svg',
            errorCorrectionLevel: 'H',
            margin: state.padding,
            width: state.size,
            color: {
                dark: state.fgColor,
                light: state.bgColor
            }
        }, (err, svg) => {
            if (err) {
                console.error('SVG Generation Error:', err);
                showToast(state.direction === 'rtl' ? 'فشل توليد SVG' : 'SVG generation failed', 'error');
                return;
            }
            
            // Note: Logo is not included in the SVG output from this library
            
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `qrcode-${Date.now()}.svg`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            showToast(state.direction === 'rtl' ? 'تم تنزيل رمز SVG' : 'QR Code downloaded as SVG', 'success');
        });
    } catch (error) {
        console.error('Error downloading SVG:', error);
        showToast(state.direction === 'rtl' ? 'فشل تنزيل SVG' : 'Error downloading SVG', 'error');
    }
}

async function copyToClipboard() {
    try {
        const canvas = elements.qrCanvas;
        
        if (!canvas.classList.contains('generated')) {
            showToast(state.direction === 'rtl' ? 'قم بإنشاء الرمز أولاً.' : 'Generate the QR code first.', 'error');
            return;
        }
        
        // Fallback for environments where Clipboard API for images is restricted
        if (!navigator.clipboard.write) {
            // Attempt to copy content text/link as a secondary fallback (most reliable)
            const qrData = getContent();
            const tempInput = document.createElement('textarea');
            tempInput.value = qrData;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showToast(state.direction === 'rtl' ? 'تم نسخ النص/الرابط (صورة غير مدعومة)' : 'Text/Link copied (image not supported)', 'warning');
            return;
        }


        canvas.toBlob(async (blob) => {
            try {
                // Using modern clipboard API for image copy (requires secure context)
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                showToast(state.direction === 'rtl' ? 'تم نسخ الصورة إلى الحافظة' : 'QR Code copied to clipboard', 'success');
            } catch (error) {
                // Fallback catch if write fails despite the check
                console.error('Clipboard write failed, attempting text fallback.', error);
                showToast(state.direction === 'rtl' ? 'النسخ فشل (نقل إلى نص)' : 'Copy failed (reverted to text)', 'error');
            }
        }, 'image/png');
    } catch (error) {
        console.error('Error during copy process:', error);
        showToast(state.direction === 'rtl' ? 'خطأ في عملية النسخ' : 'Error during copy process', 'error');
    }
}

function printQRCode() {
    try {
        const canvas = elements.qrCanvas;
        
        if (!canvas.classList.contains('generated')) {
            showToast(state.direction === 'rtl' ? 'قم بإنشاء الرمز أولاً للطباعة.' : 'Generate the QR code first to print.', 'error');
            return;
        }
        
        const dataUrl = canvas.toDataURL('image/png');
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${state.direction === 'rtl' ? 'طباعة رمز QR' : 'Print QR Code'}</title>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        margin: 0;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        box-shadow: none; /* Remove shadow on print */
                    }
                </style>
            </head>
            <body>
                <img src="${dataUrl}" alt="QR Code">
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
        
        showToast(state.direction === 'rtl' ? 'جارٍ فتح نافذة الطباعة' : 'Opening print dialog', 'success');
    } catch (error) {
        console.error('Error printing:', error);
        showToast(state.direction === 'rtl' ? 'خطأ في الطباعة' : 'Error printing QR code', 'error');
    }
}

// ===================================
// Toast Notifications
// ===================================

function showToast(message, type = 'success') {
    const toast = elements.toast;
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===================================
// Utility Functions
// ===================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// Event Listeners
// ===================================

function attachEventListeners() {
    // Content Type
    elements.contentType.addEventListener('change', (e) => {
        state.contentType = e.target.value;
        updateInputFields();
    });
    
    // Content Inputs (using debounce for performance)
    const contentInputs = [
        elements.urlValue, elements.textValue, elements.emailValue, 
        elements.emailSubject, elements.phoneValue, elements.vcardName, 
        elements.vcardPhone, elements.vcardEmail, elements.vcardOrg
    ];
    contentInputs.forEach(input => {
        input.addEventListener('input', debounce(generateQRCode, 500));
    });
    
    // UTM Checkbox
    elements.addUtm.addEventListener('change', generateQRCode);
    
    // Customization Inputs
    elements.fgColor.addEventListener('input', generateQRCode);
    elements.bgColor.addEventListener('input', generateQRCode);
    
    elements.qrSize.addEventListener('input', (e) => {
        state.size = parseInt(e.target.value);
        elements.qrSizeValue.textContent = `${state.size}px`;
        generateQRCode();
    });
    
    elements.qrPadding.addEventListener('input', (e) => {
        state.padding = parseInt(e.target.value);
        elements.qrPaddingValue.textContent = state.padding;
        generateQRCode();
    });
    
    elements.cornerStyle.forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.cornerStyle = e.target.value;
            generateQRCode();
        });
    });
    
    elements.logoUpload.addEventListener('change', handleLogoUpload);
    elements.clearLogo.addEventListener('click', clearLogo);
    
    elements.animateQr.addEventListener('change', (e) => {
        state.animate = e.target.checked;
        if (state.animate) {
            elements.qrCanvas.classList.add('animated');
        } else {
            elements.qrCanvas.classList.remove('animated');
        }
        saveSettings();
    });
    
    // Actions
    elements.downloadPng.addEventListener('click', downloadPNG);
    elements.downloadSvg.addEventListener('click', downloadSVG);
    elements.copyBtn.addEventListener('click', copyToClipboard);
    elements.printBtn.addEventListener('click', printQRCode);
    
    // Theme & RTL
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.rtlToggle.addEventListener('click', toggleDirection);
    
    // Initial display of slider values
    elements.qrSizeValue.textContent = `${state.size}px`;
    elements.qrPaddingValue.textContent = state.padding;
}

// ===================================
// Initialize Application
// ===================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a theme yet (i.e., settings haven't been saved)
        if (!localStorage.getItem('qrGeneratorSettings')) {
            state.theme = e.matches ? 'dark' : 'light';
            applyTheme();
        }
    });
}
