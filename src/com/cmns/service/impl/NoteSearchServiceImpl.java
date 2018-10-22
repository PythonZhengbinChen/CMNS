package com.cmns.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.cmns.bean.NoteSearchBean;
import com.cmns.dao.NoteSearchDao;
import com.cmns.service.NoteSearchService;

@Service("NoteSearchService")
public class NoteSearchServiceImpl implements NoteSearchService {
	@Resource(name = "NoteSearchDao")
	private NoteSearchDao noteSearchDao;
	
	public List<NoteSearchBean> searchNoteNameByKeyString(String keyString) {
		return noteSearchDao.searchNoteNameByKeyString(keyString);
	}

	public List<NoteSearchBean> searchNoteSearchBeanByVertexCategory(String category) {
		List<NoteSearchBean> noteSearchBeanList = noteSearchDao.getNoteSearchBeanByCategory(category);
		//List<VertexBean> vertexBeanList = new ArrayList<VertexBean>();
		for(int i = 0 ; i < noteSearchBeanList.size(); i ++) {
			noteSearchBeanList.get(i).setPositionX(noteSearchDao.getVertexBeanByVertexId(noteSearchBeanList.get(i).getVertexId()).getPositionX());
			noteSearchBeanList.get(i).setPositionY(noteSearchDao.getVertexBeanByVertexId(noteSearchBeanList.get(i).getVertexId()).getPositionY());
		}
		return noteSearchBeanList;
	}

	public NoteSearchBean searchFullNoteNameByKeyString(String keyString) {
		return noteSearchDao.searchFullNoteNameByKeyString(keyString);
	}

	public List<NoteSearchBean> getNoteSearchBeanByBuildingId(String buildingId) {
		return noteSearchDao.getNoteSearchBeanByBuildingId(buildingId);
	}

}
