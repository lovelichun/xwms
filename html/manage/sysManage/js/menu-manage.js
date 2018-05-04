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
		//新增数据
		add : function() {
            var url = ctx + "boss/module/insert";
			var data = new Object();
			data.name = $("#input-moduleName").val();
			data.description = $("#input-description").val();
			data.priority = parseInt($("#input-priority").val());
			data.sn = $("#input-sn").val();
			data.url = $("#input-url").val();
			data.parent_id = parseInt($('#parent-menu option:selected').val());
			data.company_id = parseInt(company_id);

            Util.ajaxLoadData(url,data,moduleId,"POST",true,function(result) {
                if (result.code == ReturnCode.SUCCESS) {
                    $("#addTempl-modal").modal('hide');
                    toastr.success("添加成功!");
                    action.loadPageData();
                }else{
                    toastr.error(result.msg);
				}
            },function(errorMsg) {
                alert(errorMsg)
            });
		},
        //获取一级目录菜单
        menuPageData : function() {
            var url = ctx + "boss/module/queryParentModule";
            var data = {};
            Util.ajaxLoadData(url,data,moduleId,"POST",true,function(result) {
                if(result.code == ReturnCode.SUCCESS && result.data != ""){
                    // 父级菜单选择下拉列表
                    $("#pageParentMenu").tmpl(result.data.data).appendTo('#parent-menu');
                } else {
                    toastr.error(result.msg);
                }
            },function(errorMsg) {
                alert(errorMsg)
            });
        },
		//获取所有数据
		loadPageData : function() {
			var searchMenuName = $("#input-search-menu-name").val();
			var url = ctx + "boss/module/queryByPage";
			var data = {
                "page_no": 1,
                "page_size": 20,
                "param": {
                    "name": searchMenuName
				}
			};
            var opt = {
                "targetContentId" : "pageContent",
                "url" : url,
                "forAuth2" : true,
                "moduleId" : moduleId,
                "rowTemplateId" : "pageTmpl",
                "contextUrl" : ctx,
                "pageBtnsContentId" : "pagination",
                "tmplEvents" : {
                    setTime : function(time) {
                        if (time) {
                            var times = new Date(time);
                            time = times.format('yyyy-MM-dd hh:mm:ss');
                        }
                        return time;
                    }
                },
                "resultFilter" : function(result) {
                    return result.data.result;
                },
                "param" : data
            };
            this.page = new Util.Page(opt);
		},
		//编辑数据
		edit : function() {
			var url = ctx + "boss/module/update";
			var data = new Object();
            /*data.admin_id = parseInt(admin_id),*/
			data.module_id = parseInt($("#input-moduleId").val());
			data.name = $("#input-moduleName").val();
            data.description = $("#input-description").val();
			data.priority = parseInt($("#input-priority").val());
			data.sn = $("#input-sn").val();
			data.status = parseInt($("input[name=status]:checked").val());
			data.url = $("#input-url").val();
			data.parent_id = parseInt($('#parent-menu-txt').val());
			/*data.depart_id = parseInt(depart_id);*/
			data.company_id = parseInt(company_id);

			Util.ajaxLoadData(url,data,moduleId,"POST",true,function(result) {
				if (result.code == ReturnCode.SUCCESS) {
			 		$("#addTempl-modal").modal('hide');
                    toastr.success("编辑成功!");
                    action.loadPageData();
				}else{
                    toastr.error(result.msg);
				}
			},function(errorMsg) {
                alert(errorMsg)
            });
		},
		//删除数据
		deleteItem : function(id) {
			if (confirm("删除后不可恢复，确定删除" + name + "？")) {
				var url = ctx + "boss/module/delete";
				var data = new Object();
                data.module_id = id;

				Util.ajaxLoadData(url,data,moduleId,"POST",true,function(result) {
					if (result.code == ReturnCode.SUCCESS) {
                        toastr.success("删除成功!");
                        action.loadPageData();
					}else{
                        toastr.error(result.msg);
					}
				},function(errorMsg) {
                    alert(errorMsg)
                });
			}
		}
	};
	window.action = action;
	action.init();
	action.menuPageData();
	action.loadPageData();

    $("#btn-search").on('click', function() {
        if($("#input-search-menu-name").val() === '') {
            $("#input-search-menu-name").parent().addClass("has-error");
            return;
        }
        action.loadPageData();
    });
    $("#input-search-menu-name").on('keydown', function(e) {
        if (e.keyCode == 13) {
            action.loadPageData();
        }
    });


    //编辑获取数据数据
    $("#pageContent").on("click",".table-edit-btn",function(){
        var that = $(this).parent().parent();
		var check_status = $.trim(that.find(".td-status").text());
		var status_val = null;
		if(check_status === "可见"){
			status_val = 1;
		}else if(check_status === "不可见"){
			status_val = 0;
		}
        $("#input-moduleId").val(that.find(".td-moduleId").text());
        $("#input-priority").val(that.find(".td-priority").text());
        $("#input-moduleName").val(that.find(".td-moduleName").text());
        $("#input-url").val(that.find(".td-url").text());
		$("#input-sn").val(that.find(".td-sn").text());
		$("#parent-menu-txt").val(that.find(".td-parent_id").text());
		$(".parent-menu-txt-name").html(that.find(".td-parent_name").text());
		$("#input-description").val(that.find(".td-description").text());
		$("input[name=status]").filter("[value=" + status_val + "]").prop('checked', true);
        $("#addTempl-modal").modal("show");
    });

	$("#addTempl-modal").on('show.bs.modal', function(e) {
		// 处理modal label显示及表单重置
		var $form = $("form#form-addTempl");
		if (!e.relatedTarget) {
            $("#parent-menu-txt-wrap").show();
            $("#parent-menu-wrap").hide();
			$("h4#addTempl-modal-label").text("编辑菜单信息");
			$form.data("action", "edit");
		} else if (e.relatedTarget.id = "btn-add") {
            $("#parent-menu-txt-wrap").hide();
            $("#parent-menu-wrap").show();
			$("h4#addTempl-modal-label").text("添加菜单信息");
			$form.data("action", "add");
			$form[0].reset();
		}
	});

	//验证表单
    $("#form-addTempl").validate({
        rules : {
			moduleName : {
                required : true
            },
			priority : {
				required : true
			},
			sn : {
				required : true
			},
			status : {
				required : true
			},
			parent_id : {
				required : true
			}
        }
    });

	$("#btn-add-submit").on('click', function() {
		if (!$("#form-addTempl").valid()) {
			return;
		}
		if(isNaN($("#input-priority").val())) {
			$("#input-priority").parent().parent().addClass("has-error");
			var err_html = "<label class='error control-label' style='padding-left: 5px;'>请填入数字</label>";
			$("#input-priority").parent().append(err_html);
			return;
		}
		if(isNaN($("#parent-menu").val())) {
			$("#parent-menu").parent().parent().addClass("has-error");
			var err_html = "<label class='error control-label' style='padding-left: 5px;'>请选择父级菜单</label>";
			$("#parent-menu").parent().append(err_html);
			return;
		}
		var action = $("form#form-addTempl").data("action");
		switch (action) {
		case "add":
			window.action.add();
			break;
		case "edit":
			window.action.edit();
			break;
		}
	});

	$("#input-priority").change(function () {
		if(!isNaN($(this).val())) {
			$(this).parent().removeClass("has-error");
			$(this).next().remove();
		}
	});

	$("#parent-menu").change(function () {
		if(!isNaN($(this).val())) {
			$(this).parent().removeClass("has-error");
			$(this).next().remove();
		}
	});

	$("#btn-search").on('click', function() {
        action.loadPageData();
	});
	$("#input-search-txt").on('keydown', function(e) {
        if (e.keyCode == 13) {
            action.loadPageData();
        }

	});
});





