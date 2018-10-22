package com.cmns.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.cmns.bean.BuildingBean;
import com.cmns.dao.BuildingInfoDao;
import com.cmns.service.BuildingInfoService;

@Service("BuildingInfoService")
public class BuildingInfoServiceImpl implements BuildingInfoService {
	@Resource(name = "BuildingInfoDao")
	private BuildingInfoDao buildingInfoDao;
	
	public BuildingBean getBuildingInfoByBuildingId(String buildingId) {
		return buildingInfoDao.getBuildingInfoByBuildingId(buildingId);
	}

}
