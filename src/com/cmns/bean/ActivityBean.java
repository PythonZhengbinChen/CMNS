package com.cmns.bean;

public class ActivityBean {
	private String activityId;		//活动Id
	private String activityTheme;	//活动主题
	private String publishTime;		//活动发布时间
	private String activityTime;	//活动举行时间标记（年月日）
	private String activityParticularTime;	//活动具体时间（精确的到点时）
	private String activityPlace;	//活动举办地点
	private String activityBuildingId;	//活动举办地点的id
	private String activityDepartment;	//活动举办单位
	private String contactEmail;		//联系邮箱
	private String activityFlag;		//是否审核通过  默认提交为0未审核，1为通过
	private String url;					//原文链接
	
	public String getActivityId() {
		return activityId;
	}
	public void setActivityId(String activityId) {
		this.activityId = activityId;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getActivityTheme() {
		return activityTheme;
	}
	public void setActivityTheme(String activityTheme) {
		this.activityTheme = activityTheme;
	}
	public String getPublishTime() {
		return publishTime;
	}
	public void setPublishTime(String publishTime) {
		this.publishTime = publishTime;
	}
	public String getActivityTime() {
		return activityTime;
	}
	public void setActivityTime(String activityTime) {
		this.activityTime = activityTime;
	}
	public String getActivityParticularTime() {
		return activityParticularTime;
	}
	public void setActivityParticularTime(String activityParticularTime) {
		this.activityParticularTime = activityParticularTime;
	}
	public String getActivityPlace() {
		return activityPlace;
	}
	public void setActivityPlace(String activityPlace) {
		this.activityPlace = activityPlace;
	}
	public String getActivityBuildingId() {
		return activityBuildingId;
	}
	public void setActivityBuildingId(String activityBuildingId) {
		this.activityBuildingId = activityBuildingId;
	}
	public String getActivityDepartment() {
		return activityDepartment;
	}
	public void setActivityDepartment(String activityDepartment) {
		this.activityDepartment = activityDepartment;
	}
	public String getContactEmail() {
		return contactEmail;
	}
	public void setContactEmail(String contactEmail) {
		this.contactEmail = contactEmail;
	}
	public String getActivityFlag() {
		return activityFlag;
	}
	public void setActivityFlag(String activityFlag) {
		this.activityFlag = activityFlag;
	}
	
}
