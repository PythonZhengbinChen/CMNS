package com.cmns.action;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cmns.bean.BuildingBean;
import com.cmns.service.BuildingInfoService;

/**
 * <p>Title: BuildingAction</p>
* <p>Description: </p>
* <p>Company: YSU</p> 
* @author ZhengbinChen 
* @date 2018-4-12 上午11:30:57
* 编写相应的接口代码
**
 */
@Controller("BuildingAction")
public class BuildingAction {
	@Resource(name = "BuildingInfoService")
	private BuildingInfoService buildingInfoService;
	
	@RequestMapping(value="getBuildingBeanById.do",method=RequestMethod.POST)
	@ResponseBody
	public BuildingBean getBuildingBeanById(HttpServletRequest request, HttpServletResponse response,
			@RequestParam("buildingId") String buildingId) {
		return buildingInfoService.getBuildingInfoByBuildingId(buildingId);
	}
	
}
