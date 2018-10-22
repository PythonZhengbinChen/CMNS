$(function() {
	/**
	 * 左侧位置搜索按钮点击，查找事件提交与响应
	 * @author ZhengbinChen
	 */
	$(".searchBtnBox").click(function(){
		var search=$("#placeSearchInputHide").val();
		if(search == "" || search == null) {
			alert("查找地点输入不正确，请重新输入！");
			$("#svg_line_group").html("");
			$("#svg_category_group").html("");
			return;
		}
		searchNoteByVertexId(search);
		
	});
	
	/**
	 * 这是用于输入框模糊匹配的方法
	 * @author ZhengbinChen
	 */
	$(".placeSearchInput").bind('input propertychange',function() {
		var index = $(".placeSearchInput").index(this)
		var keyString = $(".placeSearchInput").eq(index).val();
		$.ajax({
			url: '/CMNS/getNoteSearchList.do',
			type: 'POST',
			dataType: 'json',
			data: {keyString: keyString},
			success:function(search_result){
				$(".searchContent ul").html("");
				if(search_result.length == 0) {
					$(".searchContent ul").append("请输入正确的地点！");
					if(index == 0) {
						$("#placeSearchInputHide").val("");
					} else if(index == 1) {
						$("#NavigationFrom").val("");
					} else if(index == 2) {
						$("#NavigationTo").val("");
					}
					return;
				}
				if(index == 0) {
					$("#placeSearchInputHide").val(search_result[0].vertexId);
				} else if(index == 1) {
					$("#NavigationFrom").val(search_result[0].vertexId);
				} else if(index == 2) {
					$("#NavigationTo").val(search_result[0].vertexId);
				}
				
				for(var i = 0; i < search_result.length ; i++) {
					if(search_result[i].campus == 0) {
						var campusString = "东校区";
					}else {
						var campusString = "西校区";
					}
					var str = '<li index="'+index+'" id="'+search_result[i].vertexId+'">'
					+'<img src="./img/searchLi.png"><div class="seachLiName" id="">'
					+search_result[i].searchName+'</div><div class="campusName">'+campusString+'</div></li>';
					$(".searchContent ul").append(str);
				}
			}
		});
	});  
	/**
	 * 模糊搜索列表点击事件，填充输入框与自动搜索
	 * @author ZhengbinChen
	 */
	$(".searchContent ul").on("click","li",function() {
		var index = $(this).attr("index");
		var id = $(this).attr("id");
		var nameObj = $(this).children()[1];
		var name = $(nameObj).html();
		if(index == 0) {
			$("#placeSearchInputHide").val(id);
			$(".placeSearchInput").eq(index).val(name);
			//点击列表名字直接搜索
			searchNoteByVertexId(id);
		} else if(index == 1) {
			$("#NavigationFrom").val(id);
			$(".placeSearchInput").eq(index).val(name);
		} else if(index == 2) {
			$("#NavigationTo").val(id);
			$(".placeSearchInput").eq(index).val(name);
			//输入完终点以后自动搜索
			lineSearchBtnBox();
		}
	});

	/**
	 * 左侧所有类别点击事件
	 * @author ZhengbinChen
	 */
	$(".clearfix li").click(function() {
		var checkValue=$(this).attr("rel");
		var category = $(this).attr("category");
		if(checkValue == "") {
			return;
		}
		$.ajax({
			url: '/CMNS/getVertexListByVertexCategory.do',
			type: 'POST',
			dataType: 'json',
			data: {category: checkValue},
			success:function(search_result){
				document.getElementById("svg_line_group").innerHTML = "";
				document.getElementById("svg_category_group").innerHTML = "";
				$("#departmentListContent ul").html("");
				$("#lifeListContent ul").html("");
				$("#learnListContent ul").html("");
				//$("#detail_response").html(JSON.stringify(search_result));
				for(var i = 0; i < search_result.length; i ++) {
					var fristPositionX = parseInt(search_result[i].positionX) - 64;
					var fristPositionY = parseInt(search_result[i].positionY) - 128;
					var positionG = document.createElementNS("http://www.w3.org/2000/svg","g");
					positionG.setAttribute("id","positionG"+i);
					document.getElementById("svg_category_group").appendChild(positionG);
					
					var positionPort = document.createElementNS("http://www.w3.org/2000/svg","image");
					positionPort.href.baseVal = "images/position_port.svg";
					positionPort.setAttribute("x",fristPositionX);
					positionPort.setAttribute("y",fristPositionY);
					positionPort.setAttribute("width","128px");
					positionPort.setAttribute("height","128px");
					positionPort.setAttribute("id","positionPort"+i);
					document.getElementById("positionG"+i).appendChild(positionPort);
					
					var positionPortAnimate = document.createElementNS("http://www.w3.org/2000/svg","animate");
					positionPortAnimate.setAttribute("attributeName","y");
					positionPortAnimate.setAttribute("attributeType","XML");
					positionPortAnimate.setAttribute("from",fristPositionY);
					positionPortAnimate.setAttribute("to",fristPositionY-20);
					positionPortAnimate.setAttribute("begin","0s");
					positionPortAnimate.setAttribute("dur","0.8s");
					positionPortAnimate.setAttribute("repeatCount","indefinite");
					document.getElementById("positionPort"+i).appendChild(positionPortAnimate);
					
//					var positionPortNameRect = document.createElementNS("http://www.w3.org/2000/svg","rect");
//					positionPortNameRect.setAttribute("style","fill:red;fill-opacity:0.7;");
//					positionPortNameRect.setAttribute("id","positionPortNameRect"+i);
//					positionPortNameRect.setAttribute("x",fristPositionX+120);
//					positionPortNameRect.setAttribute("y",fristPositionY);
//					positionPortNameRect.setAttribute("width",50*search_result[i].searchName.length);
//					positionPortNameRect.setAttribute("height","100");
//					document.getElementById("positionG"+i).appendChild(positionPortNameRect);
//					
//					
//					var positionPortName = document.createElementNS("http://www.w3.org/2000/svg","text");
//					positionPortName.setAttribute("x",fristPositionX+140);
//					positionPortName.setAttribute("y",fristPositionY+70);
//					positionPortName.setAttribute("stroke","#fff");
//					positionPortName.innerHTML = search_result[i].searchName;
//					document.getElementById("positionG"+i).appendChild(positionPortName);
					
					if(search_result[i].campus == 0) {
						var campusString = "东校区";
					}else {
						var campusString = "西校区";
					}
					if(category == "department") {
						$("#departmentListContent ul").append('<li onclick="searchNoteByVertexId('+search_result[i].vertexId+')"><img src="./img/dpList.png"><div class="seachLiName" id="">'+search_result[i].searchName+'</div><div class="campusName">'+campusString+'</div></li>');
					} else if(category == "life") {
						$("#lifeListContent ul").append('<li onclick="searchNoteByVertexId('+search_result[i].vertexId+')"><img src="./img/dpList.png"><div class="seachLiName" id="">'+search_result[i].searchName+'</div><div class="campusName">'+campusString+'</div></li>');
					} else {
						$("#learnListContent ul").append('<li onclick="searchNoteByVertexId('+search_result[i].vertexId+')"><img src="./img/dpList.png"><div class="seachLiName" id="">'+search_result[i].searchName+'</div><div class="campusName">'+campusString+'</div></li>');
					}
					
				}
				
				//位置聚焦事件
				$("#content").attr("transform", "translate(1916.7254848180091,-263.0538767749217)scale(0.7578582832551992)");
				Scroll("1916.7254848180091","-263.0538767749217",0.7578582832551992);
			}
		});
	});
	
	
	/**
	 * 弹窗中所有类别点击事件
	 * @author ZhengbinChen
	 */
	$(".nearbyfix li").click(function() {
		var checkValue=$(this).attr("rel");
		var category = $(this).attr("category");
		var buildingId = $(".tooltipNavTitle").attr("buildingId");;
		if(checkValue == "") {
			return;
		}
		var defaultVertexId = "";
		$.ajax({
			url: '/CMNS/getBuildingBeanById.do',
			type: 'POST',
			async: false,
			dataType: 'json',
			data: {buildingId: buildingId},
			success:function(search_result){
				defaultVertexId = search_result.defaultPointId;
			}
		});
		
		var defaultX = 0;
		var defaultY = 0;
		$.ajax({
			url: '/CMNS/getVertexInfoByVertexId.do',
			type: 'POST',
			async: false,
			dataType: 'json',
			data: {vertexId: defaultVertexId},
			success:function(search_result){
				defaultX = search_result.positionX;
				defaultY = search_result.positionY;
			}
		});
		$.ajax({
			url: '/CMNS/getVertexListByVertexCategory.do',
			type: 'POST',
			async: false,
			dataType: 'json',
			data: {category: checkValue},
			success:function(search_result){
				document.getElementById("svg_line_group").innerHTML = "";
				document.getElementById("svg_category_group").innerHTML = "";
				$("#departmentListContent ul").html("");
				$("#lifeListContent ul").html("");
				$("#learnListContent ul").html("");
				
				//$("#detail_response").html(JSON.stringify(search_result));
				
				var dangqianPort = document.createElementNS("http://www.w3.org/2000/svg","image");
				dangqianPort.href.baseVal = "images/default.svg";
				dangqianPort.setAttribute("x",defaultX - 64);
				dangqianPort.setAttribute("y",defaultY - 108);
				dangqianPort.setAttribute("width","128px");
				dangqianPort.setAttribute("height","128px");
				dangqianPort.setAttribute("id","dangqianPort");
				document.getElementById("svg_category_group").appendChild(dangqianPort);
				
				var dangqianAnimate = document.createElementNS("http://www.w3.org/2000/svg","animate");
				dangqianAnimate.setAttribute("attributeName","y");
				dangqianAnimate.setAttribute("attributeType","XML");
				dangqianAnimate.setAttribute("from",defaultY - 108);
				dangqianAnimate.setAttribute("to",defaultY-128);
				dangqianAnimate.setAttribute("begin","0s");
				dangqianAnimate.setAttribute("dur","0.8s");
				dangqianAnimate.setAttribute("repeatCount","indefinite");
				document.getElementById("dangqianPort").appendChild(dangqianAnimate);
				
				for(var i = 0; i < search_result.length; i ++) {
					
					var fristPositionX = parseInt(search_result[i].positionX) - 64;
					var fristPositionY = parseInt(search_result[i].positionY) - 128;
					if(defaultX - fristPositionX < -1300 || defaultX - fristPositionX > 1300 || defaultY - fristPositionY < -1200 || defaultY - fristPositionY > 1200) {
						continue;
					}
					
					
					var positionG = document.createElementNS("http://www.w3.org/2000/svg","g");
					positionG.setAttribute("id","positionG"+i);
					document.getElementById("svg_category_group").appendChild(positionG);
					
					var positionPort = document.createElementNS("http://www.w3.org/2000/svg","image");
					positionPort.href.baseVal = "images/position_port.svg";
					positionPort.setAttribute("x",fristPositionX);
					positionPort.setAttribute("y",fristPositionY);
					positionPort.setAttribute("width","128px");
					positionPort.setAttribute("height","128px");
					positionPort.setAttribute("id","positionPort"+i);
					document.getElementById("positionG"+i).appendChild(positionPort);
					
					var positionPortAnimate = document.createElementNS("http://www.w3.org/2000/svg","animate");
					positionPortAnimate.setAttribute("attributeName","y");
					positionPortAnimate.setAttribute("attributeType","XML");
					positionPortAnimate.setAttribute("from",fristPositionY);
					positionPortAnimate.setAttribute("to",fristPositionY-20);
					positionPortAnimate.setAttribute("begin","0s");
					positionPortAnimate.setAttribute("dur","0.8s");
					positionPortAnimate.setAttribute("repeatCount","indefinite");
					document.getElementById("positionPort"+i).appendChild(positionPortAnimate);
				}
				$(".tooltip").css("display","none");
			}
		});
	});
	
	/**
	 * 弹窗上输入框的模糊搜索与显示
	 * @author ZhengbinChen
	 */
	$(".driveInput").bind('input propertychange',function() {
		var index = $(".driveInput").index(this)
		var keyString = $(".driveInput").eq(index).val();
		$.ajax({
			url: '/CMNS/getNoteSearchList.do',
			type: 'POST',
			dataType: 'json',
			data: {keyString: keyString},
			success:function(search_result){
				$(".tooltipSearchDivContent ul").html("");
				if(search_result.length == 0) {
					$(".tooltipSearchDivContent ul").append("请输入正确的地点！");
					return;
				}
				$("#hideSearchVertexId").val(search_result[0].vertexId);
				for(var i = 0; i < search_result.length ; i++) {
					if(search_result[i].campus == 0) {
						var campusString = "东校区";
					}else {
						var campusString = "西校区";
					}
					var str = '<li index="'+index+'" id="'+search_result[i].vertexId+'">'
					+'<img src="./img/searchLi.png"><div class="seachLiName" id="">'
					+search_result[i].searchName+'</div><div class="campusName">'+campusString+'</div></li>';
					$(".tooltipSearchDivContent ul").append(str);
				}
			}
		});
	});  
	
	/**
	 * 弹窗上模糊搜索结果点击输入框的填充
	 * @author ZhengbinChen
	 */
	$(".tooltipSearchDivContent ul").on("click","li",function() {
		var index = $(this).attr("index");
		var id = $(this).attr("id");
		var nameObj = $(this).children()[1];
		var name = $(nameObj).html();
		if(index == 0) {
			$("#hideSearchVertexId").val(id);
			$(".drive_from").val(name);
		} else if(index == 1) {
			$("#hideSearchVertexId").val(id);
			$(".drive_to").val(name);
		}
	});
	
});

