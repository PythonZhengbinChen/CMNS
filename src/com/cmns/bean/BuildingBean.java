package com.cmns.bean;

import java.util.List;

/**
 * <p>Title: BuildingBean</p>
* <p>Description: </p>
* <p>Company: YSU</p> 
* @author ZhengbinChen 
* @date 2018-4-12 上午10:35:49
**
 */
public class BuildingBean {
	private String buildingId;		//建筑id
	private String name;			//建筑名称
	private String address;			//建筑所在地址
	private String introduce;		//建筑介绍
	private String defaultPointId;	//默认节点id
	private List<NoteSearchBean> noteSearchBean;	//建筑内节点列表
	
	
	public String getBuildingId() {
		return buildingId;
	}
	public void setBuildingId(String buildingId) {
		this.buildingId = buildingId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getIntroduce() {
		return introduce;
	}
	public void setIntroduce(String introduce) {
		this.introduce = introduce;
	}
	public String getDefaultPointId() {
		return defaultPointId;
	}
	public void setDefaultPointId(String defaultPointId) {
		this.defaultPointId = defaultPointId;
	}
	public List<NoteSearchBean> getNoteSearchBean() {
		return noteSearchBean;
	}
	public void setNoteSearchBean(List<NoteSearchBean> noteSearchBean) {
		this.noteSearchBean = noteSearchBean;
	}
	
}
