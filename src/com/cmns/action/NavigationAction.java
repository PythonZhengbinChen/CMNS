package com.cmns.action;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.cmns.bean.GraphMatrixBean;
import com.cmns.bean.NoteSearchBean;
import com.cmns.bean.VertexBean;
import com.cmns.dao.impl.EdgeInfoDaoImpl;
import com.cmns.dao.impl.VertexInfoDaoImpl;
import com.cmns.service.EdgeInfoService;
import com.cmns.service.NoteSearchService;


/**
 * <p>Title: TestAction</p>
* <p>Description: </p>
* <p>Company: YSU</p> 
* @author ZhengbinChen 
* @date 2017-6-13 下午3:01:30
**
 */
@Controller("NavigationAction")
public class NavigationAction {
	@Resource(name = "EdgeInfoService")
	private EdgeInfoService edgeInfoService;
	@Resource(name = "NoteSearchService")
	private NoteSearchService noteSearchService;

	/**
	 * <p>Title: getMinLoadList</p>
	* <p>Description: 这里的两个参数前台传回来的应该是节点编号，后台需要处理成对于的索引值</p>
	* <p>Company: </p> 
	* <p>return type: void</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2017-6-13
	 */
	@RequestMapping(value="getMinLoadList.do",method=RequestMethod.POST)
	@ResponseBody
	public List<String> getMinLoadList(HttpServletRequest request, HttpServletResponse response,
			@RequestParam("startVertex") String startVertex,@RequestParam("endVertex") String endVertex,
			@RequestParam("category") String category) {
		if(!category.equals("0")&&!category.equals("1"))
			category = "1";		//边属性，默认为1，表示车行，0表示步行
		
		//EdgeInfoDaoImpl edgeInfoDaoImpl = new EdgeInfoDaoImpl();
		edgeInfoService.initEdgeList(category);			//边集的初始化  放入导内存中，这样就不需要每次查询都调用数据库查询
		VertexInfoDaoImpl.initVertexList();		//点集的初始化
		
		GraphMatrixBean GM = new GraphMatrixBean();		//创建图对象
		GM.GType= 0;
		GM.VertexNum = VertexInfoDaoImpl.vertexList.length;
		GM.EdgeNum = EdgeInfoDaoImpl.edgeList.length/3;
		int startVertexIndex;				//起始节点编号对于在节点集合中的索引值
		for(startVertexIndex=0;!startVertex.equals(VertexInfoDaoImpl.vertexList[startVertexIndex]);startVertexIndex++);
		int endVertexIndex;					//结束节点编号对于在节点集合中的索引值
		for(endVertexIndex=0;!endVertex.equals(VertexInfoDaoImpl.vertexList[endVertexIndex]);endVertexIndex++);
		
		//System.out.println(startVertexIndex+"==="+endVertexIndex);
		DijkstraAction.ClearGraph(GM);
    	DijkstraAction.CreateGraph(GM, EdgeInfoDaoImpl.edgeList, VertexInfoDaoImpl.vertexList);		//创捷图的矩阵
    	//DijkstraAction.OutGraph(GM);
    	DijkstraAction.distMin(GM, startVertexIndex, endVertexIndex);  //这里的0表示索引值为0的一号节点，4为索引节点为4的五号节点
    	
    	List<String> minVertexList = new ArrayList<String>();
    	
    	if(DijkstraAction.tmpvertex[startVertexIndex]==1){
	    	int k=startVertexIndex;			//这里的这个标号代表的是起点的下标要和Dijkstra里面的tmpvertex[0] == 1保持一致 这样就可以保证只输出起始和中间的结点
	        while(k!=endVertexIndex){
	            //System.out.printf("顶点%s-", GM.Vertex[k]);
	            minVertexList.add(GM.Vertex[k]);		//将遍历的节点放入list中
	            k=DijkstraAction.path[k];
	        }
	       // System.out.printf("顶点%s\n", GM.Vertex[k]);
	        minVertexList.add(GM.Vertex[k]);				//将遍历的节点放入list中
    	}else {
    		System.out.printf("%s-%s:无路径\n", GM.Vertex[startVertexIndex],GM.Vertex[endVertexIndex]);
    	}
    	
    	return minVertexList;
	}
	
	
	
	/**
	 * <p>Title: getVertexInfoByVertexId</p>
	* <p>Description: 根据节点的编号，获取节点的描述信息和节点的位置坐标</p>
	* <p>Company: </p> 
	* <p>return type: VertexBean</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2017-6-13
	 */
	@RequestMapping(value="getVertexInfoByVertexId.do",method=RequestMethod.POST)
	@ResponseBody
	public VertexBean getVertexInfoByVertexId(HttpServletRequest request,HttpServletResponse response,
			@RequestParam("vertexId") String vertexId) {
		VertexInfoDaoImpl vertexInfoDaoImpl = new VertexInfoDaoImpl();
		VertexBean vertexBean = vertexInfoDaoImpl.getVertexBeanByVertexId(vertexId);
		return vertexBean;
	}
	
