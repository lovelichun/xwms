$(function() {
	var userName = Util.cookieStorage.getCookie("username");
	var token_value = Util.cookieStorage.getCookie("accesstoken");
	var depart_id = Util.cookieStorage.getCookie("departId");
	var company_id = Util.cookieStorage.getCookie("companyId");
	var role_level = Util.cookieStorage.getCookie("userLevel");
	var admin_id = Util.cookieStorage.getCookie("adminId");
	var nick_name = Util.cookieStorage.getCookie("nickname");

	var url=location.search;
	var Request = new Object();
	if(url.indexOf("?")!=-1) {
		var str = url.substr(1)　//去掉?号
		strs = str.split("&");
		for(var i=0;i<strs.length;i++){
			Request[strs[i ].split("=")[0]]=unescape(strs[ i].split("=")[1]);
		}
	};
	var moduleId = parseInt(Request["moduleId"]);
	var insertAuth = parseInt(Request["insertAuth"]);
	var queryAuth = parseInt(Request["queryAuth"]);
	var updateAuth = parseInt(Request["updateAuth"]);

	var action = {
		init: function(){
			if(0 == insertAuth){
                $("#btn-add").hide();
			 }
			if(0 == queryAuth){

			}
			if(0 == updateAuth){

			}
		},
		//获取所有数据
		loadPageData : function() {
            var td_len = $("#table thead tr th").length;//表格字段数量

            var url = ctx + "boss/role/query";
            var data = new Object();
			data.role_id = parseInt(role_level);
			data.company_id = parseInt(company_id);
            data.creator_id = parseInt(admin_id);

            Util.ajaxLoadData(url,data,moduleId,"POST",true,function(result) {
                if(result.code == ReturnCode.SUCCESS){
                    $('#pageContent').find("tr").remove();
					$("#pageTmpl").tmpl(result.data).appendTo('#pageContent');

                    if($('#pageContent tr').length == 0){
                        $('#pageContent').append("<tr><td  colspan='" + td_len + "' class='t_a_c'>暂无数据</td></tr>");
					}
					if(0 == updateAuth){
						$(".table-update").hide();
						$(".table-manage").hide();
					}
                } else {
                    toastr.error(result.msg);
				}
            },function(errorMsg) {
				alert(errorMsg);
            });
		},
        loadDepartData : function() {
            var url = ctx + "boss/depart/query";
            var data = new Object();
            data.depart_name = '';
            data.creator_id = parseInt(admin_id);
            Util.ajaxLoadData(url,data,moduleId,"POST",true,function(result) {
                if(result.code == ReturnCode.SUCCESS){
                    $("#pageUserRoles").tmpl(result.data).appendTo('#role-departId');
                    localStorage.setItem("departArray",JSON.stringify(result.data));
                }else {
                }
            },function(errorMsg) {
                alert(errorMsg);
            });
        },
		//新增用户角色
		add : function() {
			/*var add_depart_id = null;
			console.log(parseInt($('#role-departId option:selected').val()))
			console.log(parseInt(role_level))
			if(parseInt(role_level) == 1){
				if($('#role-departId option:selected').val() == ""){
					add_depart_id = null;
				}else{
					add_depart_id = parseInt($('#role-departId option:selected').val());
				}
			}else{
				add_depart_id = parseInt(depart_id);
			}*/

			var url = ctx + "boss/role/insert";
			var data = new Object();
			data.admin_id = parseInt(admin_id);
			data.role_level = parseInt($("#input-authLevel").val());
			data.role_name = $("#input-name").val();
			data.desc = $("#input-description").val();
			data.company_id = parseInt(company_id);
			data.depart_id = parseInt($('#role-departId option:selected').val());
            data.creator_id = parseInt(admin_id);

			Util.ajaxLoadData(url,data,moduleId,"POST",true,function(result) {
				if(result.code == ReturnCode.SUCCESS){
					$("#addTempl2-modal").modal('hide');
					toastr.success("添加成功!");
					action.loadPageData();
				} else {
                    toastr.error(result.msg);
				}
			},function(errorMsg) {
                toastr.error(errorMsg);
            });
		},
		//编辑数据
		edit : function() {
			var url = ctx + "boss/role/update";
			var data = new Object();
			data.id = parseInt($("#input-id").val());
			data.role_level = parseInt($("#input-authLevel").val());
			data.role_name = $("#input-name").val();
			data.desc = $("#input-description").val();
			data.company_id = parseInt(company_id);
			data.depart_id = parseInt(depart_id);

			Util.ajaxLoadData(url,data,moduleId,"POST",true,function(result) {
				if (result.code == ReturnCode.SUCCESS) {
			 		$("#addTempl2-modal").modal('hide');
                    toastr.success("编辑成功!");
                    action.loadPageData();
				}else{
                    toastr.error(result.msg);
				}
			},function(errorMsg) {
                alert(errorMsg);
            });
		},
        //删除数据
        deleteItem : function(id, name) {
            if (confirm("删除后不可恢复，确定删除" + name + "？")) {
                var url = ctx + "boss/role/delete";
                var data = new Object();
                data.id = id;
                Util.ajaxLoadData(url,data,moduleId,"POST",true,function(result) {
                    if (result.code == ReturnCode.SUCCESS) {
                        toastr.success("删除成功!");
                        action.loadPageData();
                    }
                });
            }
        }
	};
	window.action = action;
	action.init();
	action.loadDepartData();
	action.loadPageData();


	$("#addTempl2-modal").on('show.bs.modal', function(e) {
		// 处理modal label显示及表单重置
		var $form = $("form#form-addTempl2");
        if (!e.relatedTarget) {
            $("#role-departId-wrap").hide();
            $("#role-depart-txt-wrap").show();
            $("h4#addTempl2-modal-label").text("编辑用户角色");
            $form.data("action", "edit");
        } else if (e.relatedTarget.id = "btn-add-userRoles") {
            $("#role-departId-wrap").show();
            $("#role-depart-txt-wrap").hide();
            $("h4#addTempl2-modal-label").text("添加用户角色");
            $form.data("action", "add");
            $form[0].reset();
        }
	});

    //编辑获取数据
    $("#pageContent").on("click",".table-edit-btn",function(){
        var that = $(this).parent().parent();

        $("#input-id").val(that.find("td").eq(0).text());
        $("#input-authLevel").val(that.find("td").eq(1).text());
        $("#input-name").val(that.find("td").eq(2).text());
		$("#input-description").val(that.find("td").eq(3).text());
		$("#role-depart-txt").val(that.find("td").eq(5).text());
        //$("#input-userRoles-txt").val($('#search-input-userRoles option:selected').text());

        $("#addTempl2-modal").modal("show");
    });

	//验证表单
   /* $("#form-addTempl").validate({
        rules : {
			account : {
                required : true
            }
        }
    });*/
	$("#form-addTempl2").validate({
		rules : {
			authLevel : {
				required : true
			},
			name : {
				required : true
			}
		}
	});

	$("#btn-add-submit2").on('click', function() {
		var action = $("form#form-addTempl2").data("action");
		if(action == "add"){
			if (!$("#form-addTempl2").valid()) {
				return;
			}else if(isNaN($("#input-authLevel").val())) {
				$("#input-authLevel").parent().parent().addClass("has-error");
				var err_html = "<label class='error control-label' style='padding-left: 5px;'>请填入数字</label>";
				$("#input-authLevel").parent().append(err_html);
				return;
			}else {
				window.action.add();
			}
		}else if(action == "edit"){
			window.action.edit();
		}
	});

	$("#input-authLevel").change(function () {
		if(!isNaN($(this).val())) {
			$(this).parent().removeClass("has-error");
			$(this).next().remove();
		}
	});

	$("#btn-search").on('click', function() {
        action.loadPageData();
	});
	$("#input-search-account").on('keydown', function(e) {
        if (e.keyCode == 13) {
            action.loadPageData();
        }

	});
	$("#input-search-role_id").on('keydown', function(e) {
		if (e.keyCode == 13) {
			action.loadPageData();
		}

	});
	$("#input-search-company_id").on('keydown', function(e) {
		if (e.keyCode == 13) {
			action.loadPageData();
		}

	});

});