package com.cmns.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.stereotype.Repository;

import com.cmns.bean.BuildingBean;
import com.cmns.dao.BuildingInfoDao;
import com.cmns.util.JDBCBean;

@Repository("BuildingInfoDao")
public class BuildingInfoDaoImpl extends JDBCBean implements BuildingInfoDao {
	public BuildingBean getBuildingInfoByBuildingId(String buildingId) {
		String sql = "SELECT * FROM `cmns_building` WHERE buildingId = '"+buildingId+"'";
		BuildingBean buildingBean = new BuildingBean();
		super.getConnection();
		super.createStatement();
		ResultSet rs = super.executeQuery(sql);
		try {
			while(rs.next()) {
				buildingBean.setBuildingId(buildingId);
				buildingBean.setName(rs.getString("name"));
				buildingBean.setAddress(rs.getString("address"));
				buildingBean.setDefaultPointId(rs.getString("defaultPointId"));
				buildingBean.setIntroduce(rs.getString("introduce"));
			}
			rs.close();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			
			super.close();
		}
		NoteSearchDaoImpl noteSearchDaoImpl = new NoteSearchDaoImpl();
		buildingBean.setNoteSearchBean(noteSearchDaoImpl.getNoteSearchBeanByBuildingId(buildingId));	
		return buildingBean;
	}
}