/**
 * 车行路线导航
 * @author ZhengbinChen
 */
function lineSearchBtnBox(){
	var drive_from = $("#NavigationFrom").val();
	var drive_to = $("#NavigationTo").val();
	if(drive_from == "") {
		alert("请输入起点位置！");
		return;
	}
	if(drive_to == "") {
		alert("请输入终点位置！");
		return;
	}
	pathSearchAndDrow(drive_from,drive_to);
}

/**
 * 弹窗上点击查询的路线搜索事件
 * @returns
 * @author ZhengbinChen
 */
function driveSubmitCheck() {
	var startOrEnd = $("#hideVertexId").attr("auditing");
	if(startOrEnd == "start") {
		var drive_from = $("#hideVertexId").val();
		var drive_to = $("#hideSearchVertexId").val();
	} else {
		var drive_from = $("#hideSearchVertexId").val();
		var drive_to = $("#hideVertexId").val();
	}
	if($(".hideSearchVertexId").val() == "") {
		alert("请输入地点！");
		return;
	}
	pathSearchAndDrow(drive_from,drive_to);
	//清除弹窗
    VRcloseHoverClick();
    closeHoverClick();
}

/**
 * 搜素函数，并进行位置聚焦
 * @param vertexId
 * @returns
 * @author ZhengbinChen
 */
