var uv = {};

uv.init = function () {
    uv.bindEvent();
    uv.rendersuccess();
};

uv.bindEvent = function () {
 
};

uv.rendersuccess = function () { 
    console.log(spinfocode);
    $.get('/uv/success?spinfocode='+spinfocode, function (result) { 
        console.log("ok");
    })
}

$(function () {
    uv.init();
});