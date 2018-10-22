package com.cmns.service;

import java.util.List;

import com.cmns.bean.NoteSearchBean;

public interface NoteSearchService {
	public List<NoteSearchBean> searchNoteNameByKeyString(String keyString);
	public List<NoteSearchBean> searchNoteSearchBeanByVertexCategory(String category);
	public NoteSearchBean searchFullNoteNameByKeyString(String keyString);
	public List<NoteSearchBean> getNoteSearchBeanByBuildingId(String buildingId);
}