function searchNoteByVertexId(vertexId) {
	$.ajax({
		url: '/CMNS/getVertexInfoByVertexId.do',
		type: 'POST',
		dataType: 'json',
		data: {vertexId: vertexId},
		success:function(search_result){
			document.getElementById("svg_line_group").innerHTML = "  ";
			document.getElementById("svg_category_group").innerHTML = "";
			var fristPositionX = parseInt(search_result.positionX) - 64;
			var fristPositionY = parseInt(search_result.positionY) - 128;
			var positionG = document.createElementNS("http://www.w3.org/2000/svg","g");
			positionG.setAttribute("id","positionG");
			document.getElementById("svg_category_group").appendChild(positionG);
			
			var positionPort = document.createElementNS("http://www.w3.org/2000/svg","image");
			positionPort.href.baseVal = "images/position_port.svg";
			positionPort.setAttribute("x",fristPositionX);
			positionPort.setAttribute("y",fristPositionY);
			positionPort.setAttribute("width","128px");
			positionPort.setAttribute("height","128px");
			positionPort.setAttribute("id","positionPort");
			document.getElementById("positionG").appendChild(positionPort);
			
			var positionPortAnimate = document.createElementNS("http://www.w3.org/2000/svg","animate");
			positionPortAnimate.setAttribute("attributeName","y");
			positionPortAnimate.setAttribute("attributeType","XML");
			positionPortAnimate.setAttribute("from",fristPositionY);
			positionPortAnimate.setAttribute("to",fristPositionY-20);
			positionPortAnimate.setAttribute("begin","0s");
			positionPortAnimate.setAttribute("dur","0.8s");
			positionPortAnimate.setAttribute("repeatCount","indefinite");
			document.getElementById("positionPort").appendChild(positionPortAnimate);
			//位置聚焦事件
			$("#content").attr("transform", "translate("+search_result.translateX+","+search_result.translateY+")scale(2.60052)");
			Scroll(search_result.translateX,search_result.translateY,2.60052);
			//清除弹窗
	        VRcloseHoverClick();
	        closeHoverClick();
		}
	});
}


