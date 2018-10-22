$(function (){
    setBackgroundMap();
	tooltipDrag();
    Scroll(0,0,1);
    buildingOn();
    navigation();
    turn();
    navigationBox();
});

/**
 * 分块加载图片填充
 * @returns
 * @author ZhengbinChen
 *@time: 2018年5月7日11点08分
 */
function setBackgroundMap() {
            var k = 1;
            var content = document.getElementById("svg_image_bg_group");
            for (var i = 0; i <= 9; i++) {
                for (var j = 0; j <= 9; j++) {
                    var y = 661 * i;
                    var x = 886 * j;

                    var image = document.createElementNS("http://www.w3.org/2000/svg","image");
                    image.href.baseVal = "images/map_bg_"+k+".jpg";
                    //image.setAttribute("xlink:href","images/map_bg_"+k+".jpg");
                    image.setAttribute("x",x);
                    image.setAttribute("y",y);
                    image.setAttribute("width","886px");
                    image.setAttribute("height","661px");
                    //var img = "<image xlink:href='images/map_bg_"+k+".jpg' x='"+y+"' y='"+x+"' width='88.6' height='66.1'/>";
                    content.appendChild(image);
                    k++;
                }
            }
        }

/**
 * 背景SVG缩放与拖拽
 * @param x
 * @param y
 * @param k
 * @returns
 * @author ZhengbinChen
 */
function Scroll(x,y,k) {
    var margin = {top: -5, right: -5, bottom: -5, left: -5},
    width = 1520 - margin.left - margin.right,
    height = 1150 - margin.top - margin.bottom;

    var zoom = d3.behavior.zoom()
    .scaleExtent([0.5, 10])
    .on("zoom", zoomed);
    var svg = d3.select("body").select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .call(zoom);
    var translate = [x,y];
    d3.transition().duration(2500).tween("zoom", function () {
    	svg.call(zoom.translate(translate).scale(k).event);
    });
    var container = svg.select("#content");
    /**
     * 弹窗随svg一起移动效果
     */
    var div1 = document.getElementById("tooltip");
    var svg1 = document.getElementById("svg_wrapper_content");
    svg1.onmousedown = function(ev){
    　　　　var oevent = ev || event;
    　　　　var distanceX = oevent.clientX - div1.offsetLeft;
    　　　　var distanceY = oevent.clientY - div1.offsetTop;
       svg1.style.cursor = "move";
    　　　　document.onmousemove = function(ev){
    　　　　　　var oevent = ev || event;
    　　　　　　div1.style.left = oevent.clientX - distanceX + 'px';
    　　　　　　div1.style.top = oevent.clientY - distanceY + 'px'; 
    　　　　};
    　　　　document.onmouseup = function(){
    　　　　　　document.onmousemove = null;
    　　　　　　document.onmouseup = null;
    	  svg1.style.cursor = "default";
    　　　　};
    　　};
    /***tooltip end***/
    function zoomed() {
        $("#content").attr("transform", "translate(" + d3.event.translate+ ")scale(" + d3.event.scale + ")");
    }
    
} 

/**
 * 弹窗拖拽效果
 * @returns
 * @author ZhengbinChen
 */
function tooltipDrag() {
	var div1 = document.getElementById("tooltip");
    div1.onmousedown = function(ev){
    　　　　var oevent = ev || event;
    div1.style.cursor = "move";
    　　　　var distanceX = oevent.clientX - div1.offsetLeft;
    　　　　var distanceY = oevent.clientY - div1.offsetTop;

    　　　　document.onmousemove = function(ev){
    　　　　　　var oevent = ev || event;
    　　　　　　div1.style.left = oevent.clientX - distanceX + 'px';
    　　　　　　div1.style.top = oevent.clientY - distanceY + 'px'; 
    　　　　};
    　　　　document.onmouseup = function(){
    　　　　　　document.onmousemove = null;
    　　　　　　document.onmouseup = null;
    div1.style.cursor = "default";
    　　　　};
    　　};
}

/**
 * 建筑点击事件，获取建筑信息
 * @returns
 * @author ZhengbinChen
 */
function buildingOn() {
    var arcs = d3.selectAll("path");
    var tooltip = d3.select(".tooltip").style("display","none");
    arcs.on("mousedown",function(event)  
            {       
    	 $(".tooltipSearchFormInput").val("");
         $(".tooltipSearchDivContent ul").html("");
         var buildingid = $(this).attr("buildingid");
         if(buildingid == "") {
         	return;
         }
    	$.ajax({
            url: '/CMNS/getBuildingBeanById.do',
            type: 'POST',
            dataType: 'json',
            data: {buildingId: buildingid},
            success:function(data){
                $(".departmentList").html("");
                $(".tooltipNavTitle").html(data.name);
                $(".tooltipNavTitle").attr("buildingId",buildingid);
                $(".tooltipContentPic img").attr("src","buildingPic/"+buildingid+".jpg");
                $(".buildingIntroduceContent").html(data.introduce);
                $("#hideVertexId").val(data.defaultPointId);
                if(data.noteSearchBean.length == 1) {
                	$(".departmentList").append("");
                	$(".departmentList").css("height","0");
                }
                for(var i = 0 ; i< data.noteSearchBean.length ; i ++) {
                	var address = data.noteSearchBean[i].address;
                	if(address == null) {
                		address = "";
                	}
                	if(data.noteSearchBean[i].departmentUrl == null && data.noteSearchBean[i].introduce == "1") {
                    	var str = '<div style="padding: 5px; border-bottom: 1px dashed #666;"><span>'+data.noteSearchBean[i].searchName+'</span></div>';
                    }else if(data.noteSearchBean[i].departmentUrl == null && data.noteSearchBean[i].introduce != null) {
                    	var str = '<div style="padding: 5px; border-bottom: 1px dashed #666;"><span>'+data.noteSearchBean[i].searchName+'</span> '
                        +'/'+address+'/<a href="#" class="departmentIntroduce" onclick="departmentIntroduce(event)">'
                        +' [单位介绍]</a><a href="#" class="departmentIntroduceClose" style="display: none;" onclick="departmentIntroduceClose(event)">[收起]</a>'
                        +'<div class="introduce">'+data.noteSearchBean[i].introduce+'</div></div>';
                    } else if(data.noteSearchBean[i].departmentUrl != null && data.noteSearchBean[i].introduce == null) {
                    	var str = '<div style="padding: 5px; border-bottom: 1px dashed #666;"><span>'+data.noteSearchBean[i].searchName+'</span> '
                        +'/'+address+'/<a target="_blank" href="'+data.noteSearchBean[i].departmentUrl+'">[官网链接]</a>'
                        +'</div>';
                    } else if(data.noteSearchBean[i].departmentUrl == null && data.noteSearchBean[i].introduce == null) {
                    	continue;
                    } else {
                    	var str = '<div style="padding: 5px; border-bottom: 1px dashed #666;"><span>'+data.noteSearchBean[i].searchName+'</span> '
                        +'/'+address+'/<a target="_blank" href="'+data.noteSearchBean[i].departmentUrl+'">[官网链接]</a><a href="#" class="departmentIntroduce" onclick="departmentIntroduce(event)">'
                        +' [单位介绍]</a><a href="#" class="departmentIntroduceClose" style="display: none;" onclick="departmentIntroduceClose(event)">[收起]</a>'
                        +'<div class="introduce">'+data.noteSearchBean[i].introduce+'</div></div>';
                    }
                	
                    $(".departmentList").append(str);
                    str = "";
                    $(".departmentList").css("height","auto");
                }
                
                
                
            }
        });
    	//设置tooltip文字  
       //tooltip.html("<img src=\"images/map_bg_17.jpg\" width=\"100%\">")
       //设置tooltip的位置(left,top 相对于页面的距离)   
       tooltip.style("left",(d3.event.pageX - 300)+"px")  
                .style("top",(d3.event.pageY+40)+"px")  
                .style("display","inline"); 
   });
}

