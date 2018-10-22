package com.cmns.bean;

public class NoteSearchBean {
	private String vertexId;		//节点id
	private String searchName;		//搜索输入的名称
	private String departmentUrl;	//所在部门官网URL
	private String buildingId;		//所属建筑id
	private String introduce;		//节点信息介绍(主要用户部门介绍)
	private String address;			//节点所在地址
	private String positionX;		//节点聚焦X轴偏移
	private String positionY;		//节点聚焦Y轴偏移
	private String campus;			//节点所属校区
	
	public String getVertexId() {
		return vertexId;
	}
	public void setVertexId(String vertexId) {
		this.vertexId = vertexId;
	}
	public String getSearchName() {
		return searchName;
	}
	public void setSearchName(String searchName) {
		this.searchName = searchName;
	}
	public String getDepartmentUrl() {
		return departmentUrl;
	}
	public void setDepartmentUrl(String departmentUrl) {
		this.departmentUrl = departmentUrl;
	}
	public String getBuildingId() {
		return buildingId;
	}
	public void setBuildingId(String buildingId) {
		this.buildingId = buildingId;
	}
	public String getIntroduce() {
		return introduce;
	}
	public void setIntroduce(String introduce) {
		this.introduce = introduce;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getPositionX() {
		return positionX;
	}
	public void setPositionX(String positionX) {
		this.positionX = positionX;
	}
	public String getPositionY() {
		return positionY;
	}
	public void setPositionY(String positionY) {
		this.positionY = positionY;
	}
	public String getCampus() {
		return campus;
	}
	public void setCampus(String campus) {
		this.campus = campus;
	}
	
}
