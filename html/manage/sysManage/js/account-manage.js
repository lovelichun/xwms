$(function() {
	var userName = Util.cookieStorage.getCookie("username");
    var token_value = Util.cookieStorage.getCookie("accesstoken");
	var admin_id = Util.cookieStorage.getCookie("adminId");
	var role_id = Util.cookieStorage.getCookie("userLevel");
	var depart_id = Util.cookieStorage.getCookie("departId");//所属公司id

	var action = {
		//新增数据
		add : function() {
			var add_company_id = null;
			if(1 == parseInt(role_id)){
				add_company_id = parseInt($('#add-companyId option:selected').val());
			}else{
				add_company_id = parseInt(depart_id);
			}

            var url = ctx + "boss/admin/insert";
            var data = new Object();
			data.admin_id = parseInt(admin_id);
			data.account = $("#input-account").val();
			data.password = $.md5($("#input-password").val());
			data.nick_name = $("#input-nickName").val();
			data.role_id = parseInt($('#add-search-userRoles option:selected').val());
			data.phone = $("#input-phone").val();
			data.email = $("#input-email").val();
			data.organization_id = add_company_id;

            Util.ajaxLoadData(url,data,"POST",true,function(result) {
                if (result.code == ReturnCode.SUCCESS) {
                    $("#addTempl-modal").modal('hide');
                    toastr.success("添加成功!");
                    action.loadPageData();
                }else{
					alert(result.msg);
				}
            });
		},
		//获取所有数据
		loadPageData : function() {
			var search_account = $("#input-search-account").val();
			var search_role_id = parseInt($('#input-search-userRoles option:selected').val());
			var search_company_id = null;
			if(1 == parseInt(role_id)){
				$("#input-search-company_id-wrap").show();
				$("#input-search-company_id-txt-wrap").hide();
				$("#add-companyId-wrap").show();
				$("#role-companyId-wrap").show();
				search_company_id = parseInt($('#input-search-company_id option:selected').val());

			}else{
				$("#input-search-company_id-wrap").hide();
				$("#input-search-company_id-txt-wrap").show();
				$("#add-companyId-wrap").hide();
				$("#role-companyId-wrap").hide();
				search_company_id = parseInt(depart_id);
				var my_companyName = companyNameQuery(search_company_id);
				$("#input-search-company_id-txt").val(my_companyName);

			}

            var td_len = $("#table thead tr th").length;//表格字段数量

            var url = ctx + "boss/admin/query";
            var data = new Object();
			data.admin_id = parseInt(admin_id);
			data.account = search_account;
            data.role_id = search_role_id;
			data.company_id = search_company_id;

            Util.ajaxLoadData(url,data,"POST",true,function(result) {
                if(result.code == ReturnCode.SUCCESS && result.data != ""){
                    $('#pageContent').find("tr").remove();
                    $("#pageTmpl").tmpl(result.data).appendTo('#pageContent');

                    if($('#pageContent tr').length == 0){
                        $('#pageContent').append("<tr><td  colspan='" + td_len + "' class='t_a_c'>暂无数据</td></tr>");
					}
                } else {
					alert(result.msg);
                }
            },function() {
                alert("服务器开个小差，请稍后重试！")
            });

		},
		//获取当前用户角色列表数据
		loadUserRolesData : function() {
			var url = ctx + "boss/role/query";
			var data = new Object();
			data.role_id = parseInt(role_id);
			data.organ_id = parseInt(depart_id);
			Util.ajaxLoadData(url,data,"POST",true,function(result) {
				if(result.code == ReturnCode.SUCCESS && result.data != ""){
					$("#pageUserRoles").tmpl(result.data).appendTo('#add-search-userRoles');
					$("#pageUserRoles").tmpl(result.data).appendTo('#input-search-userRoles');
				} else {
					alert(result.msg);
				}
			},function() {
				alert("服务器开个小差，请稍后重试！")
			});
		},
		//新增用户角色
		addUserRolesData : function() {
			var add_company_id = null;
			if(1 == parseInt(role_id)){
				add_company_id = parseInt($('#role-companyId option:selected').val());
			}else{
				add_company_id = parseInt(depart_id);
			}
			var url = ctx + "boss/role/add";
			var data = new Object();
			data.authLevel = parseInt($("#input-authLevel").val());
			data.name = $("#input-name").val();
			data.description = $("#input-description").val();
			data.organizationId = add_company_id;

			Util.ajaxLoadData(url,data,"POST",true,function(result) {
				if(result.code == ReturnCode.SUCCESS){
					$("#addTempl2-modal").modal('hide');
					toastr.success("添加成功!");
					action.myUserRolesData(add_company_id);
				} else {
					alert(result.msg);
				}
			},function() {
				alert("服务器开个小差，请稍后重试！")
			});
		},
		//获取当前用户角色列表数据
		myUserRolesData : function(selDepartId) {
			var url = ctx + "boss/role/query";
			var data = new Object();
			data.role_id = parseInt(role_id);
			data.organ_id = parseInt(depart_id);
			Util.ajaxLoadData(url,data,"POST",true,function(result) {
				if(result.code == ReturnCode.SUCCESS && result.data != ""){
					var myUserRolesArray = [];
					myUserRolesArray = result.data;
					if(selDepartId == parseInt(depart_id)){

						$('#add-search-userRoles').empty();
						$('#input-search-userRoles').empty();
						$("#pageUserRoles").tmpl(result.data).appendTo('#add-search-userRoles');
						$("#pageUserRoles").tmpl(result.data).appendTo('#input-search-userRoles');
					}
					Util.cookieStorage.setCookie("myUserRolesArray",JSON.stringify(myUserRolesArray));
				} else {
					alert(result.msg);
				}
			},function() {
				alert("服务器开个小差，请稍后重试！")
			});
		},
		//获取全部公司团体数据
		loadCompanyInfoData: function(){
			var allCompanyArray = JSON.parse(Util.cookieStorage.getCookie("allCompanyArray"));
			$("#pageCompanyInfo").tmpl(allCompanyArray).appendTo('#input-search-company_id');
			$("#pageCompanyInfo").tmpl(allCompanyArray).appendTo('#add-companyId');
			$("#pageCompanyInfo").tmpl(allCompanyArray).appendTo('#role-companyId');

		},
		//编辑数据
		edit : function() {
			var pwd ="";
			var pwd2 = $("#modify-password-wrap").val();
			if(pwd2 == null || pwd2 == ""){
				pwd = $("#input-password-wrap").val();
			}else{
				pwd = $.md5(pwd2);
			}

			var url = ctx + "boss/admin/update";
			var data = new Object();
			data.login_id = parseInt(admin_id);
			data.admin_id = parseInt($("#input-id").val());
			data.account = $("#input-account-txt").val();
			data.password = pwd;
			data.nick_name = $("#input-nickName").val();
			data.role_id = parseInt($("#input-roleId").val());
			data.organization_id = parseInt($("#input-companyId").val());
			data.phone = $("#input-phone").val();
			data.email = $("#input-email").val();
			data.status = parseInt($("input[name=status]:checked").val());

			Util.ajaxLoadData(url,data,"POST",true,function(result) {
				if (result.code == ReturnCode.SUCCESS) {
			 		$("#addTempl-modal").modal('hide');
                    toastr.success("编辑成功!");
                    action.loadPageData();
					$("#modify-password-wrap").val("");

				}else{
					$("#modify-password-wrap").val("");
					alert(result.msg);
				}
			});
		},
		//删除数据
		deleteConfig : function(id) {
			if (confirm("删除后不可恢复，确定删除" + name + "？")) {
				var url = ctx + "boss/clienttype/delclienttype";
				var data = new Object();
                data.type_id = id;
				Util.ajaxLoadData(url,data,"POST",true,function(result) {
					if (result.code == ReturnCode.SUCCESS) {
                        toastr.success("删除成功!");
						/*$("#input-search-client_type").val("");
						$("#input-search-client_name").val("");*/
                        action.loadPageData();
					}else{
						alert(result.msg);
					}
				});
			}
		}
	};
	window.action = action;
	action.loadUserRolesData();
	action.loadCompanyInfoData();
	action.loadPageData();

	$("#addTempl-modal").on('show.bs.modal', function(e) {
		// 处理modal label显示及表单重置
		var $form = $("form#form-addTempl");
		if (!e.relatedTarget) {
			$("h4#addTempl-modal-label").text("编辑管理员");
			$("#input-account-wrap").hide();
			$("#input-account-txt-wrap").show();
			$("#add-companyId-wrap").hide();
			$("#input-password-txt").hide();
			$("#input-password-txt-wrap").hide();
			$("#input-roleId-wrap").hide();
			$("#add-userRoles-wrap").hide();
			$("#input-roleName-txt-wrap").show();
			$("#add-companyId-txt-wrap").show();
			$("#input-companyId-txt").hide();
			$("#modify-password-txt-wrap").show();
			$("#edit-status-wrap").show();
			$form.data("action", "edit");
		} else if (e.relatedTarget.id = "btn-add") {
			$("h4#addTempl-modal-label").text("添加管理员");
			$("#input-account-wrap").show();
			$("#input-account-txt-wrap").hide();
			$("#input-password-txt").show();
			$("#input-password-txt-wrap").hide();
			$("#input-roleId-wrap").hide();
			$("#add-userRoles-wrap").show();
			$("#input-roleName-txt-wrap").hide();
			$("#add-companyId-txt-wrap").hide();
			$("#input-companyId-txt").hide();
			$("#modify-password-txt-wrap").hide();
			$("#edit-status-wrap").hide();
			$form.data("action", "add");
			$form[0].reset();
		}
	});

	$("#addTempl2-modal").on('show.bs.modal', function(e) {
		// 处理modal label显示及表单重置
		var $form = $("form#form-addTempl2");
		if (!e.relatedTarget) {
			$("h4#addTempl2-modal-label").text("编辑用户角色");
			$form.data("action", "edit");
		} else if (e.relatedTarget.id = "btn-add") {
			$("h4#addTempl2-modal-label").text("添加用户角色");
			$form.data("action", "add");
			$form[0].reset();
		}
	});

    //编辑获取数据
    $("#pageContent").on("click",".table-edit-btn",function(){
        var that = $(this).parent().parent();
		var check_status = $.trim(that.find("td").eq(10).text());
		var status_val = null;
		if(check_status === "可用"){
			status_val = 1;
		}else if(check_status === "不可用"){
			status_val = 0;
		}

        $("#input-id").val(that.find("td").eq(0).text());
        $("#input-account-txt").val(that.find("td").eq(1).text());
        $("#input-password-wrap").val(that.find("td").eq(2).text());
		$("#input-nickName").val(that.find("td").eq(3).text());
		$("#input-roleName-txt").val(that.find("td").eq(4).text());
		$("#input-roleId").val(that.find("td").eq(8).text());
		$("#input-phone").val(that.find("td").eq(5).text());
		$("#input-email").val(that.find("td").eq(6).text());
		$("#add-companyId-txt").val(that.find("td").eq(7).text());
		$("#input-companyId").val(that.find("td").eq(9).text());
		$("input[name=status]").filter("[value=" + status_val + "]").prop('checked', true);
		/*$("#input-status").val(that.find("td").eq(8).text());*/


        $("#addTempl-modal").modal("show");
    });

	//验证表单
    $("#form-addTempl").validate({
        rules : {
			account : {
                required : true
            }
        }
    });
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

	$("#btn-add-submit").on('click', function() {
		var action = $("form#form-addTempl").data("action");
		if(action == "add"){
			if (!$("#form-addTempl").valid()) {
				return;
			}else if($("#input-password").val() == "") {
				$("#input-password").parent().parent().addClass("has-error");
				var err_html = "<label class='error control-label' style='padding-left: 5px;'>必填字段</label>";
				$("#input-password").parent().append(err_html);
				return;
			}else if($("#add-search-userRoles").val() == "") {
				$("#add-search-userRoles").parent().parent().addClass("has-error");
				var err_html = "<label class='error control-label' style='padding-left: 5px;'>必填字段</label>";
				$("#add-search-userRoles").parent().append(err_html);
				return;
			}else if($("#add-companyId").val() == "") {
				$("#add-companyId").parent().parent().addClass("has-error");
				var err_html = "<label class='error control-label' style='padding-left: 5px;'>必填字段</label>";
				$("#add-companyId").parent().append(err_html);
				return;
			}else {
				window.action.add();
			}
		}else if(action == "edit"){
				window.action.edit();
		}
	});

	$("#btn-add-submit2").on('click', function() {
		var action = $("form#form-addTempl2").data("action");
		if(action == "add"){
			if (!$("#form-addTempl2").valid()) {
				return;
			}else {
				window.action.addUserRolesData();
			}
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