/**
 * 单位介绍展开事件
 * @param event
 * @returns
 * @author ZhengbinChen
 */
function departmentIntroduce(event) {
    $(event.target).parent().children(".departmentIntroduce").css("display","none");
    $(event.target).parent().children(".departmentIntroduceClose").css("display","inline");
    $(event.target).parent().children(".introduce").css("display","block");
}

/**
 * 单位介绍收起事件
 * @param event
 * @returns
 * @author ZhengbinChen
 */
function departmentIntroduceClose(event) {
    $(event.target).parent().children(".departmentIntroduce").css("display","inline");
    $(event.target).parent().children(".departmentIntroduceClose").css("display","none");
    $(event.target).parent().children(".introduce").css("display","none");
}

/**
 * 弹窗关闭按钮事件
 * @returns
 * @author ZhengbinChen
 */
function closeDefaultOver() {
    $(".closeDefaultOver").css("display","none");
    $(".closeHoverClick").css("display","inline");
}

function closeDefaultOut() {
    $(".closeDefaultOver").css("display","inline");
    $(".closeHoverClick").css("display","none");
}

function closeHoverClick() {
    $(".tooltip").css("display","none");
}

/**
 * 引入外部VR全景事件与效果
 * @param url
 * @param title
 * @returns
 * @author ZhengbinChen
 */
function setVRFrame(url,title) {
    $(".VRContent").html("");
    var loadingStr = '<div class="load-wrapp"><div class="load-4"><div class="ring-1"></div>加载中...</div></div>';
    $(".VRContent").append(loadingStr);
    $(".tooltipNavTitle").html(title);
    var urlStr = '<iframe id="VRObject" frameborder="0" src="'+url+'" width="100%" height="100%"></iframe >'; 
    $(".VRContent").append(urlStr);
    var iframe = document.getElementById("VRObject");      
        if (iframe.attachEvent) {      
            iframe.attachEvent("onload", function() {      
                //iframe加载完成后你需要进行的操作   
            });      
        } else {      
            iframe.onload = function() {      
                      //iframe加载完成后你需要进行的操作
                $(".load-wrapp").css("display","none");
            };      
        }
    $(".universityViewTooltip").css("display","block");
}

/**
 * 校园文化模块的填充，静态到燕大新闻网
 * @param title
 * @param id
 * @returns
 * @author ZhengbinChen
 */
