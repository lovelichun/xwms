$(function () {
    var userId = Util.cookieStorage.getCookie("userId") === "" || isNaN(Util.cookieStorage.getCookie("userId")) || Util.cookieStorage.getCookie("userId") === "undefined" ? 1 : Util.cookieStorage.getCookie("userId");
    var userName = Util.cookieStorage.getCookie("userName") === "" || Util.cookieStorage.getCookie("userName") === "undefined" ? "anonymous" : Util.cookieStorage.getCookie("userName")

    var url=location.search;
    var Request = new Object();
    if(url.indexOf("?")!=-1) {
        var str = url.substr(1)　//去掉?号
        strs = str.split("&");
        for(var i=0;i<strs.length;i++){
            Request[strs[i ].split("=")[0]]=unescape(strs[ i].split("=")[1]);
        }
    };

    var action = {
        //新增数据
        add : function() {
            var ele_list = $('.complain-wrap .list span')
            var selected_txt_arr = []
            for (var i=0; i<ele_list.length; i++) {
                if(ele_list.eq(i).hasClass('selected')){
                    selected_txt_arr.push(ele_list.eq(i).html())
                }
            }
            var selected_txt_str = ''
            if(selected_txt_arr.length > 0) {
                selected_txt_str = selected_txt_arr.join('#') + '#'
            }

            //获取图片url
            var imgEle = $('#file_list').find('img');
            var imgUrlArr = [];
            var imgUrl = '';
            if (imgEle.length > 0) {
                for (var i = 0; i<imgEle.length; i++) {
                    imgUrlArr.push(imgEle[i].src)
                }
                imgUrl = imgUrlArr.join(',')
            }

            if($('input[name=contactInfo]').val() === '' || $('textarea[name=cont]').val() === '') {
                toastr.error("请填写联系方式和反馈内容!");
            } else if ($('textarea[name=cont]').val().length < 10) {
                toastr.error("描述内容少于10个字");
            } else if ($('textarea[name=cont]').val().length > 200) {
                toastr.error("描述内容已超过了字数限制");
            } else {
                var url = ctx + "boss/suggest/add";
                var data = {
                    "userId": parseInt(userId),
                    "uname": userName,
                    "title": $('input[name=title]').val(),
                    "type": document.querySelector('.js-switch').checked === true ? 0 : 1, //0-公开 1-私有
                    "content": '#' + selected_txt_str + $('textarea[name=cont]').val() + '#',
                    "contact": $('input[name=contactInfo]').val(),
                    "pictures": imgUrl
                };
                Util.ajaxLoadData(url,data,"POST",true,function(result) {
                    if (result.code == ReturnCode.SUCCESS) {
                        toastr.success("添加成功!");
                        $('.complain-wrap .list span').removeClass('selected');
                        $('input[name=title]').val('');
                        $('input[name=contactInfo]').val('');
                        $('textarea[name=cont]').val('');
                        $('#file_list .attachment2-item').remove();
                    } else {
                        console.log("添加失败！");
                    }
                },function() {
                    console.log("服务器异常！")
                });
            }
        }
    };
    window.action = action;

    $('#addFeedbackBtn').find('button[type=submit]').click(function (t) {
        t.preventDefault();
        action.add()
    })

})