package com.cmns.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.activation.DataSource;

import org.apache.log4j.Logger;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class JDBCBean {
	private static Logger logger = Logger.getLogger(JDBCBean.class);
	
	private String driver = "com.mysql.jdbc.Driver";
	private String conn = "jdbc:MySQL://localhost:3306/cmns?useUnicode=true&characterEncoding=UTF-8";
	private String DBname ="root";
	private String DBpwd = "root";
	private Connection connection = null;
	private Statement stmt = null;
	private ResultSet rs = null;
	
	
	
	/*---------------------第一种-----------------*/
	//加载驱动程序
	public JDBCBean()
	{
		try {
			Class.forName(driver);
		} catch (ClassNotFoundException e) {
			logger.error("数据库驱动异常！");
			e.printStackTrace();
		}
	}
	//建立于数据库的连�?
	public Connection getConnection()
	{
		try {
			connection = DriverManager.getConnection(conn,DBname,DBpwd);
		} catch (SQLException e) {
			logger.error("数据库连接异常！");
			e.printStackTrace();
		}
		return connection;
	}
	//创建语句对象
	public Statement createStatement()
	{
		try {
			stmt = getConnection().createStatement();
		} catch (SQLException e) {
			logger.error("创建语句对象异常�?");
			e.printStackTrace();
		}
		return stmt;
	}
	//执行查询操作
	public ResultSet executeQuery(String sql)
	{
		try {
			rs = createStatement().executeQuery(sql);
		} catch (SQLException e) {
			logger.error("执行查询操作异常�?");
			e.printStackTrace();
		}
		return rs;
	}
	//执行更新操作
	public int executeUpdate(String sql)
	{
		int result = 0;
		try {
			result = createStatement().executeUpdate(sql);
		} catch (SQLException e) {
			logger.error("执行更新操作异常�?");
			e.printStackTrace();
		}
		return result;
	}
	//执行关闭操作
	public void close()
	{
		try{
			if(rs!=null)
				rs.close();
			if(stmt!=null)
				stmt.close();
			if(connection!=null)
				connection.close();
		}catch(SQLException e)
		{
			logger.error("执行关闭操作异常�?");
			e.printStackTrace();
		}	
	}
	/*---------------------第二种方�?-----------------*/
	/*获取数据库连接的方法*/
	public Connection getConn(){
		try {
			Class.forName(driver);
		} catch (ClassNotFoundException e) {
			logger.error("数据库驱动异�?");
			e.printStackTrace();
		}
		Connection con=null;
		try {
			con = DriverManager.getConnection(conn,DBname,DBpwd);
		} catch (SQLException e) {
			logger.error("数据库连接异�?");
			e.printStackTrace();
		}
		return con;
	}
	/*关闭数据库资源的方法（关闭的顺序不能改变�?*/
	public void closeAll(Connection conn,PreparedStatement pstmt,ResultSet rs){
		if (rs!=null) {
			try {
				rs.close();
			} catch (SQLException e) {
				logger.error("RS关闭发生异常");
				e.printStackTrace();
			}
		}
		if (pstmt!=null) {
			try {
				pstmt.close();
			} catch (SQLException e) {
				logger.error("pstmt关闭发生异常");
				e.printStackTrace();
			}
		}
		if (conn!=null) {
			try {
				conn.close();
			} catch (SQLException e) {
				logger.error("conn关闭发生异常");
				e.printStackTrace();
			}
		}
	}
}