function setCulture(title,id) {
	$(".VRContent").html("");
    $(".tooltipNavTitle").html(title);
	if(id == "0") {
		var str = '<div id="vsb_content"><p class="vsbcontent_start">1920年，哈工大建校，校名为“哈尔滨中俄工业学校”。1938年，改名为“哈尔滨工业大学”。1954年，国务院确定6所高校为第一批全国重点大学，哈工大成为京外唯一一所全国重点大学。</p>'
+'<p>1958年，哈尔滨工业大学重型机械系及相关专业组建了“哈尔滨工业大学重型机械学院”。</p>'
+'<p>1960年，哈尔滨工业大学重型机械学院成建制独立办学，定名为“东北重型机械学院”。</p>'
+'<p>1978年，东北重型机械学院被国务院确定为全国重点高等院校。</p>'
+'<p>1985年至1997年整体南迁首批沿海开放城市秦皇岛市。</p>'
+'<p>1997年，东北重型机械学院整体更名为“燕山大学”。</p>'
+'<p>2006年，国防科工委和河北省共建燕山大学。</p>'
+'<p>2010年，国家国防科工局和河北省共建燕山大学。</p>'
+'<p>2014年，河北省、工信部和教育部共建燕山大学。</p>'
+'<p class="vsbcontent_img"><img width="660" src="http://ysu.edu.cn/__local/1/03/70/407639D5445E5768855DFD71316_02676DB9_35E7D.jpg?e=.jpg"></p>'
+'<p class="vsbcontent_img"><img src="http://ysu.edu.cn/__local/0/0F/00/C3AC31C63ADAB64E29EE9D6F8AC_B8F1468F_21197.jpg?e=.jpg"></p>'
+'<p class="vsbcontent_img"><img src="http://ysu.edu.cn/__local/B/BC/29/609133D99422185A4E8AD2E1C76_D1502612_24D87.jpg?e=.jpg"></p>'
+'<ul class=" list-paddingleft-2">'
+' <li><p> &nbsp;&nbsp;</p></li>'
+'</ul>'
+'<p class="vsbcontent_end">（该内容由燕山大学校长办公室更新）</p>'
+'<link rel="stylesheet" type="text/css" href="http://ysu.edu.cn/system/resource/style/ueditor/olul.css"></div>';
		$(".VRContent").append(str);
	}else if(id == "1") {
		var str = '<div id="u_u6_imgcontent"><table width="100%"><tbody><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/14230.htm" target="_blank"><img id="u_u6_img14230" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/B/8E/5D/9F57F0BE329140FC58808A5BCCF_E612482C_7B35.jpg" width="87" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/14230.htm" target="_blank"><span class="titlestyle51316">【榜样的力量】燕山大学2...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/14195.htm" target="_blank"><img id="u_u6_img14195" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/D/22/6D/C950C80BC7BC8188E55B40295FC_10D92C2C_4CAF.jpg" width="80" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/14195.htm" target="_blank"><span class="titlestyle51316">【走进辅导员】知心的朋...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/14175.htm" target="_blank"><img id="u_u6_img14175" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/1/19/D3/28AFEFE3ADE21FAC714B7E63729_C0C4F621_3CD0.jpg" width="150" height="92"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/14175.htm" target="_blank"><span class="titlestyle51316">【听课记】激情与智慧的...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/14159.htm" target="_blank"><img id="u_u6_img14159" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/D/38/23/8718007AF88B7440E99E447A665_6168F49A_5B83.jpg" width="104" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/14159.htm" target="_blank"><span class="titlestyle51316">【最美燕大人】凡人善举...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/14153.htm" target="_blank"><img id="u_u6_img14153" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/4/53/7E/F316131D300129590C3030F70E3_9DB13843_788B.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/14153.htm" target="_blank"><span class="titlestyle51316">静水流深，方能致远-----...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/14136.htm" target="_blank"><img id="u_u6_img14136" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/B/03/76/B072EC87E0FB612BBCAD1B6D19E_E95A0E9A_42AB.jpg" width="150" height="71"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/14136.htm" target="_blank"><span class="titlestyle51316">相约看日出</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/14106.htm" target="_blank"><img id="u_u6_img14106" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/6/36/74/2E17F7B92DD9851A58A54F5A8E1_0E54F3CA_10F8F.jpg" width="134" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/14106.htm" target="_blank"><span class="titlestyle51316">不磨砺 不成器——大学生...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/13957.htm" target="_blank"><img id="u_u6_img13957" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/8/D4/55/05F655E21FB061C33012CC2C5AD_6095A22B_A19B.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/13957.htm" target="_blank"><span class="titlestyle51316">田永君——沉心20年揭开...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/13587.htm" target="_blank"><img id="u_u6_img13587" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/D/0D/67/02374638878645BB53B1532E91C_729E4219_7462.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/13587.htm" target="_blank"><span class="titlestyle51316">【最美燕大人】善举于行...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/13532.htm" target="_blank"><img id="u_u6_img13532" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/4/54/62/C1C3347544A500784E2D6925F9A_2EF3DAFA_A5D9.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/13532.htm" target="_blank"><span class="titlestyle51316">【最美燕大人】徐建平：...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/13296.htm" target="_blank"><img id="u_u6_img13296" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/8/47/EF/0DEE7B5CFE4CFFE7BE8645BB434_7CE78027_3E37.jpg" width="87" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/13296.htm" target="_blank"><span class="titlestyle51316">【听课记】广电星播客—...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/13287.htm" target="_blank"><img id="u_u6_img13287" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/0/69/E2/9A4FB64CD747612028678B1CE10_DBFCAD85_3E5B.jpg" width="150" height="85"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/13287.htm" target="_blank"><span class="titlestyle51316">【最美燕大人】玉碎不忘...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/13154.htm" target="_blank"><img id="u_u6_img13154" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/2/01/89/71171FEFB6BE91362B076D29200_8E3D37F9_908B.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/13154.htm" target="_blank"><span class="titlestyle51316">【最美燕大人】追求真理...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/13152.htm" target="_blank"><img id="u_u6_img13152" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/4/CE/CB/B99B03AD1C224D1EFC72A2535FC_D9F82D8D_B6E2.jpg" width="150" height="113"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/13152.htm" target="_blank"><span class="titlestyle51316">愿一路上有你——辅导员...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/13086.htm" target="_blank"><img id="u_u6_img13086" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/F/1B/A2/37F82B3303D04D35E23E9E2F4BF_CDB6ABFB_6151.jpg" width="98" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/13086.htm" target="_blank"><span class="titlestyle51316">【听课记】笑如阳光，把...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/13085.htm" target="_blank"><img id="u_u6_img13085" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/8/A3/28/434CED4B13AB32D305B22262BAE_2EDD824C_9A26.jpg" width="150" height="101"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/13085.htm" target="_blank"><span class="titlestyle51316">【最美燕大人】闻遍泥土...</span></a><br><br></span></td></tr><tbody><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/13014.htm" target="_blank"><img id="u_u6_img13014" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/B/30/D5/DAEFFB88E3B6CB1D2F2DE4D3BB2_2BAA842D_6B67.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/13014.htm" target="_blank"><span class="titlestyle51316">【听课记】播撒籽，等花...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/13013.htm" target="_blank"><img id="u_u6_img13013" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/2/8C/F8/9B99DDB867C2163F483FD24CB55_A156E08E_8E51.jpg" width="150" height="85"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/13013.htm" target="_blank"><span class="titlestyle51316">【最美燕大人】娜样执着...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12932.htm" target="_blank"><img id="u_u6_img12932" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/B/C2/20/A359981A6B45DEF5718305DE83E_D9F0B551_3559.png" width="150" height="96"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12932.htm" target="_blank"><span class="titlestyle51316">诚信考试 自律源于信任和...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12884.htm" target="_blank"><img id="u_u6_img12884" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/1/56/57/2B1FA2A1C3F773CF3CF2E97EA93_4BB280F1_6765.jpg" width="150" height="101"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12884.htm" target="_blank"><span class="titlestyle51316">诚信生活 将诚信教育与大...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12788.htm" target="_blank"><img id="u_u6_img12788" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/0/D9/CC/101AC3EC17BD03749C2019D753F_4173DFCD_696B.jpg" width="130" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12788.htm" target="_blank"><span class="titlestyle51316">【最美燕大人】用心点亮...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12775.htm" target="_blank"><img id="u_u6_img12775" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/4/4C/09/5BE7DE72ACA467D460BBE3519A4_85209BBD_8D6F.jpg" width="89" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12775.htm" target="_blank"><span class="titlestyle51316">【最美燕大人】用爱心点...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12774.htm" target="_blank"><img id="u_u6_img12774" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/8/26/96/18C04FDF76B415B19AA5A24DF76_4329DAE1_4801.jpg" width="98" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12774.htm" target="_blank"><span class="titlestyle51316">【听课记】过岭艳霞开画...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12592.htm" target="_blank"><img id="u_u6_img12592" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/1/75/7A/97FD584C230D0893043BFB0426F_3A0DBD2B_C0F9.jpg" width="150" height="113"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12592.htm" target="_blank"><span class="titlestyle51316">【学子风采】Safari咖啡...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12588.htm" target="_blank"><img id="u_u6_img12588" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/3/E0/C1/398EFFEFA40CCE859B83C924F0D_4ADB77EC_A467.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12588.htm" target="_blank"><span class="titlestyle51316">早起联盟：同朝阳并肩与...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12495.htm" target="_blank"><img id="u_u6_img12495" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/F/18/09/6BBCD6382F1BD9781AF1BF335CC_EFDDCFEF_5A2B.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12495.htm" target="_blank"><span class="titlestyle51316">【听课记】学无止境——...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12494.htm" target="_blank"><img id="u_u6_img12494" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/E/90/48/C48516C8EC04D558459A7E02E8F_8C2F2978_52EA.jpg" width="87" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12494.htm" target="_blank"><span class="titlestyle51316">【学子风采】青春的印记...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12393.htm" target="_blank"><img id="u_u6_img12393" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/3/9F/A4/3F44C31B91EB83EA9BA4778076F_D1247E85_AC5E.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12393.htm" target="_blank"><span class="titlestyle51316">【最美燕大人】爱心大使...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12392.htm" target="_blank"><img id="u_u6_img12392" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/E/2F/F9/F6199110983E5CFC32D9FDCA444_24ABA62B_64A9.jpg" width="98" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12392.htm" target="_blank"><span class="titlestyle51316">何晓静： 儿童福利院的情...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12349.htm" target="_blank"><img id="u_u6_img12349" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/E/DC/54/1B0D6657A7B3C41ACC7E87233B3_0D0D5852_4C16.jpg" width="87" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12349.htm" target="_blank"><span class="titlestyle51316">王洪波：唯故乡与科学不...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12333.htm" target="_blank"><img id="u_u6_img12333" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/F/FB/C4/2954421750645FA07AF99D05654_F1A490B3_5FF6.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12333.htm" target="_blank"><span class="titlestyle51316">【师者魅力】粉笔生涯，...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12331.htm" target="_blank"><img id="u_u6_img12331" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/F/63/F9/E4008117F526AFDC966BD0A0057_CE5022EC_5CF0.jpg" width="98" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12331.htm" target="_blank"><span class="titlestyle51316">【听课记】“带电”的孙老师</span></a><br><br></span></td></tr>'
			+'<tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12304.htm" target="_blank"><img id="u_u6_img12304" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/5/7C/96/A9038BFA9CB1FBA861E36327104_63D39F2C_6517.jpg" width="150" height="113"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12304.htm" target="_blank"><span class="titlestyle51316">【学子风采】厉害了我的...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12302.htm" target="_blank"><img id="u_u6_img12302" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/0/24/D0/52601D4C0AF6169D056BE67DB0D_42D7AB90_44CF.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12302.htm" target="_blank"><span class="titlestyle51316">【最美燕大人】老党员赵...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12243.htm" target="_blank"><img id="u_u6_img12243" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/7/0E/F9/07A7BC5C958E3C72810835FC440_70958231_6C3E.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12243.htm" target="_blank"><span class="titlestyle51316">【听课记】日语新世界的...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12229.htm" target="_blank"><img id="u_u6_img12229" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/8/56/6F/1A463B0FF5F5A1D4C099176C9A7_044F9D3A_492D.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12229.htm" target="_blank"><span class="titlestyle51316">【听课记】春风化雨阿汤哥</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12227.htm" target="_blank"><img id="u_u6_img12227" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/F/5C/07/BAAF394A897FD44D72C9EE02B82_30EF67BE_D0C4.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12227.htm" target="_blank"><span class="titlestyle51316">【红色之声，青春韵律】...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12165.htm" target="_blank"><img id="u_u6_img12165" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/6/DE/01/118CE58209264E8677A159DB949_9DAF38C2_8CE8.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12165.htm" target="_blank"><span class="titlestyle51316">李征：只要迈出第一步 梦...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/12160.htm" target="_blank"><img id="u_u6_img12160" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/A/65/DE/C0DF086435606813D1B76728F57_F9F1E70C_6500.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/12160.htm" target="_blank"><span class="titlestyle51316">【师者魅力】冰心存玉壶...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/11201.htm" target="_blank"><img id="u_u6_img11201" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/1/5D/76/00F955839FB97E1D8D019C6E8BB_F4253541_4A30.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/11201.htm" target="_blank"><span class="titlestyle51316">【最美燕大人】靳玉超：...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/11199.htm" target="_blank"><img id="u_u6_img11199" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/B/E8/65/BF8B4274644607D5521F8D39561_A0E89156_8252.jpg" width="87" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/11199.htm" target="_blank"><span class="titlestyle51316">【走近辅导员】张薇：成...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/11198.htm" target="_blank"><img id="u_u6_img11198" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/A/E1/5B/E2969ABC7F3BF4CEB8B3E9F928F_1FD6981B_4E6C.jpg" width="87" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/11198.htm" target="_blank"><span class="titlestyle51316">【师者魅力】愿做阳光温...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/11141.htm" target="_blank"><img id="u_u6_img11141" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/B/F0/9A/AD1B1F52A4DEC346BE70D373117_3B21B557_8C7F.jpg" width="150" height="113"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/11141.htm" target="_blank"><span class="titlestyle51316">辅导员大家访——让爱在...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/11051.htm" target="_blank"><img id="u_u6_img11051" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/7/49/91/4A6EB67CD8044F6C92A571598A4_547AC3AE_8304.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/11051.htm" target="_blank"><span class="titlestyle51316">【师者魅力】用心去工作 ...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/11028.htm" target="_blank"><img id="u_u6_img11028" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/2/73/94/E243CFACE0712C17164849BCF22_8B60185B_5F8F.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/11028.htm" target="_blank"><span class="titlestyle51316">最美燕大人·宿舍捉盗记</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/10981.htm" target="_blank"><img id="u_u6_img10981" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/F/79/E2/FFBA0262396FDF6EF6DDA025A25_9F10A985_6C5C.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/10981.htm" target="_blank"><span class="titlestyle51316">最美燕大人·助人为乐传递...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/10970.htm" target="_blank"><img id="u_u6_img10970" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/9/D8/C4/AC0A6E2AA830DEE5F872A62380E_E1845518_68FA.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/10970.htm" target="_blank"><span class="titlestyle51316">最美燕大人·无声的力量—...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1006/10019.htm" target="_blank"><img id="u_u6_img10019" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2015/04/22/_thumb/30buprgdek.jpg" width="87" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1006/10019.htm" target="_blank"><span class="titlestyle51316">最美燕大人·你是温暖 沐...</span></a><br><br></span></td></tr></tbody></tbody></table></div>';
		$(".VRContent").append(str);
	}else {
		var str = '<div id="u_u6_imgcontent"><table width="100%"><tbody><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/12870.htm" target="_blank"><img id="u_u6_img12870" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/4/72/2B/0AB0E8168A583CC22B9D8FE9EC2_E164792C_8210.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/12870.htm" target="_blank"><span class="titlestyle51316">印象燕大·舞出我青春（组...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/12687.htm" target="_blank"><img id="u_u6_img12687" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/C/77/77/7590AEA94B7F6F90C90F7024E47_7E84E1BB_C14C.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/12687.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 飘雪的日子...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/12564.htm" target="_blank"><img id="u_u6_img12564" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/E/1A/AB/559DD7E3D9EF4B2010FA18866B2_DA6C67FD_60D0.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/12564.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 来自星星的...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/12441.htm" target="_blank"><img id="u_u6_img12441" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/4/E8/FF/093117E573B4EFA9676A74F8291_CC735916_10821.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/12441.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 最美不过夕...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/12329.htm" target="_blank"><img id="u_u6_img12329" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/C/82/C0/F6CC661808A45951F9C8BF55164_968B319E_6B4F.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/12329.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 记录者的风...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/12245.htm" target="_blank"><img id="u_u6_img12245" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/0/FB/17/EB0ED4D4740FB89D42F5282A0E5_581052E1_166B7.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/12245.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 阅读秋天（...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/12139.htm" target="_blank"><img id="u_u6_img12139" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/D/D1/30/087F5551C2F28C5ACABA7C00288_BFDDD314_11268.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/12139.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 第四十五届...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/12128.htm" target="_blank"><img id="u_u6_img12128" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/5/94/64/F59623F581E7B1DD05FC902B6F3_C434E1F2_BB30.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/12128.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 迷彩九月（...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/12029.htm" target="_blank"><img id="u_u6_img12029" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/A/36/C9/19A08B55F2AF9EA54B193777DA3_DF80C078_FCCA.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/12029.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 来燕大的第...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/11691.htm" target="_blank"><img id="u_u6_img11691" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/F/13/9B/D5912C8A6C71437D517BF46EA22_BE3713A5_F62F.jpg" width="150" height="113"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/11691.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 我爱你，再...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/11489.htm" target="_blank"><img id="u_u6_img11489" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/3/EF/90/2303CCB15D1BD19CF6C2A2FF50A_FB4F3BB5_BA49.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/11489.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 燕大人的一...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/11354.htm" target="_blank"><img id="u_u6_img11354" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/A/EC/11/D675BB1F8EBD7AF9940144F30AE_B02A64E1_B5A5.jpg" width="130" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/11354.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 那些花儿（...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/11255.htm" target="_blank"><img id="u_u6_img11255" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/5/A8/3B/97189CD4C2284D391EBF9EDB4B5_06673875_9FE8.jpg" width="150" height="94"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/11255.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 燕大夜生活...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/11178.htm" target="_blank"><img id="u_u6_img11178" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/3/46/23/0B9DC653097B42F58F6BE0BB993_9809A415_1054E.jpg" width="150" height="102"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/11178.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 燕大人的一...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/11054.htm" target="_blank"><img id="u_u6_img11054" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/B/10/4B/7446E1BC2ABCA6DE9B18E0814F4_285ED87F_5693.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/11054.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 冬日里的“...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/11078.htm" target="_blank"><img id="u_u6_img11078" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/9/60/27/C972EDC348851FE1197A4EE2794_E9ACF8DC_A691.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/11078.htm" target="_blank"><span class="titlestyle51316">印象燕大 • “矗”的记...</span></a><br><br></span></td></tr><tbody><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/10995.htm" target="_blank"><img id="u_u6_img10995" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/8/1C/E5/669E96DB065669204BA9CC4CA08_31E7CDD3_8B34.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/10995.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 燕园初雪（...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/10902.htm" target="_blank"><img id="u_u6_img10902" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/C/4E/C0/71315DED967FAAD338E98087283_08CA5542_7453.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/10902.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 燕大24小时...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/10771.htm" target="_blank"><img id="u_u6_img10771" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/3/12/F9/F343E07D1463149004002F71648_188567FD_7FAE.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/10771.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 秋意诗情（...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/10678.htm" target="_blank"><img id="u_u6_img10678" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/D/88/42/E74228AA298432A781327F330CB_15022F01_CA21.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/10678.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 第四十四届...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/10627.htm" target="_blank"><img id="u_u6_img10627" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/3/D7/7B/27AAEFE5ECA2758F004206440E3_D52CDEA2_9E3F.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/10627.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 军训风姿（...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/10581.htm" target="_blank"><img id="u_u6_img10581" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/1/EF/B5/EC9A1A13BFDE2756BAA2B6471EC_A06C8284_9744.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/10581.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 迎接新面孔...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/10460.htm" target="_blank"><img id="u_u6_img10460" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/B/74/3A/64A6CB4CD7461C01377FEFEA45B_B49BBF16_867F.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/10460.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 夏（组图）</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/10383.htm" target="_blank"><img id="u_u6_img10383" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/5/EC/BE/39741C51F145ED32B4BC2910E2A_4820E803_F039.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/10383.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 毕业季（组...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/10280.htm" target="_blank"><img id="u_u6_img10280" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/C/DB/11/AC140690FA96349F9ADA76245E1_192476E7_7AB9.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/10280.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 幼儿园的快...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/10118.htm" target="_blank"><img id="u_u6_img10118" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/__local/8/67/54/568D82C0F9E2D1E7EECCF95EB19_8584289C_1463D.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/10118.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 春（组图）</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/10053.htm" target="_blank"><img id="u_u6_img10053" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2015/04/30/_thumb/260ldsr0mm.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/10053.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 劳动者之歌...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9994.htm" target="_blank"><img id="u_u6_img9994" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2015/04/15/_thumb/21uv87m3ws.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9994.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 雨后燕园（...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9933.htm" target="_blank"><img id="u_u6_img9933" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2015/03/31/_thumb/2bnptswzp2.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9933.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 春芽（组图）</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9875.htm" target="_blank"><img id="u_u6_img9875" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2015/03/16/_thumb/3xcalc0dib.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9875.htm" target="_blank"><span class="titlestyle51316">印象燕大 • 新学期新愿...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9783.htm" target="_blank"><img id="u_u6_img9783" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/12/31/_thumb/2o8srt5pf1.jpg" width="130" height="130"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9783.htm" target="_blank"><span class="titlestyle51316">燕大四季，我们一起走过...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9714.htm" target="_blank"><img id="u_u6_img9714" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/12/09/_thumb/2fbs2ydnni.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9714.htm" target="_blank"><span class="titlestyle51316">初冬•初雪（组图）</span></a><br><br></span></td></tr>'
			+'<tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9654.htm" target="_blank"><img id="u_u6_img9654" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/11/26/_thumb/21j0ruwjjd.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9654.htm" target="_blank"><span class="titlestyle51316">第二十七届“华燕之声”...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9583.htm" target="_blank"><img id="u_u6_img9583" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/11/12/_thumb/2zwjnf3hx5.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9583.htm" target="_blank"><span class="titlestyle51316">秋韵（组图）</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9503.htm" target="_blank"><img id="u_u6_img9503" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/10/27/_thumb/3vg3d2xixw.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9503.htm" target="_blank"><span class="titlestyle51316">晨读（组图）</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9426.htm" target="_blank"><img id="u_u6_img9426" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/10/07/_thumb/2td2ez22wh.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9426.htm" target="_blank"><span class="titlestyle51316">燕山大学第43届运动会精...</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9393.htm" target="_blank"><img id="u_u6_img9393" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/09/22/_thumb/2q69asd5o8.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9393.htm" target="_blank"><span class="titlestyle51316">燕山大学2014级新生军训...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9361.htm" target="_blank"><img id="u_u6_img9361" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/09/11/_thumb/2czymb87oh.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9361.htm" target="_blank"><span class="titlestyle51316">2014年迎新中的那些瞬间...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9260.htm" target="_blank"><img id="u_u6_img9260" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/07/11/_thumb/3i26z3vjwi.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9260.htm" target="_blank"><span class="titlestyle51316">燕山大学的“大四一条街...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9128.htm" target="_blank"><img id="u_u6_img9128" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/06/16/_thumb/2nizrpgjt2.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9128.htm" target="_blank"><span class="titlestyle51316">我想对父亲说（组图）</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9126.htm" target="_blank"><img id="u_u6_img9126" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/06/16/_thumb/31e1yzre39.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9126.htm" target="_blank"><span class="titlestyle51316">燕大骑士（组图）</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/9055.htm" target="_blank"><img id="u_u6_img9055" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/06/04/_thumb/2if33ga9po.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/9055.htm" target="_blank"><span class="titlestyle51316">2014年我们毕业了（组图...</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/8827.htm" target="_blank"><img id="u_u6_img8827" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/04/24/_thumb/19dzq9ui68.jpg" width="150" height="101"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/8827.htm" target="_blank"><span class="titlestyle51316">我的燕园之春（组图）</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/8794.htm" target="_blank"><img id="u_u6_img8794" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/04/22/_thumb/2eux3r4ocp.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/8794.htm" target="_blank"><span class="titlestyle51316">西区的风景（组图）</span></a><br><br></span></td></tr><tr><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/8763.htm" target="_blank"><img id="u_u6_img8763" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/04/16/_thumb/3262kbrw6r.jpg" width="150" height="101"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/8763.htm" target="_blank"><span class="titlestyle51316">春色满燕园（组图）</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/8762.htm" target="_blank"><img id="u_u6_img8762" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/04/16/_thumb/2u2hqt6w33.jpg" width="150" height="101"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/8762.htm" target="_blank"><span class="titlestyle51316">春意闹枝头之二（组图）</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/8761.htm" target="_blank"><img id="u_u6_img8761" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/04/16/_thumb/2a7dji3w0a.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/8761.htm" target="_blank"><span class="titlestyle51316">春意闹枝头之一（组图）</span></a><br><br></span></td><td align="center" width="25%" valign="top"><table cellpadding="3" bgcolor="#f5f5f5" border="0" style="border:0px solid black;"><tbody><tr><td width="150" height="130" valign="middle" align="center"><a href="http://news.ysu.edu.cn/info/1008/8756.htm" target="_blank"><img id="u_u6_img8756" name="u_u6_img" border="0" src="http://news.ysu.edu.cn/_mediafile/news2014/2014/04/15/_thumb/2203a5x7fl.jpg" width="150" height="100"></a></td></tr></tbody></table><span><a href="http://news.ysu.edu.cn/info/1008/8756.htm" target="_blank"><span class="titlestyle51316">怒放的玉兰（组图）</span></a><br><br></span></td></tr></tbody></tbody></table></div>';
		$(".VRContent").append(str);
	}
	$(".universityViewTooltip").css("display","block");
}

