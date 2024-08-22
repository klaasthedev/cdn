(function(window) {
    // Voeg extra dynamische gegevens toe of voer aanvullende logica uit
    var additionalData = {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        screenResolution: window.screen.width + "x" + window.screen.height
    };

    // Voeg deze gegevens toe aan een globaal object of werk de payload bij
    if (window.TrackingData) {
        window.TrackingData = {
            ...window.TrackingData,
            ...additionalData
        };
    } else {
        window.TrackingData = additionalData;
    }

    // Optioneel: je kunt ook directe acties uitvoeren, zoals nog een verzoek sturen
    function sendAdditionalData() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://configsecure.vercel.app/api/test", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log("Additional data sent:", xhr.status, xhr.responseText);
            }
        };

        xhr.send(JSON.stringify(window.TrackingData));
    }

    // Verzend extra gegevens direct na het laden van het script
    sendAdditionalData();

})(window);
