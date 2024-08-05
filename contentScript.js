(function() {
    function loadKeywords() {
        return fetch(chrome.runtime.getURL('keywords.json'))
            .then(response => response.json());
    }

    function findJoJoReferences(keywords) {
        const bodyText = document.body.innerText.toLowerCase();
        const references = new Map();

        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
            const matches = bodyText.match(regex);
            if (matches) {
                references.set(keyword, matches.length);
            }
        });
        return Array.from(references.entries())
            .sort((a, b) => b[1] - a[1])
            .map(entry => ({ word: entry[0], count: entry[1] }));
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "findJoJoReferences") {
            loadKeywords().then(keywords => {
                foundReferences = findJoJoReferences(keywords);
                sendResponse({references: foundReferences});
            });
            return true;
        }
    });
})();