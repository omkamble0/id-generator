const gridSection = document.getElementById('grid-section');
const workspaceSection = document.getElementById('workspace-section');
const editorSection = document.getElementById('editor-section');
const titleBlock = document.querySelector('.title-block');
const formContainer = document.getElementById('dynamic-editor-form');
const cardContainer = document.getElementById('template-container');

// Navigation
document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const templateName = e.currentTarget.getAttribute('data-template');
        gridSection.style.display = 'none';
        titleBlock.style.display = 'none';
        workspaceSection.style.display = 'flex';
        editorSection.style.display = 'flex';
        loadTemplate(templateName);
    });
});

function showGrid() {
    workspaceSection.style.display = 'none';
    editorSection.style.display = 'none';
    gridSection.style.display = 'grid';
    titleBlock.style.display = 'flex';
}

// Fetch and Split Logic
async function loadTemplate(templateName) {
    try {
        const response = await fetch(`templates/${templateName}.html`);
        if (!response.ok) throw new Error("Template not found");
        
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        const formHTML = doc.querySelector('.template-specific-form').innerHTML;
        const cardHTML = doc.querySelector('.template-specific-card').innerHTML;
        
        formContainer.innerHTML = formHTML;
        cardContainer.innerHTML = cardHTML;
        
        bindDynamicInputs();
        bindPhotoUpload();
        
    } catch (error) {
        console.error("Fetch Error:", error);
        cardContainer.innerHTML = `<h3 style="color:red; background:white; padding:20px;">Error Loading Template via Live Server.</h3>`;
    }
}

// Universal Sync System
function bindDynamicInputs() {
    const inputs = document.querySelectorAll('#dynamic-editor-form input[data-sync]');
    
    inputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const syncKey = e.target.getAttribute('data-sync');
            const targetElements = document.querySelectorAll(`.sync-${syncKey}`);
            
            targetElements.forEach(target => {
                let val = e.target.value;
                if (target.classList.contains('format-upper')) val = val.toUpperCase();
                if (target.classList.contains('format-title')) val = val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
                target.innerText = val;
            });
        });
        input.dispatchEvent(new Event('input'));
    });
}

