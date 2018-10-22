package com.cmns.bean;

/**
 * <p>Title: VertexBean</p>
* <p>Description: 节点实体类</p>
* <p>Company: YSU</p> 
* @author ZhengbinChen 
* @date 2017-6-13 下午3:09:22
**
 */
public class VertexBean {
	private String vertexId;	//节点id
	private String describe;	//节点描述
	private String positionX;	//节点在SVG中的X坐标
	private String positionY;	//节点在SVG中的Y坐标
	private String vertexName;	//节点名称
	private int category;		//节点类型
	private String translateX;	//节点聚焦X轴偏移
	private String translateY;	//节点聚焦Y轴偏移
	
	public String getVertexName() {
		return vertexName;
	}
	public void setVertexName(String vertexName) {
		this.vertexName = vertexName;
	}
	public String getVertexId() {
		return vertexId;
	}
	public void setVertexId(String vertexId) {
		this.vertexId = vertexId;
	}
	public String getDescribe() {
		return describe;
	}
	public void setDescribe(String describe) {
		this.describe = describe;
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
	public int getCategory() {
		return category;
	}
	public void setCategory(int category) {
		this.category = category;
	}
	public String getTranslateX() {
		return translateX;
	}
	public void setTranslateX(String translateX) {
		this.translateX = translateX;
	}
	public String getTranslateY() {
		return translateY;
	}
	public void setTranslateY(String translateY) {
		this.translateY = translateY;
	}

}
