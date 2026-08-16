package com.divesh.SnippetVault.repository;

import com.divesh.SnippetVault.models.Folder;
import com.divesh.SnippetVault.models.Snippets;
import com.divesh.SnippetVault.rowmapper.SnippetRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.util.List;

@Repository
public class FolderRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public void createFolder(String name, String description, Long groupId, long userId) {
        if(groupId != null){
            String query = "INSERT INTO folders (name, description, group_id, user_id) VALUES (?, ?, ?, ?)";
            jdbcTemplate.update(query, name, description, groupId, userId);
        }else{
            String query = "INSERT INTO folders (name, description, user_id) VALUES (?, ?, ?);";
            jdbcTemplate.update(query, name, description, userId);
        }
    }

    public List<Folder> viewFolder(Long userId) {
        String query = "select folder_id, name, description, user_id, group_id, active_yn from folders where user_id = ? and active_yn = 1";

        return jdbcTemplate.query(query, (rs, rowNum)->{
            Folder folder = new Folder();
            folder.setFolderId(rs.getLong("folder_id"));
            folder.setUserId(rs.getLong("user_id"));
            folder.setName(rs.getString("name"));
            folder.setDescription(rs.getString("description"));
            folder.setActiveYn(rs.getInt("active_yn"));
            folder.setGroupId(rs.getLong("group_id"));
            return  folder;
        }, userId);
    }

    public void deleteFolder(int folderId, long userId) {
        String query = "Update folders set active_yn = 0 where folder_id = ? and user_id = ?";
        jdbcTemplate.update(query, folderId, userId);
    }

    public void addSnippetToFolder(Long folderId, Long snippetId) {
        String query = "INSERT INTO folder_snippets (folder_id, snippet_id)\n" +
                "VALUES (?, ?)";
        jdbcTemplate.update(query, folderId, snippetId);
    }

    public boolean checkUserFolder(Long folderId, long userId){
        String query = "select folder_id from folders where folder_id = ? and user_id = ? and active_yn = 1";
        Integer folder = jdbcTemplate.queryForObject(query, Integer.class, folderId, userId);
        return folder != null;
    }

    public List<Snippets> getSnippetsOfFolder(int folderId, long userId) {
        String query = "select s.snippet_id, s.title, s.content, s.language, s.description, s.group_id, s.user_id, s.visibility, s.active_yn from folder_snippets fs inner join snippets s on fs.snippet_id = s.snippet_id where s.active_yn = 1 and s.user_id = ? and fs.folder_id = ? and fs.active_yn = 1";

        return jdbcTemplate.query(query, new SnippetRowMapper(), userId, folderId);
    }

    public void deleteSnippetFromFolder(int folderId, long userId, long snippetId) {
        String query = "UPDATE folder_snippets fs\n" +
                "JOIN folders f ON fs.folder_id = f.folder_id\n" +
                "SET fs.active_yn = 0\n" +
                "WHERE fs.folder_id = ?\n" +
                "AND fs.snippet_id = ?\n" +
                "AND f.user_id = ?";

        jdbcTemplate.update(query, folderId, snippetId, userId);
    }
}
