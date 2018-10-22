package com.cmns.dao;

import java.util.List;

import com.cmns.bean.ActivityBean;

public interface ActivityInfoDao {
	public void setActivityInfo(ActivityBean activityBean);				//存储活动信息
	public List<ActivityBean> getActivityListDefault(String date);		//默认获取活动时间是当前日期以后的
	public List<ActivityBean> getActivityListByStartAndEnd(int start,int end);	//根据起止位置返回活动信息列表
	public void changeActivityToPassById(String activityId,String activityFlag);//对活动信息进行审核结果修改
	public void deleteActivityById(String activityId);				//根据活动id删除对应活动信息
	public List<ActivityBean> getAllActivityList();					//获取数据库中所有活动信息列表
	public void updateActivityById(ActivityBean activityBean);		//更新活动信息
	public String loginCheck(String adminName,String adminPassword);	
}
