package com.cmns.service.impl;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.cmns.dao.EdgeInfoDao;
import com.cmns.service.EdgeInfoService;

@Service("EdgeInfoService")
public class EdgeInfoServiceImpl implements EdgeInfoService {
	@Resource(name = "EdgeInfoDao")
	private EdgeInfoDao edgeInfoDao;
	
	public void initEdgeList(String category) {
		edgeInfoDao.initEdgeList(category);
	}

	public void updateEdgeList(String category) {
		edgeInfoDao.updateEdgeList(category);
	}

}
