package com.cmns.service;

import java.util.List;

import com.cmns.bean.ActivityBean;

public interface ActivityInfoService {
	public void setActivityInfo(ActivityBean activityBean);
	public List<ActivityBean> getActivityListDefault();		//默认获取活动时间是当前日期以后的
	public List<ActivityBean> getActivityListByCurrentPage(String currentPage);
	public void changeActivityToPassById(String activityId,String activityFlag);
	public void deleteActivityById(String activityId);
	public List<ActivityBean> getAllActivityList();
	public void updateActivityById(ActivityBean activityBean);
	public String loginCheck(String adminName,String adminPassword);
}