function VRcloseHoverClick() {
    $(".tooltipNavTitle").html("");
    $(".VRContent").html("");
    $(".universityViewTooltip").css("display","none");
}


/**
 * 左侧点击target或者点击导航弹出
 * @returns
 * @author ZhengbinChen
 */
function navigation() {
	
	var navigationFlag = 0;
	var lifeFlag = 0;
	var activityFlag = 0;
	var propagandaFlag = 0;
	var departFlag = 0;
	var learnFlag = 0;
	var contactFlag = 0;
	
    $('.navigation').on('click', function(e) {
    	if(navigationFlag == 0) {
    		$( '#map' ).slideUp(500);
        	$( '#map' ).show(1000);
             $('.right').animate({
                    left: '50px'
                },800);
            navigationFlag = 1;
         	lifeFlag = 0;
         	activityFlag = 0;
         	propagandaFlag = 0;
         	departFlag = 0;
         	learnFlag = 0;
         	contactFlag = 0;
    	} else {
    		//$( '#map' ).hide(500);
        	//$( '#map' ).slideDown(1000);
        	$('.right').animate({
                left: '-320px'
            },800);
        	navigationFlag = 0;
    	}
    	
         $(".target").css("display","block");
        $('.lifeContent').css('display', 'none');
        $('.activityContent').css('display', 'none');
        $('.propagandaContent').css('display', 'none');
        $('.departmentContent').css('display', 'none');
        $('.learnContent').css('display', 'none');
        $('.contactContent').css('display', 'none');
        $('.navigationContent').css('display', 'block');

        $('.target> .turn_right').css('display', 'none');
        $('.target> .turn_left').css('display', 'block');

        $('.navigation').css('backgroundColor','#FFFFFF');
        $('.life').css('backgroundColor','');
        $('.activity').css('backgroundColor','');
        $('.propaganda').css('backgroundColor','');
        $('.depart').css('backgroundColor','');
        $('.learn').css('backgroundColor','');
        $('.contact').css('backgroundColor','');
    });

    $('.life').on('click', function(e) {
    	if(lifeFlag == 0) {
	    	$( '#map' ).hide(1000);
	    	$( '#map' ).fadeIn(1000);
	         $('.right').animate({
	                left: '50px'
	            },1000);
	         navigationFlag = 0;
	         	lifeFlag = 1;
	         	activityFlag = 0;
	         	propagandaFlag = 0;
	         	departFlag = 0;
	         	learnFlag = 0;
	         	contactFlag = 0;
    	} else {
    		//$( '#map' ).fadeOut(500);
        	//$( '#map' ).show(1000);
        	$('.right').animate({
                left: '-320px'
            },800);
        	lifeFlag = 0;
    	}
         $(".target").css("display","block");
        $('.navigationContent').css('display', 'none');
        $('.activityContent').css('display', 'none');
        $('.propagandaContent').css('display', 'none');
        $('.departmentContent').css('display', 'none');
        $('.learnContent').css('display', 'none');
        $('.contactContent').css('display', 'none');
        $('.lifeContent').css('display', 'block');

        $('.target> .turn_right').css('display', 'none');
        $('.target> .turn_left').css('display', 'block');

        $('.life').css('backgroundColor','#FFFFFF');
        $('.navigation').css('backgroundColor','');
        $('.activity').css('backgroundColor','');
        $('.propaganda').css('backgroundColor','');
        $('.depart').css('backgroundColor','');
        $('.learn').css('backgroundColor','');
        $('.contact').css('backgroundColor','');
    });

    $('.activity').on('click', function(e) {
    	if(activityFlag == 0) {
	    	$( '#map' ).fadeOut(500);
	    	$( '#map' ).show(1500);
	         $('.right').animate({
	                left: '50px'
	            },1300);
	         navigationFlag = 0;
	         	lifeFlag = 0;
	         	activityFlag = 1;
	         	propagandaFlag = 0;
	         	departFlag = 0;
	         	learnFlag = 0;
	         	contactFlag = 0;
    	} else {
    		//$( '#map' ).hide(500);
        	//$( '#map' ).fadeIn(1000);
        	$('.right').animate({
                left: '-320px'
            },800);
        	activityFlag = 0;
    	}
         $(".target").css("display","block");
        $('.navigationContent').css('display', 'none');
        $('.lifeContent').css('display', 'none');
        $('.propagandaContent').css('display', 'none');
        $('.departmentContent').css('display', 'none');
        $('.learnContent').css('display', 'none');
        $('.contactContent').css('display', 'none');
        $('.activityContent').css('display', 'block');

        $('.target> .turn_right').css('display', 'none');
        $('.target> .turn_left').css('display', 'block');

        $('.activity').css('backgroundColor','#FFFFFF');
        $('.life').css('backgroundColor','');
        $('.navigation').css('backgroundColor','');
        $('.propaganda').css('backgroundColor','');
        $('.depart').css('backgroundColor','');
        $('.learn').css('backgroundColor','');
        $('.contact').css('backgroundColor','');
        
        $.ajax({
            url: '/CMNS/getActivityBeanListDefault.do',
            type: 'POST',
            dataType: 'json',
            success:function(data){
                $(".activityBox ul").html("");
                for(var i = 0; i < data.length; i++) {
                    var date = data[i].publishTime.substr(8,2);
                    var monthYear = data[i].publishTime.substr(0,7);
                    var str = '<li onclick="activityPlace('+data[i].activityBuildingId+',this)">'
                                    +'<div class="xsdt-date">'
                                        +'<h3>'+date+'</h3><span>'+monthYear+'</span>'
                                    +'</div>'
                                    +'<div class="xsdt-txt">'
                                        +'<div class="xsdt-txt-1">'
                                            +'<h3>'+data[i].activityTheme+'</h3>'
                                            +'<p><img src="./img/tb-9.jpg">'+data[i].activityParticularTime+'</p>'
                                            +'<p><img src="./img/tb-10.jpg">'+data[i].activityPlace+'</p>'
                                        +'</div>'
                                    +'</div>'
                            +'</li>'
                            +'<a style="display: none;" href="'+data[i].url+'" target="_blank">原文链接</a>';
                    $(".activityBox ul").append(str);
                    str = "";
                }
            }
        });
        
        
    });

    $('.propaganda').on('click', function(e) {
    	if(propagandaFlag == 0) {
	    	$( '#map' ).fadeOut(500);
	    	$( '#map' ).slideDown(1500);
	         $('.right').animate({
	                left: '50px'
	            },1000);
	         navigationFlag = 0;
	         	lifeFlag = 0;
	         	activityFlag = 0;
	         	propagandaFlag = 1;
	         	departFlag = 0;
	         	learnFlag = 0;
	         	contactFlag = 0;
    	} else {
    		//$( '#map' ).slideUp(500);
        	//$( '#map' ).fadeIn(1000);
        	$('.right').animate({
                left: '-320px'
            },800);
        	propagandaFlag = 0;
    	}
         $(".target").css("display","block");
        $('.navigationContent').css('display', 'none');
        $('.lifeContent').css('display', 'none');
        $('.activityContent').css('display', 'none');
        $('.departmentContent').css('display', 'none');
        $('.learnContent').css('display', 'none');
        $('.contactContent').css('display', 'none');
        $('.propagandaContent').css('display', 'block');

        $('.target> .turn_right').css('display', 'none');
        $('.target> .turn_left').css('display', 'block');
        
        $('.propaganda').css('backgroundColor','#FFFFFF');
        $('.life').css('backgroundColor','');
        $('.navigation').css('backgroundColor','');
        $('.activity').css('backgroundColor','');
        $('.depart').css('backgroundColor','');
        $('.learn').css('backgroundColor','');
        $('.contact').css('backgroundColor','');
    });
    $('.depart').on('click', function(e) {
    	if(departFlag == 0) {
	    	$( '#map' ).hide(500);
	    	$( '#map' ).slideDown(1500);
	         $('.right').animate({
	                left: '50px'
	            },1000);
	         navigationFlag = 0;
	         	lifeFlag = 0;
	         	activityFlag = 0;
	         	propagandaFlag = 0;
	         	departFlag = 1;
	         	learnFlag = 0;
	         	contactFlag = 0;
    	} else {
    		//$( '#map' ).slideUp(500);
        	//$( '#map' ).show(1000);
        	$('.right').animate({
                left: '-320px'
            },800);
        	departFlag = 0;
    	}
         $(".target").css("display","block");
        $('.navigationContent').css('display', 'none');
        $('.lifeContent').css('display', 'none');
        $('.activityContent').css('display', 'none');
        $('.propagandaContent').css('display', 'none');
        $('.learnContent').css('display', 'none');
        $('.contactContent').css('display', 'none');
        $('.departmentContent').css('display', 'block');

        $('.target> .turn_right').css('display', 'none');
        $('.target> .turn_left').css('display', 'block');
        
        $('.depart').css('backgroundColor','#FFFFFF');
        $('.life').css('backgroundColor','');
        $('.navigation').css('backgroundColor','');
        $('.activity').css('backgroundColor','');
        $('.propaganda').css('backgroundColor','');
        $('.learn').css('backgroundColor','');
        $('.contact').css('backgroundColor','');
    });
    $('.learn').on('click', function(e) {
    	if(learnFlag == 0) {
	    	$( '#map' ).slideUp(500);
	    	$( '#map' ).show(1000);
	         $('.right').animate({
	                left: '50px'
	            },1200);
	         navigationFlag = 0;
	         	lifeFlag = 0;
	         	activityFlag = 0;
	         	propagandaFlag = 0;
	         	departFlag = 0;
	         	learnFlag = 1;
	         	contactFlag = 0;
    	} else {
    		//$( '#map' ).hide(500);
        	//$( '#map' ).slideDown(1000);
        	$('.right').animate({
                left: '-320px'
            },800);
        	learnFlag = 0;
    	}
         $(".target").css("display","block");
        $('.navigationContent').css('display', 'none');
        $('.lifeContent').css('display', 'none');
        $('.activityContent').css('display', 'none');
        $('.propagandaContent').css('display', 'none');
        $('.departmentContent').css('display', 'none');
        $('.contactContent').css('display', 'none');
        $('.learnContent').css('display', 'block');

        $('.target> .turn_right').css('display', 'none');
        $('.target> .turn_left').css('display', 'block');
        
        $('.learn').css('backgroundColor','#FFFFFF');
        $('.life').css('backgroundColor','');
        $('.navigation').css('backgroundColor','');
        $('.activity').css('backgroundColor','');
        $('.propaganda').css('backgroundColor','');
        $('.depart').css('backgroundColor','');
        $('.contact').css('backgroundColor','');
    });
    $('.contact').on('click', function(e) {
    	if(contactFlag == 0) {
	    	$( '#map' ).hide(500);
	    	$( '#map' ).show(1000);
	         $('.right').animate({
	                left: '50px'
	            },500);
	         navigationFlag = 0;
	         	lifeFlag = 0;
	         	activityFlag = 0;
	         	propagandaFlag = 0;
	         	departFlag = 0;
	         	learnFlag = 0;
	         	contactFlag = 1;
    	} else {
    		//$( '#map' ).hide(500);
        	//$( '#map' ).show(1000);
        	$('.right').animate({
                left: '-320px'
            },500);
        	contactFlag = 0;
    	}
         $(".target").css("display","block");
        $('.navigationContent').css('display', 'none');
        $('.lifeContent').css('display', 'none');
        $('.activityContent').css('display', 'none');
        $('.propagandaContent').css('display', 'none');
        $('.departmentContent').css('display', 'none');
        $('.learnContent').css('display', 'none');
        $('.contactContent').css('display', 'block');

        $('.target> .turn_right').css('display', 'none');
        $('.target> .turn_left').css('display', 'block');
        
        $('.contact').css('backgroundColor','#FFFFFF');
        $('.life').css('backgroundColor','');
        $('.navigation').css('backgroundColor','');
        $('.activity').css('backgroundColor','');
        $('.propaganda').css('backgroundColor','');
        $('.depart').css('backgroundColor','');
        $('.learn').css('backgroundColor','');
    });

    $(".clear").on('click', function(e) {
        document.getElementById("svg_line_group").innerHTML = "";
        document.getElementById("svg_category_group").innerHTML = "";
        //清除弹窗
        VRcloseHoverClick();
        closeHoverClick();
        
      //位置聚焦事件
		$("#content").attr("transform", "translate(0,0)scale(1)");
		Scroll("0","0",1);
		
		
    });
}

