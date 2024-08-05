document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('findReferences').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const activeTab = tabs[0]

            if (activeTab.url.startsWith('chrome://')) {
                document.getElementById('results').innerHTML =
                    '<p>Yare yare... JoJo references cannot be found on chrome:// pages.</p>';
                return;
            }
            chrome.scripting.executeScript({
                target: {tabId: activeTab.id},
                files: ['contentScript.js']
            }, function() {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    document.getElementById('results').innerHTML =
                        '<p>Yare yare... Error: ' + chrome.runtime.lastError.message + '</p>';
                    return;
                }
                chrome.tabs.sendMessage(tabs[0].id, {action: 'findJoJoReferences'}, function(response) {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                        document.getElementById('results').innerHTML =
                            '<p>Yare yare... Error: ' + chrome.runtime.lastError.message + '</p>';
                        return;
                    }
                    if (response && response.references) {
                        const resultsDiv = document.getElementById('results');
                        if (response.references.length > 0) {
                            resultsDiv.innerHTML = '<h3>Nice! JoJo References Found:</h3><ul>' +
                                response.references.map(ref => `<li>${ref.word} (${ref.count})</li>`).join('') +
                                '</ul>';
                        } else {
                            resultsDiv.innerHTML = '<p>Yare yare... No JoJo references found on this page.</p>';
                        }
                    }
                });
            })
        });
    });
});