//分页
Util.Page = (function() {
    var Page = function(options) {
        var opt = options ? options : {};
        this.targetContentId = opt.targetContentId ? opt.targetContentId : "";// 显示查询到结果的区域
        this.url = opt.url ? opt.url : "";
        this.ctx = opt.ctx ? opt.ctx : "";
        this.pageBtnsContentId = opt.pageBtnsContentId ? opt.pageBtnsContentId
            : "";// 显示分页按钮的区域
        this.rowTemplateId = opt.rowTemplateId ? opt.rowTemplateId : "";// 每一行的模板
        this.tmplBindEvents = opt.tmplBindEvents ? opt.tmplBindEvents : {};
        this.tmplEvents = opt.tmplEvents;
        this.allNumContentId = opt.allNumContentId ? opt.allNumContentId : "";// 显示所有条数的区域
        this.resultFilter = opt.resultFilter ? opt.resultFilter : null;// 过滤要遍历的数据
        this.callback = opt.callback ? opt.callback : null;// 成功加载所有html后的回调
        this.allNumberAreaId = opt.allNumberAreaId ? opt.allNumberAreaId : "";// 每一行的模板
        this.Page = 1;
        this.PageSize = 20;
        this.allPageSize = 0;
        this.showPageNum = 7;// 显示多少个页面数
        this.param = options.param;
        this.filterParam = null;
        this.forAuth2 = typeof (opt.forAuth2) != "undefined" ? opt.forAuth2
            : false;
        this.updateAuth = typeof (opt.updateAuth) != "undefined" ? opt.updateAuth
            : false;
        this.moduleId = typeof (opt.moduleId) != "undefined" ? opt.moduleId
            : false;
        this.loadTBodyData(this.param);
        // this.initPageBtns();
    };
    Page.prototype.setCurrentPage = function() {
        $(_this).siblings(".page_a").removeClass("current");
        $(_this).addClass("current");
        var pageNow = $(_this).text();
        var pageNowInt = parseInt(pageNow);
        if (isNaN(pageNowInt)) {
            return;
        }
        if (pageNowInt == ManagerSet.productManager.pageNow) {// 如果点击的页面跟当前页相等，则返回
            return;
        }
        ManagerSet.productManager.pageNow = pageNowInt;
        ManagerSet.productManager.loadTBodyData();
    };
    Page.prototype.refreshData = function(data) {
        this.pageNow = 1;
        this.loadTBodyData(data);
    };

    Page.prototype.refreshCurrentPageData = function(data) {
        this.loadTBodyData(data);
    };

    Page.prototype.initPageBtns = function(totalCount,allPageSize) {
        var that = this;
        var htmlStr = '';
        var hasDots = false;
        htmlStr = '<span>共'+allPageSize+'页，'+totalCount+'条数据</span>';
        htmlStr += '<a href="javascript:void(0)" title="上一页" class="page_a jsBtnA prev_page">上一页</a><span id="pageBtns">';
        for (var i = 0; i < allPageSize; i++) {
            var pageNow = i + 1;
            var pe = allPageSize - that.pageNow;
            if (that.pageNow >= 5) {
                if (i < 2) {
                    cBtnStr = '<a href="javascript:void(0)" class="page_a current_page jsBtnA " title="第' + pageNow + '页">' + pageNow + '</a>';
                    htmlStr = htmlStr + cBtnStr;
                }
            }
            if (pe > 3) {
                if (i == that.pageNow - 2 && i > 0) {
                    htmlStr = htmlStr + "<span>...</span>";
                }
                if (i >= (that.pageNow - 2) && i <= (that.pageNow + 2)) {
                    if (pageNow == that.pageNow) {
                        cBtnStr = '<a href="javascript:void(0)" class="page_a current_page jsBtnA current" title="第' + pageNow + '页">' + pageNow + '</a>';
                    } else {
                        cBtnStr = '<a href="javascript:void(0)" class="page_a current_page jsBtnA " title="第' + pageNow + '页">' + pageNow + '</a>';
                    }
                    htmlStr = htmlStr + cBtnStr;
                } else {
                    if (i == (that.pageNow + 2)) {
                        htmlStr = htmlStr + "<span>...</span>";
                    }
                }
            } else {
                if (i == (that.pageNow - 2) && i > 0) {
                    htmlStr = htmlStr + "<span>...</span>";
                }
                if (i > (that.pageNow - 3)) {
                    if (pageNow == that.pageNow) {
                        cBtnStr = '<a href="javascript:void(0)" class="page_a current_page jsBtnA current" title="第' + pageNow + '页">' + pageNow + '</a>';
                    } else {
                        cBtnStr = '<a href="javascript:void(0)" class="page_a current_page jsBtnA " title="第' + pageNow + '页">' + pageNow + '</a>';
                    }
                    htmlStr = htmlStr + cBtnStr;
                }
            }
        }
        htmlStr += '</span><a href="javascript:void(0)" title="下一页" class="page_a jsBtnA next_page"">下一页</a>';
        htmlStr += '<input type="text"  style="width:30px;"/>';
        htmlStr += '<a href="javascript:void(0)" class="page_a jsBtnA page_a_go" style="margin-left:5px;">Go</a>';
        $("#" + this.pageBtnsContentId).html(htmlStr);

        if (allPageSize == 0) {
            $("#" + this.pageBtnsContentId).hide();
        } else {
            $("#" + this.pageBtnsContentId).show();
        }
        $("#" + this.pageBtnsContentId).find(".current_page").bind("click", function() {// 点击某一页
            $(this).siblings(".page_a").removeClass("current");
            $(this).addClass("current");
            var pageNow = $(this).text();
            var pageNowInt = parseInt(pageNow);
            if (isNaN(pageNowInt)) {
                return;
            }
            if (pageNowInt == that.pageNow) {// 如果点击的页面跟当前页相等，则返回
                return;
            }
            that.pageNow = pageNowInt;
            that.loadTBodyData();
        });

        $("#" + this.pageBtnsContentId).find(".prev_page").bind("click", function() {// 上一页
            if (1 == that.pageNow) {
                return;
            }
            that.pageNow = that.pageNow - 1;
            that.loadTBodyData();
            $("#pageBtns .page_a").removeClass("current");
            $("#pageBtns .page_a").eq(that.pageNow - 1).addClass("current");
        });

        $("#" + this.pageBtnsContentId).find(".next_page").bind("click", function() {// 下一页
            if (that.allPageSize == that.pageNow) {
                return;
            }
            that.pageNow = that.pageNow + 1;
            that.loadTBodyData();
            $("#pageBtns .page_a").removeClass("current");
            $("#pageBtns .page_a").eq(that.pageNow - 1).addClass("current");
        });

        $("#" + this.pageBtnsContentId).find(".page_a_go").bind("click", function() {// 下一页
            var pageNow = $(this).prev().val();
            var pageNowInt = parseInt(pageNow);
            if (isNaN(pageNowInt)) {
                Util.showTit("请输入数字", "no");
                return;
            }
            if (pageNowInt <= 0 || pageNowInt > that.allPageSize) {
                Util.showTit("输入数字必须在 0 与  " + that.allPageSize + " 之间", "no");
                return;
            }
            if (pageNowInt == that.pageNow) {// 如果点击的页面跟当前页相等，则返回
                return;
            }
            that.pageNow = pageNowInt;
            that.loadTBodyData();
            $("#pageBtns .page_a").removeClass("current");
            $("#pageBtns .page_a").eq(that.pageNow - 1).addClass("current");
        });
    };

    Page.prototype.loadTBodyData = function(data) {
        if (data) {
            this.filterParam = data;
            this.pageSize = data.page_size;
            this.pageNow = data.page_no;
        }
        var sendData = {
            "page_size" : this.pageSize,
            "page_no" : this.pageNow
        };
        if (this.forAuth2 == true) {
            if(data){
                sendData = data;
            }else{
                sendData = $.extend({},this.param,sendData);
            }
        }
        if (this.filterParam) {
            $.extend(this.filterParam,sendData);
        }
        var that = this;
        var url = this.url;
        var moduleId = this.moduleId;
        var data = sendData;

        var callback = function(result) {
            if(result.data != null) {
                var list = result.data.data.result;
                that.allPageSize = Math.ceil(result.data.data.total_count / that.pageSize);

                // 把当前索引号添加进去
                for (var i = 0; i < list.length; i++) {
                    var h_ = list[i];
                    h_.DATAINDEX_ = (that.pageNow - 1) * that.pageSize + i + 1;
                }
                var html = $("#" + that.rowTemplateId).tmpl(list);

                var bindTargets = html.find(".js_bind_data");
                if (typeof (that.targetContentId) == "string") {
                    $("#" + that.targetContentId).html(html);
                    bindTargets = $("#" + that.targetContentId).find(".js_bind_data");
                } else {
                    that.targetContentId.html(html);
                    bindTargets = that.targetContentId.find(".js_bind_data");
                }

                for (var i = 0; i < list.length; i++) {
                    var h_ = $(bindTargets[i]);
                    h_.data("personInfor", list[i]);
                    h_.attr("html", i);
                }

                that.initPageBtns(result.data.data.total_count, that.allPageSize);

            }else{
                var td_len = $("#table thead tr th").length;//表格字段数量
                $('#pageContent').find("tr").remove();
                $('#pageContent').append("<tr><td  colspan='" + td_len + "' class='t_a_c'>暂无数据</td></tr>");
            }
        };

        Util.ajaxLoadData(url,data,moduleId,"POST",true,callback);
    };
    return Page;
})();
