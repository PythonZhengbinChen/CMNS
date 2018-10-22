package com.cmns.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.cmns.bean.ActivityBean;
import com.cmns.dao.ActivityInfoDao;
import com.cmns.service.ActivityInfoService;

@Service("ActivityInfoService")
public class ActivityInfoServiceImpl implements ActivityInfoService {
	@Resource(name = "ActivityInfoDao")
	private ActivityInfoDao activityInfoDao;

	public void setActivityInfo(ActivityBean activityBean) {
		activityInfoDao.setActivityInfo(activityBean);
	}

	public List<ActivityBean> getActivityListDefault() {
		Date day=new Date();    
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd"); 
		String date = df.format(day);
		return activityInfoDao.getActivityListDefault(date);
	}

	public List<ActivityBean> getActivityListByCurrentPage(String currentPage) {
		int start = Integer.valueOf(currentPage) * 20;
		int end = start + 20;
		return activityInfoDao.getActivityListByStartAndEnd(start, end);
	}

	public void changeActivityToPassById(String activityId,String activityFlag) {
		activityInfoDao.changeActivityToPassById(activityId,activityFlag);
	}

	public void deleteActivityById(String activityId) {
		activityInfoDao.deleteActivityById(activityId);
	}

	public List<ActivityBean> getAllActivityList() {
		return activityInfoDao.getAllActivityList();
	}

	public void updateActivityById(ActivityBean activityBean) {
		activityInfoDao.updateActivityById(activityBean);
	}

	public String loginCheck(String adminName, String adminPassword) {
		return activityInfoDao.loginCheck(adminName, adminPassword);
	}

}
