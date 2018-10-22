package com.cmns.dao;

import com.cmns.bean.BuildingBean;

public interface BuildingInfoDao {
	public BuildingBean getBuildingInfoByBuildingId(String buildingId);		//根据建筑id查找建筑信息
}
