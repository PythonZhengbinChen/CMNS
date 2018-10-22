package com.cmns.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.cmns.bean.ActivityBean;
import com.cmns.dao.ActivityInfoDao;
import com.cmns.util.JDBCBean;

@Repository("ActivityInfoDao")
public class ActivityInfoDaoImpl extends JDBCBean implements ActivityInfoDao {

	/**
	 * * <p>Title: setActivityInfo</p>
	* <p>Description: 插入活动信息记录操作</p>
	* <p>Company: YSU</p> 
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-23 上午10:16:13
	 */
	public void setActivityInfo(ActivityBean activityBean) {
		String sql = "INSERT INTO cmns_activity (activityId,activityTheme,publishTime,activityTime,activityParticularTime,activityPlace,activityBuildingId,activityDepartment,contactEmail,url,activityFlag) VALUES ('"
			+activityBean.getActivityId()+"', '"+activityBean.getActivityTheme()+"', '"
			+activityBean.getPublishTime()+"', '"+activityBean.getActivityTime()+"', '"
			+activityBean.getActivityParticularTime()+"', '"+activityBean.getActivityPlace()+"', '"
			+activityBean.getActivityBuildingId()+"', '"+activityBean.getActivityDepartment()+"', '"
			+activityBean.getContactEmail()+"', '"+activityBean.getUrl()+"', '"+activityBean.getActivityFlag()+"')";
		super.getConnection();
		super.createStatement();
		super.executeUpdate(sql);
		super.close();
	}

	/**
	 * * <p>Title: getActivityListDefault</p>
	* <p>Description: 默认获取活动时间是在今日之后的活动</p>
	* <p>Company: YSU</p> 
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-23 上午10:33:43
	 */
	public List<ActivityBean> getActivityListDefault(String date) {
		String sql = "SELECT * FROM `cmns_activity` WHERE activityTime > '"+date+"' AND activityFlag = '1' ORDER BY publishTime DESC";
		super.getConnection();
		super.createStatement();
		ResultSet rs = super.executeQuery(sql);
		List<ActivityBean> activityBeanList = new ArrayList<ActivityBean>();
		try {
			while(rs.next()) {
				ActivityBean activity = new ActivityBean();
				activity.setActivityId(rs.getString("activityId"));
				activity.setActivityTheme(rs.getString("activityTheme"));
				activity.setPublishTime(rs.getString("publishTime"));
				activity.setActivityTime(rs.getString("activityTime"));
				activity.setActivityParticularTime(rs.getString("activityParticularTime"));
				activity.setActivityPlace(rs.getString("activityPlace"));
				activity.setActivityBuildingId(rs.getString("activityBuildingId"));
				activity.setActivityDepartment(rs.getString("activityDepartment"));
				activity.setContactEmail(rs.getString("contactEmail"));
				activity.setActivityFlag(rs.getString("activityFlag"));
				activity.setUrl(rs.getString("url"));
				activityBeanList.add(activity);
				activity = null;
			}
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			super.close();
		}
		return activityBeanList;
	}

	/**
	 * * <p>Title: getActivityListByStartAndEnd</p>
	* <p>Description: 分页查询操作，默认每页为20条</p>
	* <p>Company: YSU</p> 
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-23 上午10:36:46
	 */
	public List<ActivityBean> getActivityListByStartAndEnd(int start, int end) {
		String sql = "SELECT * FROM `cmns_activity` LIMIT "+start+","+end +" ORDER BY publishTime DESC";
		super.getConnection();
		super.createStatement();
		ResultSet rs = super.executeQuery(sql);
		List<ActivityBean> activityBeanList = new ArrayList<ActivityBean>();
		try {
			while(rs.next()) {
				ActivityBean activity = new ActivityBean();
				activity.setActivityId(rs.getString("activityId"));
				activity.setActivityTheme(rs.getString("activityTheme"));
				activity.setPublishTime(rs.getString("publishTime"));
				activity.setActivityTime(rs.getString("activityTime"));
				activity.setActivityParticularTime(rs.getString("activityParticularTime"));
				activity.setActivityPlace(rs.getString("activityPlace"));
				activity.setActivityBuildingId(rs.getString("activityBuildingId"));
				activity.setActivityDepartment(rs.getString("activityDepartment"));
				activity.setContactEmail(rs.getString("contactEmail"));
				activity.setActivityFlag(rs.getString("activityFlag"));
				activity.setUrl(rs.getString("url"));
				activityBeanList.add(activity);
				activity = null;
			}
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			super.close();
		}
		return activityBeanList;
	}

