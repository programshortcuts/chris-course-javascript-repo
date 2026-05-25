addEventListener('keydown', e => {
    // Normalize key
    let letter = '';
    if (/^Key[A-Z]$/.test(e.code)) {
        letter = e.code.replace('Key', '').toLowerCase();
    } else if (/^Digit[0-9]$/.test(e.code)) {
        letter = e.code.replace('Digit', '');
    } else {
        return;
    }

    const allEls = [...document.querySelectorAll('a, [id]')].filter(el => {
        const rect = el.getBoundingClientRect();
        return el.offsetParent != null && rect.width > 0 && rect.height > 0;
    });

    if(letter == 'm' || letter == 't'){
        scrollTo(0,0)
    }
    function getCleanText(el) {
        // Clone the element without <sup> tags
        const clone = el.cloneNode(true);
        
        clone.querySelectorAll('sup').forEach(node => node.remove());
        return clone.textContent.trim().toLowerCase();
    }

    const letteredEls = allEls.filter(el => {
        const text = getCleanText(el)
        const word = text.split(/s+|[-()]/)
        
        return word.some(el => {
            const cleaned = el.replace(/^[^a-z0-9]+/i,' ')

            if(!cleaned)return
            if(isNaN(letter)){
                const firstletter = cleaned.match(/[a-z]/i)?.[0]
                return firstletter == letter
            }else{
                const firstDigit = cleaned.match(/[1-9]/)?.[0]
                return firstDigit == letter
            }
            // return el
        })

        
    });
    letteredEls.forEach(el => console.log(el))
    // ///////
    // ????????????????????????????????????????????????????????????????????

    if (letteredEls.length === 0) return;

    const activeEl = document.activeElement;
    const iActive = allEls.indexOf(activeEl);
    const iCurrent = letteredEls.indexOf(activeEl);

    const keySignature = `${e.shiftKey ? 'shift+' : ''}${letter}`;
    let iNext;
    if (keySignature !== window.lastKeySignature) {
        if (e.shiftKey) {
            const prev = [...letteredEls].reverse().find(el => allEls.indexOf(el) < iActive);
            iNext = letteredEls.indexOf(prev);
            if (iNext === -1) iNext = letteredEls.length - 1;
        } else {
            const next = letteredEls.find(el => allEls.indexOf(el) > iActive);
            iNext = letteredEls.indexOf(next);
            if (iNext === -1) iNext = 0;
        }
    } else {
        iNext = e.shiftKey
            ? (iCurrent - 1 + letteredEls.length) % letteredEls.length
            : (iCurrent + 1) % letteredEls.length;
    }

    letteredEls[iNext]?.focus();
    window.lastKeySignature = keySignature;
});
