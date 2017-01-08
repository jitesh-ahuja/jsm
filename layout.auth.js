var AuthLayout = function () {

    return {

        init: function () {
            $('.login-bg').backstretch([
                "/assets/pages/img/login/bg1.jpg",
                "/assets/pages/img/login/bg2.jpg",
                "/assets/pages/img/login/bg3.jpg"
            ], {
                fade: 1000,
                duration: 8000
            });
        }

    };

}();

$(function () {
    AuthLayout.init();
});