var index = {};

index.init = function () {
    index.bindEvent();
};

index.bindEvent = function () {
    // $("#get_btn").on('click',function () {
    //     window.location.href = '/apply-card?spinfocode='+spinfocode;
    // });

    $("#get_btn").on('click', function () {
        // window.location.href = '/apply-card?spinfocode='+spinfocode;
        $('.main').addClass('mainhide')
        $('.main').addClass('delay4')
        $('.page2').css({ 'transform': 'translate3d(0,0,0)' });
        $.get('/apply-card?spinfocode=' + spinfocode, function (result) {
            console.log("ok");
        });
    });
    $('#backIndex').on('click', function () {
        $('.main').removeClass('mainhide')
        $('.main').removeClass('delay4')
        $('.page2').css({ 'transform': 'translate3d(100%,0,0)' });
    });
    $('#fix_get').on('click', function () {
        $('.main').addClass('mainhide')
        $('.main').addClass('delay4')
        $('.page2').css({ 'transform': 'translate3d(0,0,0)' });
        $.get('/apply-card?spinfocode=' + spinfocode, function (result) {
            console.log("ok");
        });
    })
};

$(function () {
    index.init();
});