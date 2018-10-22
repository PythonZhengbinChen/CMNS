package com.cmns.util;

import java.io.IOException;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public class ActivityObtain {
	
	public String getWebHtmlByPath(String path) {
		
		Connection conn = null;
		System.out.println(path);
		conn = Jsoup.connect(path).userAgent
				("Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36");
        try {
			Document doc = conn.get();
			Element element = doc.getElementById("u_u6_imgcontent");
			System.out.println(doc.html());
			return element.html();
		} catch (IOException e) {
			e.printStackTrace();
		}
     return null;   
	}
	
	public static void main(String args[]) {
		ActivityObtain activityObtain = new ActivityObtain();
		System.out.println(activityObtain.getWebHtmlByPath("http://news.ysu.edu.cn/xyjw.htm"));
	}
}
