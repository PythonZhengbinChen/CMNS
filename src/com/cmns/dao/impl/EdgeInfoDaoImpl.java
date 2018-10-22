package com.cmns.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.cmns.dao.EdgeInfoDao;
import com.cmns.util.JDBCBean;


/**
 * <p>Title: EdgeInfoDaoImpl</p>
* <p>Description: 边集数据库查询类</p>
* <p>Company: YSU</p> 
* @author ZhengbinChen 
* @date 2017-6-13 下午3:04:18
**
 */

@Repository("EdgeInfoDao")
public class EdgeInfoDaoImpl extends JDBCBean implements EdgeInfoDao {
	/**
	 * 用于将边集信息存在的内容中就不需要每次线程都开辟空间
	 */
	public static String[] edgeList;
	
	/**
	 * <p>Title: initEdgeList</p>
	* <p>Description: 边集初始化操作，从数据库cmns_edgeinfo表中读取边的信息</p>
	* <p>Company: </p> 
	* <p>return type: void</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2017-6-13
	 */
	public void initEdgeList(String category) {
		edgeList = null;
		String sql = null;
		if(category.equals("1"))
			sql = "SELECT * FROM `cmns_edgeinfo` where category = '"+category+"' ";
		else
			sql = "SELECT * FROM `cmns_edgeinfo` ";
		JDBCBean jdbcBean = new JDBCBean();
		List<String> list = new ArrayList<String>();
		jdbcBean.getConnection();
		jdbcBean.createStatement();
		ResultSet rs = jdbcBean.executeQuery(sql);
		try {
			while(rs.next()) {
				list.add(rs.getString("fromVertex"));
				list.add(rs.getString("toVertex"));
				if(category.equals("1"))
					list.add(rs.getString("driveEdgeWeight"));
				else
					list.add(rs.getString("walkEdgeWeight"));
			}
			edgeList = list.toArray(new String[list.size()]);
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
	 * <p>Title: updateEdgeList</p>
	* <p>Description: 主动更新编辑操作</p>
	* <p>Company: </p> 
	* <p>return type: void</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2017-6-13
	 */
	public void updateEdgeList(String category) {
		edgeList = null;
		String sql = null;
		if(category.equals("1"))
			sql = "SELECT * FROM `cmns_edgeinfo` where category = '"+category+"' ";
		else
			sql = "SELECT * FROM `cmns_edgeinfo` ";
		//JDBCBean jdbcBean = new JDBCBean();
		List<String> list = new ArrayList<String>();
		super.getConnection();
		super.createStatement();
		ResultSet rs = super.executeQuery(sql);
		try {
			while(rs.next()) {
				list.add(rs.getString("fromVertex"));
				list.add(rs.getString("toVertex"));
				if(category.equals("1"))
					list.add(rs.getString("driveEdgeWeight"));
				else
					list.add(rs.getString("walkEdgeWeight"));
			}
			edgeList = list.toArray(new String[list.size()]);
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			super.close();
			list = null;
		}
	}

}