	/**
	 * * <p>Title: changeActivityToPassById</p>
	* <p>Description: 审核结果设置</p>
	* <p>Company: YSU</p> 
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-23 上午10:46:20
	 */
	public void changeActivityToPassById(String activityId,String activityFlag) {
		String sql = "UPDATE cmns_activity SET activityFlag = "+activityFlag+" WHERE activityId = '"+activityId+"'";
			super.getConnection();
			super.createStatement();
			super.executeUpdate(sql);
			super.close();
	}

	/**
	 * * <p>Title: deleteActivityById</p>
	* <p>Description: 记录山删除</p>
	* <p>Company: YSU</p> 
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-23 上午10:46:58
	 */
	public void deleteActivityById(String activityId) {
		String sql = "DELETE FROM cmns_activity WHERE activityId = '"+activityId+"'";
		super.getConnection();
		super.createStatement();
		super.executeUpdate(sql);
		super.close();
	}

	public List<ActivityBean> getAllActivityList() {
		String sql = "SELECT * FROM `cmns_activity` ORDER BY publishTime DESC";
		super.getConnection();
		super.createStatement();
		ResultSet rs = super.executeQuery(sql);
		List<ActivityBean> activityBeanList = new ArrayList<ActivityBean>();
		try {
			while(rs.next()) {
				ActivityBean activity = new ActivityBean();
				activity.setActivityId(rs.getString("activityId"));
				activity.setActivityTheme(rs.getString("activityTheme"));
				activity.setPublishTime(rs.getString("publishTime"));
				activity.setActivityTime(rs.getString("activityTime"));
				activity.setActivityParticularTime(rs.getString("activityParticularTime"));
				activity.setActivityPlace(rs.getString("activityPlace"));
				activity.setActivityBuildingId(rs.getString("activityBuildingId"));
				activity.setActivityDepartment(rs.getString("activityDepartment"));
				activity.setContactEmail(rs.getString("contactEmail"));
				activity.setActivityFlag(rs.getString("activityFlag"));
				activity.setUrl(rs.getString("url"));
				activityBeanList.add(activity);
				activity = null;
			}
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			super.close();
		}
		return activityBeanList;
	}

	public void updateActivityById(ActivityBean activityBean) {
		String sql = "UPDATE cmns_activity SET activityTheme = '"+activityBean.getActivityTheme()+"' ,publishTime = '"
	+activityBean.getPublishTime()+"',activityTime = '"+activityBean.getActivityTime()+"',activityParticularTime = '"
				+activityBean.getActivityParticularTime()+"',activityPlace = '"+activityBean.getActivityPlace()+"',activityBuildingId = '"
				+activityBean.getActivityBuildingId()+"',activityDepartment = '"+activityBean.getActivityDepartment()+"',contactEmail = '"
				+activityBean.getContactEmail()+"',url = '"+activityBean.getUrl()+"',activityFlag = '"+activityBean.getActivityFlag()+"' WHERE activityId ='"
				+activityBean.getActivityId()+"'";
			super.getConnection();
			super.createStatement();
			super.executeUpdate(sql);
			super.close();
		
	}

	/**
	 * * <p>Title: loginCheck</p>
	* <p>Description: 管理员登录</p>
	* <p>Company: YSU</p> 
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2018-4-25 上午10:12:10
	 */
	public String loginCheck(String adminName, String adminPassword) {
		String sql = "SELECT * FROM `cmns_admin` WHERE adminName = '"+adminName+"'";
		String result = "用户不存在";
		super.getConnection();
		super.createStatement();
		ResultSet rs = super.executeQuery(sql);
		try {
			while(rs.next()) {
				if(rs.getString("adminPassword").equals(adminPassword)) {
					result = "success";
				} else {
					result = "密码错误";
				}
			}
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			super.close();
		}
		
		return result;
	}

}
