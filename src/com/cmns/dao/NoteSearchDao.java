package com.cmns.dao;

import java.util.List;

import com.cmns.bean.NoteSearchBean;
import com.cmns.bean.VertexBean;

public interface NoteSearchDao {
	public List<NoteSearchBean> searchNoteNameByKeyString(String keyString);	//根据用户键盘输入的信息进行模糊搜索
	public List<VertexBean> searchVertexBeanByVertexCategory(String category);	//根据节点类别搜索，返回节点列表
	public NoteSearchBean searchFullNoteNameByKeyString(String keyString);		//搜索用户输入信息对应的完整节点信息
	public List<NoteSearchBean> getNoteSearchBeanByBuildingId(String buildingId);	//有建筑id搜索建筑内所有的节点信息列表
	public List<NoteSearchBean> getNoteSearchBeanByCategory(String category);	//根据节点类别搜索，返回节点搜索列表
	public VertexBean getVertexBeanByVertexId(String vertexId);					//由节点id查找对应节点信息
}
