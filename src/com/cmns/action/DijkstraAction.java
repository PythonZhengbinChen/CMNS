package com.cmns.action;

import com.cmns.bean.GraphMatrixBean;

/**
 * <p>Title: DijkstraAction</p>
* <p>Description: 最小路径Dijkstra算法  包括图的建立，矩阵的清空、矩阵的输出、和Dijkstra核心算法</p>
* <p>Company: YSU</p> 
* @author ZhengbinChen 
* @date 2017-6-13 下午3:03:12
**
 */
public class DijkstraAction {
	    static final int MaxValue=65535;    //最大值（可设为一个最大整数）
	    static int[] path=new int[GraphMatrixBean.MaxNum];    //两点经过的顶点集合的数组  最多不能超过MaxNum个点
	    static int[] tmpvertex=new int[GraphMatrixBean.MaxNum];  //最短路径的起始点集合
	    
	    //创建邻接矩阵图
	    public synchronized static void CreateGraph(GraphMatrixBean GM,String[] edgeList,String[] vertext){
	    	//String[] edgeList = {"a","b","8","b","c","3","b","d","5","a","c","4","c","e","1","d","e","7","a","e","11"};
	    	//String[] vertext = {"a","b","c","d","e"};
	        int i,j,k;
	        int weight;     //权
	        String EstartV,EendV;        //边的起始顶点
	        for(i=0;i<GM.VertexNum;i++){        //输入顶点
	            GM.Vertex[i]=vertext[i];
	        }
	        
	        for(k=0;k<GM.EdgeNum;k++){            //输入边的信息
	        	
	            EstartV=edgeList[k*3];		//根据索引获取结点 
	            EendV=edgeList[k*3+1];
	            weight=Integer.valueOf(edgeList[k*3+2]);
	            //System.out.println("EstartV: " + EstartV + " EendV: " + EendV + " weight: " + weight);
	            for(i=0;!EstartV.equals(GM.Vertex[i]);i++);      //在已有顶点中查找始点    这里是字符串要使用equals
	            for(j=0;!EendV.equals(GM.Vertex[j]);j++);        //在已有的顶点中查找终点
	            GM.EdgeWeight[i][j]=weight;          //对应位置保存权值，表示有一条边
	            if(GM.GType==0){        //若是无向图
	                GM.EdgeWeight[j][i]=weight;        //在对角位置保存权值
	            }
	        }
	    }

	    // 清空矩阵
	    public synchronized static void ClearGraph(GraphMatrixBean GM) {
	        int i, j;
	        for (i = 0; i < GM.VertexNum; i++) {
	            for (j = 0; j < GM.VertexNum; j++) {
	                GM.EdgeWeight[i][j] = MaxValue; // 设置矩阵中各元素的值为MaxValue
	            }
	        }
	    }

	    // 输出邻接矩阵
	    public synchronized static void OutGraph(GraphMatrixBean GM) {
	        int i, j;
	        for (j = 0; j < GM.VertexNum; j++) {
	            System.out.printf("\t%s", GM.Vertex[j]); // 在第一行输出顶点信息
	        }
	        System.out.println();			//换行
	        for (i = 0; i < GM.VertexNum; i++) {
	            System.out.printf("%s", GM.Vertex[i]);
	            for (j = 0; j < GM.VertexNum; j++) {
	                if (GM.EdgeWeight[i][j] == MaxValue) { // 若权值为最大值
	                    System.out.printf("\tZ"); // 以Z表示无穷大
	                } else {
	                    System.out.printf("\t%d", GM.EdgeWeight[i][j]); // 输出边的权值
	                }
	            }
	            System.out.println();
	        }
	    }
	    
	    //最短路径算法
	    public synchronized static void distMin(GraphMatrixBean GM,int fromIndex,int toIndex){    //vend为结束点    拿到的是索引值
	        int[] weight=new int[GraphMatrixBean.MaxNum];        //某终止点到各顶点的最短路径长度
	        int i,j,k,min;
	        //vend--;
	        for(i=0;i<GM.VertexNum;i++){        //初始化weight数组
	            weight[i]=GM.EdgeWeight[toIndex][i];
	        }
	        for(i=0;i<GM.VertexNum;i++){        //初始化path数组
	            if(weight[i]<MaxValue&&weight[i]>0){    //有效权值
	                path[i]=toIndex;				//将所有与目的值有关联的点的值修改为目标点的下标
	            }
	        }
	        for(i=0;i<GM.VertexNum;i++){        //初始化tmpvertex数组
	            tmpvertex[i]=0;            //初始化顶点集合为空
	        }
	        tmpvertex[toIndex]=1;        //选入顶点vend
	        weight[toIndex]=0;
	        
	        for(i=0;i<GM.VertexNum;i++){        //查找未用顶点的最小权值
	            min=MaxValue;
	            k=toIndex;
	            for(j=0;j<GM.VertexNum;j++){		//拿到vend行对应的最小值
	                if(tmpvertex[j]==0&&weight[j]<min){
	                    min=weight[j];
	                    k=j;
	                }
	            }
	            tmpvertex[k]=1;            //将顶点k选入        依次选择权值最小的边，将相应顶点修改为已访问
	            for(j=0;j<GM.VertexNum;j++){        //以顶点k为中间点，重新计算权值
	                if(tmpvertex[j]==0&&weight[k]+GM.EdgeWeight[k][j]<weight[j]){
	                    weight[j]=weight[k]+GM.EdgeWeight[k][j];
	                    path[j]=k;			//对应点下跳点的下标
	                }
	            }
	            
	            if(tmpvertex[fromIndex] == 1)		//如果起点被选中就结束   这里要更具相应的起点进行变化
	            	return;
	        }
	    }
}