/**
 * 请求后台最短路径算法，并产生path指令，并进行动画设置
 * @param drive_from
 * @param drive_to
 * @returns
 * @author ZhengbinChen
 */
function pathSearchAndDrow(drive_from,drive_to) {
	$.ajax({
		url: '/CMNS/getMinLoadList.do',
		type: 'POST',
		dataType: 'json',
		data: 
			{
			startVertex: drive_from,
			endVertex: drive_to,
			category: '1'
			},
		success:function(search_result){
			var path = "";
			if(search_result.length == 0) {
				$("#car_response").html("无路径");
				return;
			}else {
				$("#svg_line_group").html("");
				$("#svg_category_group").html("");
				for(var i = 0; i < search_result.length; i++) {
					$.ajax({
						url: '/CMNS/getVertexInfoByVertexId.do',
						type: 'POST',
						async: false ,
						dataType: 'json',
						data: {vertexId: search_result[i]},
						success:function(VertexBean){
							path = path + " " + VertexBean.positionX + " " + VertexBean.positionY + " ";
						}
					});
				}
				var virtrulArray = path.split(" ");
				var fristPositionX = parseInt(virtrulArray[1]) - 64;
				var fristPositionY = parseInt(virtrulArray[2]) - 128;
				var lastPositionX = parseInt(virtrulArray[virtrulArray.length - 3]) - 64;
				var lastPositionY = parseInt(virtrulArray[virtrulArray.length - 2]) - 128;
				
				var startImage = document.createElementNS("http://www.w3.org/2000/svg","image");
				startImage.href.baseVal = "images/start.svg";
				startImage.setAttribute("x",fristPositionX);
				startImage.setAttribute("y",fristPositionY);
				startImage.setAttribute("width","128px");
				startImage.setAttribute("height","128px");
				startImage.setAttribute("id","startImage");
				document.getElementById("svg_line_group").appendChild(startImage);
				
				var startImageAnimate = document.createElementNS("http://www.w3.org/2000/svg","animate");
				startImageAnimate.setAttribute("attributeName","y");
				startImageAnimate.setAttribute("attributeType","XML");
				startImageAnimate.setAttribute("from",fristPositionY);
				startImageAnimate.setAttribute("to",fristPositionY-20);
				startImageAnimate.setAttribute("begin","0s");
				startImageAnimate.setAttribute("dur","0.8s");
				startImageAnimate.setAttribute("repeatCount","indefinite");
				document.getElementById("startImage").appendChild(startImageAnimate);
				
				
				var endImage = document.createElementNS("http://www.w3.org/2000/svg","image");
				endImage.href.baseVal = "images/end.svg";
				endImage.setAttribute("x",lastPositionX);
				endImage.setAttribute("y",lastPositionY);
				endImage.setAttribute("width","128px");
				endImage.setAttribute("height","128px");
				endImage.setAttribute("id","endImage");
				document.getElementById("svg_line_group").appendChild(endImage);
				
				var endImageAnimate = document.createElementNS("http://www.w3.org/2000/svg","animate");
				endImageAnimate.setAttribute("attributeName","y");
				endImageAnimate.setAttribute("attributeType","XML");
				endImageAnimate.setAttribute("from",lastPositionY);
				endImageAnimate.setAttribute("to",lastPositionY-20);
				endImageAnimate.setAttribute("begin","0s");
				endImageAnimate.setAttribute("dur","0.8s");
				endImageAnimate.setAttribute("repeatCount","indefinite");
				document.getElementById("endImage").appendChild(endImageAnimate);
				
				var pathDom = document.createElementNS("http://www.w3.org/2000/svg","path");
				pathDom.setAttribute("id","pathDom");
				pathDom.setAttribute("d","M"+virtrulArray[1]+" "+virtrulArray[2] + "L"+ path);
				
				document.getElementById("svg_line_group").appendChild(pathDom);
				
				//清除弹窗
		        VRcloseHoverClick();
		        closeHoverClick();
				
				//位置聚焦事件
				$("#content").attr("transform", "translate(1017.2037341127971,-345.1846845750431)scale(0.7468032615342223)");
				Scroll("1017.2037341127971","-345.1846845750431",0.7468032615342223);
				
				animalAuto();
				var time = 2;
				var interval = setInterval(function() {
					time = time - 1;
					if (time <= 0) {
						animalAuto();
						clearInterval(interval);
					}else {
						
					}
				}, 3000);
				
				
			}
		}
	});
}

/**
 * 路线绘制的动画效果
 * @returns
 * @author ZhengbinChen
 */
function animalAuto() {
	//路径动画效果
	new Vivus('svg_line_group', {type: 'delayed',duration: 200}, function() {
		console.log("end");
	}).reset().play();
}


