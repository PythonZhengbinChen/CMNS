package com.cmns.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.cmns.bean.NoteSearchBean;
import com.cmns.bean.VertexBean;
import com.cmns.dao.NoteSearchDao;
import com.cmns.util.JDBCBean;

@Repository("NoteSearchDao")
public class NoteSearchDaoImpl extends JDBCBean implements NoteSearchDao {
	
	public List<NoteSearchBean> searchNoteNameByKeyString(String keyString) {
		String sql = "SELECT * FROM `cmns_noteSearch` where searchName LIKE \"%"+keyString+"%\" ORDER BY campus,sort ASC";
		List<NoteSearchBean> list = new ArrayList<NoteSearchBean>();
		super.getConnection();
		super.createStatement();
		ResultSet rs = super.executeQuery(sql);
		try {
			while(rs.next()) {
				NoteSearchBean noteSearchBean = new NoteSearchBean();
				noteSearchBean.setVertexId(rs.getString("vertexId"));
				noteSearchBean.setSearchName(rs.getString("searchName"));
				noteSearchBean.setCampus(String.valueOf(rs.getInt("campus")));
				list.add(noteSearchBean);
				noteSearchBean = null;
			}
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			super.close();
		}
		return list;
	}
	
	
	public List<VertexBean> searchVertexBeanByVertexCategory(String category) {
		String sql = "SELECT * FROM `cmns_vertexinfo` where category = "+category;
		List<VertexBean> list = new ArrayList<VertexBean>();
		super.getConnection();
		super.createStatement();
		ResultSet rs = super.executeQuery(sql);
		try {
			while(rs.next()) {
				VertexBean vertexBean = new VertexBean();
				vertexBean.setVertexId(rs.getString("vertexId"));
				vertexBean.setDescribe(rs.getString("describe"));
				vertexBean.setPositionX(rs.getString("positionX"));
				vertexBean.setPositionY(rs.getString("positionY"));
				vertexBean.setVertexName(rs.getString("vertexName"));
				vertexBean.setCategory(rs.getInt("category"));
				list.add(vertexBean);
				vertexBean = null;
			}
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			super.close();
		}
		return list;
	}
	
	
	public NoteSearchBean searchFullNoteNameByKeyString(String keyString) {
		String sql = "SELECT * FROM `cmns_noteSearch` where searchName = '"+keyString+"' ORDER BY campus ASC";
		//List<NoteSearchBean> list = new ArrayList<NoteSearchBean>();
		NoteSearchBean noteSearchBean = new NoteSearchBean();
		super.getConnection();
		super.createStatement();
		ResultSet rs = super.executeQuery(sql);
		try {
			while(rs.next()) {
				noteSearchBean.setVertexId(rs.getString("vertexId"));
				noteSearchBean.setSearchName(rs.getString("searchName"));
				noteSearchBean.setCampus(String.valueOf(rs.getInt("campus")));
			}
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			super.close();
		}
		return noteSearchBean;
	}
	
	public List<NoteSearchBean> getNoteSearchBeanByBuildingId(String buildingId) {
		String sql = "SELECT * FROM `cmns_notesearch` WHERE buildingId = '"+buildingId+"';";
		//List<NoteSearchBean> list = new ArrayList<NoteSearchBean>();
		List<NoteSearchBean> noteSearchBeanList = new ArrayList<NoteSearchBean>();
		super.getConnection();
		super.createStatement();
		ResultSet rs = super.executeQuery(sql);
		try {
			while(rs.next()) {
				NoteSearchBean noteSearchBean = new NoteSearchBean();
				noteSearchBean.setVertexId(rs.getString("vertexId"));
				noteSearchBean.setSearchName(rs.getString("searchName"));
				noteSearchBean.setDepartmentUrl(rs.getString("departmentUrl"));
				noteSearchBean.setBuildingId(rs.getString("buildingId"));
				noteSearchBean.setIntroduce(rs.getString("introduce"));
				noteSearchBean.setAddress(rs.getString("address"));
				noteSearchBeanList.add(noteSearchBean);
				noteSearchBean = null;
			}
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			super.close();
		}
		return noteSearchBeanList;
	}


	public List<NoteSearchBean> getNoteSearchBeanByCategory(String category) {
		String sql = "";
		if(Integer.valueOf(category) == 10 || Integer.valueOf(category) == 17) {
			sql = "SELECT * FROM `cmns_notesearch` WHERE category = '"+category+"' ORDER BY sort ASC;";
		} else {
			sql = "SELECT * FROM `cmns_notesearch` WHERE category = '"+category+"' ORDER BY campus,sort ASC;";
		}
		
		//List<NoteSearchBean> list = new ArrayList<NoteSearchBean>();
		List<NoteSearchBean> noteSearchBeanList = new ArrayList<NoteSearchBean>();
		super.getConnection();
		super.createStatement();
		ResultSet rs = super.executeQuery(sql);
		try {
			while(rs.next()) {
				NoteSearchBean noteSearchBean = new NoteSearchBean();
				noteSearchBean.setVertexId(rs.getString("vertexId"));
				noteSearchBean.setSearchName(rs.getString("searchName"));
				noteSearchBean.setDepartmentUrl(rs.getString("departmentUrl"));
				noteSearchBean.setBuildingId(rs.getString("buildingId"));
				noteSearchBean.setIntroduce(rs.getString("introduce"));
				noteSearchBean.setAddress(rs.getString("address"));
				noteSearchBean.setCampus(String.valueOf(rs.getInt("campus")));
				noteSearchBeanList.add(noteSearchBean);
				noteSearchBean = null;
			}
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			super.close();
		}
		return noteSearchBeanList;
	}
	
	/**
	 * <p>Title: getVertexBeanByVertexId</p>
	* <p>Description: 根据节点的编号查询节点的具体信息，包括节点描述，节点位置坐标</p>
	* <p>Company: </p> 
	* <p>return type: VertexBean</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2017-6-13
	 */
	public VertexBean getVertexBeanByVertexId(String vertexId) {
		String sql = "SELECT * FROM `cmns_vertexinfo` where vertexId = '" + vertexId +"'";
		//JDBCBean jdbcBean = new JDBCBean();
		VertexBean vertexBean = new VertexBean();
		super.getConnection();
		super.createStatement();
		ResultSet rs = super.executeQuery(sql);
		try {
			while(rs.next()) {
				vertexBean.setVertexId(vertexId);
				vertexBean.setDescribe(rs.getString("describe"));
				vertexBean.setPositionX(rs.getString("positionX"));
				vertexBean.setPositionY(rs.getString("positionY"));
				vertexBean.setVertexName(rs.getString("vertexName"));
				vertexBean.setCategory(rs.getInt("category"));
			}
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
			return null;
		} finally {
			super.close();
		}
		return vertexBean;
	}
	
}
