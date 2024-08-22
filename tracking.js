(function() {
    var payload = {
        data: "Test Data"
    };

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://configsecure.vercel.app/api/test", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log("Response status:", xhr.status);
            console.log("Response body:", xhr.responseText);
        }
    };

    xhr.send(JSON.stringify(payload));
})();
