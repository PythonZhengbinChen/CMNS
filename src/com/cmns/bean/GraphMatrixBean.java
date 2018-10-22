package com.cmns.bean;


/**
 * <p>Title: GraphMatrixBean</p>
* <p>Description: 图的信息类，记录图的节点数，边数和权值矩阵</p>
* <p>Company: YSU</p> 
* @author ZhengbinChen 
* @date 2017-6-13 下午3:01:59
**
 */
public class GraphMatrixBean {
	static public int MaxNum=2000;		//最大节点
    public String[] Vertex=new String[MaxNum];  //保存顶点信息（序号或字母）
    public int GType;    //图的类型（0：无向图，1：有向图）
    public int VertexNum;        //顶点的数量
    public int EdgeNum;        //边的数量
    public int[][] EdgeWeight=new int[MaxNum][MaxNum];        //保存边的权
    public int[] isTrav=new int[MaxNum];        //遍历标志
}
