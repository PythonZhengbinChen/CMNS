package com.cmns.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.cmns.bean.VertexBean;
import com.cmns.util.JDBCBean;


/**
 * <p>Title: VertexInfoDaoImpl</p>
* <p>Description: 节点信息数据库操作类</p>
* <p>Company: YSU</p> 
* @author ZhengbinChen 
* @date 2017-6-13 下午3:07:14
**
 */
@Service
public class VertexInfoDaoImpl extends JDBCBean {
	/**
	 * 节点集合存放内存
	 */
	public static String[] vertexList;
	
	/**
	 * <p>Title: initVertexList</p>
	* <p>Description: 节点集合初始化</p>
	* <p>Company: </p> 
	* <p>return type: void</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2017-6-13
	 */
	public static void initVertexList() {
		vertexList = null;
		String sql = "SELECT * FROM `cmns_vertexinfo`";
		JDBCBean jdbcBean = new JDBCBean();
		List<String> list = new ArrayList<String>();
		jdbcBean.getConnection();
		jdbcBean.createStatement();
		ResultSet rs = jdbcBean.executeQuery(sql);
		try {
			while(rs.next()) {
				list.add(rs.getString("vertexId"));
			}
			vertexList = list.toArray(new String[list.size()]);
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			jdbcBean.close();
			jdbcBean = null;
			list = null;
		}
	}
	
	/**
	 * <p>Title: updateVertexList</p>
	* <p>Description: 主动更新节点集合操作</p>
	* <p>Company: </p> 
	* <p>return type: void</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2017-6-13
	 */
	public void updateVertexList() {
		vertexList = null;
		String sql = "SELECT * FROM `cmns_vertexinfo`";
		//JDBCBean jdbcBean = new JDBCBean();
		List<String> list = new ArrayList<String>();
		super.getConnection();
		super.createStatement();
		ResultSet rs = super.executeQuery(sql);
		try {
			while(rs.next()) {
				list.add(rs.getString("vertexId"));
			}
			vertexList = list.toArray(new String[list.size()]);
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			super.close();
			list = null;
		}
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
				vertexBean.setTranslateX(rs.getString("translateX"));
				vertexBean.setTranslateY(rs.getString("translateY"));
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
