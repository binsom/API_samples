window.onload = function () {
    // Initialize the API and specify the backend service URL
    // Modelo.initialize("https://build-portal.modeloapp.com");
    // devAPI
    Modelo.init({"endpoint": "https://build-portal.modeloapp.com"});
    var appToken = 'VHlsaW4sbW9kZWxvQkk1NjA='; // A sample app token
    Modelo.Auth.signIn(
        appToken,
        function () {
            var btn1 = document.getElementById("compare-model1");
            var btn2 = document.getElementById("compare-model2");
            var messageDiv = document.getElementById("message");

            var modelId1 = "93rjkK14";
            var modelId2 = "DQ8P6P1k";
            var modelId3 = "Wr99BAr7"
            btn1.onclick = function () {
                Modelo.Model.compare(modelId1, modelId2, function(data) {
                    messageDiv.innerHTML = JSON.stringify(data);
                    console.log(data);
                }, function(err) {
                    console.log(err);
                });
                messageDiv.innerHTML = "comparing...";
            }
            btn2.onclick = function () {
                Modelo.Model.compare(modelId1, modelId3, function(data) {
                    messageDiv.innerHTML = JSON.stringify(data);
                    console.log(data);
                }, function(err) {
                    console.log(err);
                });
                messageDiv.innerHTML = "comparing...";
            }
        },
        function (errMsg) {
            console.log('signInErr: ' + errMsg);
        }
    );
}