function bindPhotoUpload() {
    const photoInput = document.getElementById('dynamic-photo-upload');
    if (photoInput) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const photoEls = document.querySelectorAll('.sync-photo');
                    photoEls.forEach(el => el.src = event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Global Color Customizer for Tyler Template
function changeTylerColor(hex) {
    const frontBg = document.getElementById('tyler-front-bg');
    const backBg = document.getElementById('tyler-back-bg');
    if (frontBg) frontBg.style.backgroundColor = hex;
    if (backBg) backBg.style.backgroundColor = hex;
}

// 3D Flip & Export Utilities
function toggleFlip() {
    const card = document.getElementById('card-inner');
    if (card) card.classList.toggle('is-flipped');
}

function downloadID() {
    const cardInner = document.getElementById('card-inner');
    if (!cardInner) return;
    const isFlipped = cardInner.classList.contains('is-flipped');
    const targetElement = isFlipped ? cardInner.querySelector('.card-back') : cardInner.querySelector('.card-front');
    
    html2canvas(targetElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Custom_ID_${isFlipped ? 'Back' : 'Front'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}
// --- BIKINI BOTTOM MASTER DATA ENGINE ---

const bikiniBottomPresets = {
    spongebob: { name: "SPONGEBOB SQUAREPANTS", address: "124 CONCH ST.", city: "BIKINI BOTTOM", lic: "A1356021", class: "S", exp: "12-14-03", dob: "07-14-86", sex: "M", hair: "YELLOW", eyes: "BLUE", ht: "0-04", wt: "1oz" },
    patrick_driver: { name: "Patrick Star", address: "120 Conch St.", city: "Bikini Bottom", lic: "A1376047", class: "S", exp: "12-14-03", dob: "", sex: "M", hair: "PINK", eyes: "BLACK", ht: "0.06", wt: "2 oz" },
    patrick_fake: { name: "PA TRiCK STAR", address: "120 Conch St. Bikini Bottom", city: "", lic: "A1359723", class: "", exp: "12-14-03", dob: "N/A", sex: "M", hair: "PINK", eyes: "BLACK", ht: "0.06", wt: "2 oz" },
    sandy: { name: "SANDRA CHEEKS", address: "126 CONCH STREET", city: "BIKINI BOTTOM", lic: "A4832951", class: "S", exp: "4-12-04", dob: "11-17-87", sex: "F", hair: "BROWN", eyes: "BLK", ht: "0-05", wt: "9oz" },
    squidward: { name: "Squidward Tentacles.", address: "124 CONCH ST", city: "BIKINI BOTTOM", lic: "A1376047", class: "S", exp: "10-09-02", dob: "", sex: "M", hair: "YELLOW", eyes: "RED", ht: "0.64", wt: "1oz" },
    krabs: { name: "MR. KRABS, EUGENE", address: "3541 ANCHOR WAY", city: "BIKINI BOTTOM", lic: "A5265661", class: "S", exp: "11-30-02", dob: "11-30-42", sex: "M", hair: "N/A", eyes: "GRN", ht: "0-07", wt: "5oz" },
    whatzit: { name: "MR.WHAT ZIT TOOYA", address: "150 SHELL St.", city: "Bikini Bottom", lic: "A6013747", class: "S", exp: "", dob: "", sex: "M", hair: "N/A", eyes: "BLACK", ht: "0.07", wt: "5oz" },
    credit1: { name: "SPONGEBOB SQUAREPANTS", address: "LITTLE SHOPPER", city: "", lic: "7890 6543 2101 2345", class: "", exp: "12/25", dob: "", sex: "", hair: "", eyes: "", ht: "", wt: "" },
    credit2: { name: "SPONGEBOB SQUAREPANTS", address: "LITTLE SHOPPER", city: "", lic: "9876 5432 1012 3456", class: "", exp: "12/25", dob: "", sex: "", hair: "", eyes: "", ht: "", wt: "" }
};

window.switchSpongeBobVariant = function(type) {
    const cardWrapper = document.getElementById('bb-card-wrapper');
    const viewLicense = document.getElementById('view-license');
    const viewCredit = document.getElementById('view-credit');
    
    const backTitle = document.getElementById('sb-back-title');
    const backDesc = document.getElementById('sb-back-desc');
    const backSupport = document.getElementById('sb-back-support');
    const backDept = document.getElementById('sb-back-dept');
    const ccBankName = document.getElementById('cc-bank-name');

    if (!cardWrapper) return;

    // 1. APPLY CSS THEME
    cardWrapper.className = `theme-${type}`;

    // 2. TOGGLE VIEWS
    if (type === 'credit1' || type === 'credit2') {
        viewLicense.style.display = 'none';
        viewCredit.style.display = 'flex';
        
        if(type === 'credit1') {
            ccBankName.innerText = "PINEAPPLE BANK";
            backSupport.innerText = "CUSTOMER SERVICE: 1-800-CALL-DAD";
        } else {
            ccBankName.innerText = "BIKINI BOTTOM BANK";
            backSupport.innerText = "CUSTOMER SERVICE: 1-800-CALL-MOM";
        }
        backTitle.innerText = "PARENTAL FINANCIAL COMPANY";
        backDesc.innerText = "This card is the property of the bank. Credit is issued based on good behavior. Cardholder agrees to return card on demand.";
        backDept.innerText = "MEMBERSHIP DEPT.";
    } 
    else {
        viewLicense.style.display = 'flex';
        viewCredit.style.display = 'none';
        
        if (type === 'patrick_fake') {
            backTitle.innerText = "ROCK UNDER WHICH PATRICK LIVES";
            backDesc.innerText = "This card proves nothing except that the holder is certified under a rock. No driving privileges authorized whatsoever.";
        } else {
            backTitle.innerText = "BOATING SCHOOL OF BIKINI BOTTOM";
            backDesc.innerText = "This license is issued by Mrs. Puff's Boating School. Holder is permitted to crash boats into stationary objects indefinitely.";
        }
        backSupport.innerText = "CUSTOMER SERVICE: 1-800-MRS-PUFF";
        backDept.innerText = "BIKINI BOTTOM DEPT.";
    }

    // 3. AUTO-FILL DATA
    const data = bikiniBottomPresets[type];
    if (data) {
        const setInput = (key, value) => {
            const input = document.querySelector(`input[data-sync="sb-${key}"]`);
            if (input) {
                input.value = value;
                input.dispatchEvent(new Event('input')); 
            }
        };

        ['name', 'address', 'city', 'lic', 'class', 'exp', 'dob', 'sex', 'hair', 'eyes', 'ht', 'wt'].forEach(k => {
            setInput(k, data[k] || "");
        });
    }
}