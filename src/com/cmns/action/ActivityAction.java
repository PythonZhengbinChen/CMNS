package com.cmns.action;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cmns.bean.ActivityBean;
import com.cmns.service.ActivityInfoService;
import com.cmns.util.SentEmailUtil;

@Controller("ActivityAction")
public class ActivityAction {
	@Resource(name="ActivityInfoService")
	private ActivityInfoService activityInfoService;
	
	/**
	 * <p>Title: setActivityBeanInfo</p>
	* <p>Description: 插入活动记录，默认为审核</p>
	* <p>Company: </p> 
	* <p>return type: void</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-23
	 */
	@RequestMapping(value="setActivityBeanInfo.do",method=RequestMethod.POST)
	@ResponseBody
	public void setActivityBeanInfo(HttpServletRequest request, HttpServletResponse response,
			@RequestParam("activityTheme") String activityTheme,@RequestParam("activityTime") String activityTime,
			@RequestParam("activityParticularTime") String activityParticularTime,@RequestParam("activityPlace") String activityPlace,
			@RequestParam("activityBuildingId") String activityBuildingId,@RequestParam("activityDepartment") String activityDepartment,
			@RequestParam("contactEmail") String contactEmail,@RequestParam("url") String url) {
		ActivityBean activityBean = new ActivityBean();
		activityBean.setActivityId(this.getActivityId(activityTime));
		activityBean.setActivityTheme(activityTheme);
		activityBean.setActivityTime(activityTime);
		activityBean.setActivityParticularTime(activityParticularTime);
		activityBean.setActivityPlace(activityPlace);
		activityBean.setActivityDepartment(activityDepartment);
		activityBean.setActivityBuildingId(activityBuildingId);
		activityBean.setContactEmail(contactEmail);
		activityBean.setUrl(url);
		activityBean.setPublishTime(this.getToday());
		activityBean.setActivityFlag("0");
		activityInfoService.setActivityInfo(activityBean);
		System.out.println(activityTheme+"/"+activityTime+"活动信息提交成功，待审核。");
	}
	
	
	/**
	 * <p>Title: getActivityBeanListDefault</p>
	* <p>Description: 首页右侧活动，默认获取的是当前时间之后的活动</p>
	* <p>Company: </p> 
	* <p>return type: List<ActivityBean></p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-23
	 */
	@RequestMapping(value="getActivityBeanListDefault.do",method=RequestMethod.POST)
	@ResponseBody
	public List<ActivityBean> getActivityBeanListDefault(HttpServletRequest request,HttpServletResponse response) {
		return activityInfoService.getActivityListDefault();
	}
	
	/**
	 * <p>Title: getAllActivityBeanList</p>
	* <p>Description: 获取活动信息的所有列表</p>
	* <p>Company: </p> 
	* <p>return type: List<ActivityBean></p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-24
	 */
	@RequestMapping(value="getAllActivityBeanList.do",method=RequestMethod.POST)
	@ResponseBody
	public List<ActivityBean> getAllActivityBeanList(HttpServletRequest request,HttpServletResponse response) {
		return activityInfoService.getAllActivityList();
	}
	
	/**
	 * <p>Title: updateActivityBeanInfo</p>
	* <p>Description: 更新活动信息</p>
	* <p>Company: </p> 
	* <p>return type: void</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-24
	 */
	@RequestMapping(value="updateActivityBeanInfo.do",method=RequestMethod.POST)
	@ResponseBody
	public void updateActivityBeanInfo(HttpServletRequest request, HttpServletResponse response,
			@RequestParam("activityId") String activityId,@RequestParam("activityTheme") String activityTheme,
			@RequestParam("publishTime") String publishTime,@RequestParam("activityTime") String activityTime,
			@RequestParam("activityParticularTime") String activityParticularTime,@RequestParam("activityPlace") String activityPlace,
			@RequestParam("activityBuildingId") String activityBuildingId,@RequestParam("activityDepartment") String activityDepartment,
			@RequestParam("contactEmail") String contactEmail,@RequestParam("url") String url,@RequestParam("activityFlag") String activityFlag) {
		ActivityBean activityBean = new ActivityBean();
		activityBean.setActivityId(activityId);
		activityBean.setActivityTheme(activityTheme);
		activityBean.setActivityTime(activityTime);
		activityBean.setActivityParticularTime(activityParticularTime);
		activityBean.setActivityPlace(activityPlace);
		activityBean.setActivityDepartment(activityDepartment);
		activityBean.setActivityBuildingId(activityBuildingId);
		activityBean.setContactEmail(contactEmail);
		activityBean.setUrl(url);
		activityBean.setPublishTime(publishTime);
		activityBean.setActivityFlag(activityFlag);
		activityInfoService.updateActivityById(activityBean);
		System.out.println(activityTheme+"/"+activityTime+"活动信息更新成功，待审核。");
	}
	
	/**
	 * <p>Title: deleteActivityBeanInfo</p>
	* <p>Description: 根据id删除活动信息</p>
	* <p>Company: </p> 
	* <p>return type: void</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-24
	 */
	@RequestMapping(value="deleteActivityBeanInfo.do",method=RequestMethod.POST)
	@ResponseBody
	public void deleteActivityBeanInfo(HttpServletRequest request,HttpServletResponse response,
			@RequestParam("activityId") String activityId) {
		activityInfoService.deleteActivityById(activityId);
		System.out.println(activityId+"活动信息删除成功。");
	}
	