	/**
	 * <p>Title: getNoteSearchList</p>
	* <p>Description: 用于搜索框使用，进行模糊匹配用户需要搜索的条件，下拉提供用户选择使用</p>
	* <p>Company: </p> 
	* <p>return type: List<NoteSearchBean></p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2017-8-18
	 */
	@RequestMapping(value="getNoteSearchList.do",method=RequestMethod.POST)
	@ResponseBody
	public List<NoteSearchBean> getNoteSearchList(HttpServletRequest request,HttpServletResponse response,
			@RequestParam("keyString") String keyString) {
		if(keyString.equals("") || keyString == null)
			return null;
		//NoteSearchDaoImpl noteSearchDaoImpl = new NoteSearchDaoImpl();
		List<NoteSearchBean> noteSearchBeanList = noteSearchService.searchNoteNameByKeyString(keyString);
		return noteSearchBeanList;
	}
	
	/**
	 * <p>Title: getVertexListByVertexCategory</p>
	* <p>Description: 根据节点的属性查询该属性下的所有节点信息</p>
	* <p>Company: </p> 
	* <p>return type: List<VertexBean></p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2017-8-18
	 */
	@RequestMapping(value="getVertexListByVertexCategory.do",method=RequestMethod.POST)
	@ResponseBody
	public List<NoteSearchBean> getVertexListByVertexCategory(HttpServletRequest request,HttpServletResponse response,
			@RequestParam("category") String category) {
		//NoteSearchDaoImpl noteSearchDaoImpl = new NoteSearchDaoImpl();
		//List<VertexBean> vertexBeanList = 
		return noteSearchService.searchNoteSearchBeanByVertexCategory(category);
	}

	
	/**
	 * <p>Title: checkSearchName</p>
	* <p>Description: 用于导航输入框提交前先检查该名称节点是否存在，存放则返回节点信息，不存在则是null</p>
	* <p>Company: </p> 
	* <p>return type: NoteSearchBean</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2017-8-18
	 */
	@RequestMapping(value="checkSearchName.do")
	@ResponseBody
	public NoteSearchBean checkSearchName(HttpServletRequest request,HttpServletResponse response,
			@RequestParam("keyString") String keyString) {
		//NoteSearchDaoImpl noteSearchDaoImpl = new NoteSearchDaoImpl();
		//NoteSearchBean noteSearchBean = 
		return noteSearchService.searchFullNoteNameByKeyString(keyString);
	}
	
	
	
	
	/**
	 * <p>Title: main</p>
	* <p>Description: main函数用于测试</p>
	* <p>Company: </p> 
	* <p>return type: void</p>
	* <p>Parameter: </p>
	* @author ZhengbinChen
	* @date 2017-6-13
	 */
//	public static void main(String[] args) {
//
//		EdgeInfoDaoImpl.initEdgeList("1");			//边集的初始化  放入导内存中，这样就不需要每次查询都调用数据库查询
//		VertexInfoDaoImpl.initVertexList();		//点集的初始化
//		
//		GraphMatrixBean GM = new GraphMatrixBean();
//		GM.GType= 0;
//		GM.VertexNum = VertexInfoDaoImpl.vertexList.length;
//		GM.EdgeNum = EdgeInfoDaoImpl.edgeList.length/3;	
//		
//		int startVertex = 33;
//		int endVertex = 35;
//		DijkstraAction.ClearGraph(GM);
//    	DijkstraAction.CreateGraph(GM, EdgeInfoDaoImpl.edgeList, VertexInfoDaoImpl.vertexList);
//    	//DijkstraAction.OutGraph(GM);
//    	DijkstraAction.distMin(GM, startVertex, endVertex);  //这里的0表示索引值为0的一号节点，4为索引节点为4的五号节点
//    	
//    	if(DijkstraAction.tmpvertex[startVertex]==1){
//	    	int k=startVertex;			//这里的这个标号代表的是起点的下标要和Dijkstra里面的tmpvertex[0] == 1保持一致 这样就可以保证只输出起始和中间的结点
//	        while(k!=endVertex){
//	            System.out.printf("顶点%s-", GM.Vertex[k]);
//	            k=DijkstraAction.path[k];
//	        }
//	        System.out.printf("顶点%s\n", GM.Vertex[k]);
//    	}else {
//    		System.out.printf("%s-%s:无路径\n", GM.Vertex[startVertex],GM.Vertex[endVertex]);
//    	}
//		
//	}
	
}
