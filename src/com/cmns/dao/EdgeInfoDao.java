package com.cmns.dao;

import com.cmns.bean.GraphMatrixBean;


public interface EdgeInfoDao {
	public static String[] edgeList = new String[GraphMatrixBean.MaxNum];
	
	public void initEdgeList(String category);
	
	public void updateEdgeList(String category);
}
