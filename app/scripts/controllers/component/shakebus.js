'use strict';

angular.module('nodejsAngularApp')
    .controller('ShakebusCtrl', function ($scope, $location, $stateParams, $http) {
        document.title = "惊喜摇一摇";
        var auuid = $stateParams.activity_uuid;
        alert(auuid);

            /*--读取logo--*/
            $http.get('/customer/v1/banners?activity_uuid=' + auuid)
                .success(function (data) {
                    var blocks = $("#adv-block li");
                    for (var i = 0; i < data.banners.length; i++) {
                        var n = i < 4 ? i : i + 1;
                        $(blocks[n]).find('img').attr({'src': data.banners[i].image_url, 'tag': data.banners[i].id})
                            .closest("a").attr('href', data.banners[i].link);
                    }
                })
                .error(function (data) {

                });

            /*--点击按钮--*/
            $("#adv-box.on #adv-shade").bind('click', function () {
                alert("点击按钮");
                $("#adv-box").removeClass('on');
                rollImg();
                doBigdraw();

            });

                /*--摇动效果--*/
                if (window.DeviceMotionEvent) {
                    window.addEventListener('devicemotion', deviceMotionHandler, false);
                }
                var SHAKE_THRESHOLD = 800;
                var last_update = 0;
                var x, y, z, last_x, last_y, last_z;

                function deviceMotionHandler(eventData) {

                    var acceleration = eventData.accelerationIncludingGravity;
                    //alert(newDate().getTime());
                    var curTime = new Date().getTime();

                    // alert(curTime - last_update);
                    if ((curTime - last_update) > 300) {

                        var diffTime = curTime - last_update;
                        last_update = curTime;

                        x = acceleration.x;
                        y = acceleration.y;
                        z = acceleration.z;

                        var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
                        //speed > SHAKE_THRESHOLD && $("#adv-box.on").length > 0
                        if (speed > SHAKE_THRESHOLD && $("#adv-box.on").length > 0) {
                            $("#adv-box").removeClass('on');
                            rollImg();
                            doBigdraw();
                        }
                        last_x = x;
                        last_y = y;
                        last_z = z;
                    }
                }

            var roll;
            var tag = 0;

        function doBigdraw(){
            $http.post('/customer/v1/banners/draw', {activity_uuid: auuid})
                .success(function (data) {
                    if (data.result == 0) {
                        finishRoll(data.choice.id, data);
                    } else {
                        alert("系统异常,请再次尝试");
                        stopRoll();
                        $("#adv-box").addClass('on');
                    }
                })
                .error(function (data) {
                    alert("网络异常,请再次尝试");
                    stopRoll();
                    $("#adv-box").addClass('on');
                });
        }

            function rollImg() {
                if (roll != 1) {
                    changePic();
                    roll = setInterval(function () {
                        changePic();
                    }, 200);
                }
            }

            function finishRoll(num, data) {
                clearInterval(roll);
                roll = setInterval(function () {
                    changePicTurn(num, data);
                }, 500);

            }

            function stopRoll() {
                $('#adv-block li').removeClass("on");
                clearInterval(roll);
            }

            function changePicTurn(num, data) {
                var onli = $('#adv-block li.on');
                var index = $('#adv-block li.on').prevAll("li").length;
                onli.removeClass("on");
                switchRoll(index);
                tag = tag + 1;
                if (tag > 16) {
                    clearInterval(roll);
                    roll = setInterval(function () {
                        changePic(num, data);
                    }, 800);
                    tag = 0;
                }
            }

            function changePic(num, data) {
                var onli = $('#adv-block li.on');
                if (num >= 0) {
                    var index = $('#adv-block li.on').prevAll("li").length;
                    var t = $("#adv-block li a img[tag='" + num + "']").closest("li").prevAll().length;
                    if (t == index) {
                        clearInterval(roll);

                        $("#adv-shade a").attr('href', data.choice.link)
                            .find('img').attr('src', data.choice.image_url);
                    } else {
                        onli.removeClass("on");
                        switchRoll(index);
                    }
                } else {
                    if (onli.length == 0) {
                        $('#adv-block li:first').addClass("on");
                    } else {
                        var index = $('#adv-block li.on').prevAll("li").length;
                        onli.removeClass("on");
                        switchRoll(index);
                    }
                }
            }

            function switchRoll(index) {
                var li = $('#adv-block li');
                switch (index) {
                    case 0:
                        $(li[1]).addClass("on");
                        break;
                    case 1:
                        $(li[2]).addClass("on");
                        break;
                    case 2:
                        $(li[5]).addClass("on");
                        break;
                    case 3:
                        $(li[0]).addClass("on");
                        break;
                    case 5:
                        $(li[8]).addClass("on");
                        break;
                    case 6:
                        $(li[3]).addClass("on");
                        break;
                    case 7:
                        $(li[6]).addClass("on");
                        break;
                    case 8:
                        $(li[7]).addClass("on");
                        break;
                }
            }


        });