	/**
	 * <p>Title: auditingPassOrDispassEvent</p>
	* <p>Description: 进行审核操作，根据不同情况给对应邮箱发送邮件</p>
	* <p>Company: </p> 
	* <p>return type: void</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-24
	 */
	@RequestMapping(value="auditingPassOrDispassEvent.do",method=RequestMethod.POST)
	@ResponseBody
	public void auditingPassOrDispassEvent(HttpServletRequest request,HttpServletResponse response,
			@RequestParam("activityId") String activityId,@RequestParam("activityFlag") String activityFlag,
			@RequestParam("contactEmail") String contactEmail,@RequestParam("activityDepartment") String activityDepartment,
			@RequestParam("acitvityTheme") String acitvityTheme) {
		activityInfoService.changeActivityToPassById(activityId, activityFlag);
		System.out.println(acitvityTheme+"活动信息审核成功。"+activityFlag);
		
		if(activityFlag.equals("1")) {
			String massageContent = "尊敬的"+activityDepartment+"，您好！<br/><br/> &nbsp;&nbsp;&nbsp;&nbsp;您提交的主题为：\""+acitvityTheme+"\"的活动审核通过，您可以通过访问http://localhost:8080/CMNS/index.html 查看。<br/><br/>燕山大学E校园电子地图平台";
			System.out.println(massageContent);
			try {
				SentEmailUtil.sendMassage(contactEmail, activityDepartment, massageContent);
				System.out.println(acitvityTheme+"活动信息审核通过，邮件发送成功。");
			} catch (Exception e) {
				e.printStackTrace();
				System.out.println(acitvityTheme+"活动信息审核通过，邮件发送失败。");
			}
			
		}else if(activityFlag.equals("2")) {
			String massageContent = "尊敬的"+activityDepartment+"，您好！<br/><br/>  &nbsp;&nbsp;&nbsp;&nbsp;您提交的主题为：\""+acitvityTheme+"\"的活动审核不通过，可能由于您提交的信息不够充分或不符合规定，请访问http://localhost:8080/CMNS/activitySubmit.html 再次提交。<br/><br/>燕山大学E校园电子地图平台";
			try {
				SentEmailUtil.sendMassage(contactEmail, activityDepartment, massageContent);
				System.out.println(acitvityTheme+"活动信息审核不通过，邮件发送成功。");
			} catch (Exception e) {
				e.printStackTrace();
				System.out.println(acitvityTheme+"活动信息审核不通过，邮件发送失败。");
			}
		}
	}
	
	/**
	 * <p>Title: adminLoginCheck</p>
	* <p>Description: 管理员登录检测</p>
	* <p>Company: </p> 
	* <p>return type: String</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-25
	 */
	@RequestMapping(value="adminLoginCheck.do",method=RequestMethod.POST)
	@ResponseBody
	public String adminLoginCheck(HttpServletRequest request,HttpServletResponse response,
			@RequestParam("adminName") String adminName,@RequestParam("adminPassword") String adminPassword) {
		String result = activityInfoService.loginCheck(adminName, adminPassword);
		if(result.equals("success")) {
			System.out.println(adminName+"管理员成功登录！");
			HttpSession session = request.getSession();
			session.setAttribute("adminName", adminName);
			return result;
		}else {
			return result;
		}
	}
	
	/**
	 * <p>Title: checkAdminSession</p>
	* <p>Description: 活动管理页面拦截</p>
	* <p>Company: </p> 
	* <p>return type: boolean</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-25
	 */
	@RequestMapping(value="checkAdminSession.do",method=RequestMethod.POST)
	@ResponseBody
	public boolean checkAdminSession(HttpServletRequest request,HttpServletResponse response) {
		HttpSession session = request.getSession();
		String adminName = "";
		adminName = (String) session.getAttribute("adminName");
		try {
			if(!adminName.equals("") || adminName != null) {
				return true;
			}else {
				return false;
			}
		} catch (Exception e) {
			return false;
		}
	}
	
	/**
	 * <p>Title: adminQuit</p>
	* <p>Description: 管理员退出</p>
	* <p>Company: </p> 
	* <p>return type: void</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-25
	 */
	@RequestMapping(value="adminQuit.do",method=RequestMethod.GET)
	@ResponseBody
	public void adminQuit(HttpServletRequest request,HttpServletResponse response) {
		HttpSession session = request.getSession();
		session.removeAttribute("adminName");
		try {
			response.sendRedirect("/CMNS/index.html");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	
	
	
	
	
	
	
	/**
	 * <p>Title: getToday</p>
	* <p>Description: 时间工具方法</p>
	* <p>Company: </p> 
	* <p>return type: String</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-23
	 */
	private String getToday() {
		Date day=new Date();    
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		return df.format(day);
	}
	
	/**
	 * <p>Title: getActivityId</p>
	* <p>Description: 获取唯一的id，将当前时间+活动时间：2018042311175920180405</p>
	* <p>Company: </p> 
	* <p>return type: String</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-23
	 */
	private String getActivityId(String activityTime) {
		String[] datas = activityTime.split("-");
		String date = "";
		for(String data:datas) {
			date += data;
		}
		Date day=new Date();    
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
		return df.format(day) + date;
	}

}
