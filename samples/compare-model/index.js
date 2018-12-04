window.onload = function () {
    // Initialize the API and specify the backend service URL
    // Modelo.initialize("https://build-portal.modeloapp.com");
    // devAPI
    Modelo.init({"endpoint": "https://build-portal.modeloapp.com"});
    var appToken = 'VHlsaW4sbW9kZWxvQkk1NjA='; // A sample app token
    Modelo.Auth.signIn(
        appToken,
        function () {
            var btn = document.getElementById("compare-model");
            btn.onclick = function () {
                var modelId1 = "XyYG2D1e";
                var modelId2 = "XyYG2D1e";
                Modelo.Model.compare(modelId1, modelId2);
            }
        },
        function (errMsg) {
            console.log('signInErr: ' + errMsg);
        },
    );
}