/**
 * 根据左侧箭头控制弹出情况
 * @returns
 * @author ZhengbinChen
 */
function turn() {
    $('.target').on('click', function() {
        var L = $('.right').css('left');
        if(L == '50px') {
            $('.right').animate({
                left: '-300px'
            },300);
                ;
            $('.target> .turn_right').css('display', 'block');
            $('.target> .turn_left').css('display', 'none');
        }
        if(L == '-198px') {
            $('.right').animate({
                left: '50px'
            },300);
            $('.target> .turn_right').css('display', 'none');
            $('.target> .turn_left').css('display', 'block');
        }
        $(".target").css("display","none");
    });
}

/**
 * 弹窗上的从这出发与到这里去的切换效果
 * @returns
 * @author ZhengbinChen
 */
function navigationBox() {
    $(".lineBtnBox").click(function() {
        $(".lineSearch").css("display","block");
        $(".fromToBox").css("display","block");
        $(".placeSearch").css("display","none");
        $(".searchContent").css("display","none");
    });

    $(".lineBtnBoxClose").click(function() {
        $(".lineSearch").css("display","none");
        $(".fromToBox").css("display","none");
        $(".placeSearch").css("display","block");
        $(".searchContent").css("display","none");
    });

    $(".placeSearch input").bind('input propertychange',function() {
        $(".searchContent").css("display","block");
    });

    $(".fromToBox input").bind('input propertychange',function() {
        $(".searchContent").css("display","block");
    });
}

/**
 * 活动位置定位函数，给出原文链接按钮
 * @param activityId
 * @param e
 * @returns
 * @author ZhengbinChen
 */
function activityPlace(activityId,e) {
	if(activityId == "") {
		return;
	}
	$(e).next().show(500);
	$(e).next().css("display","block");
	//调用navigation.js中的 搜素函数，并进行位置聚焦
	searchNoteByVertexId(activityId);
}
