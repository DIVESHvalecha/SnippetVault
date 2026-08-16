package com.divesh.SnippetVault.repository;

import com.divesh.SnippetVault.DTO.SnippetVersionHistory;
import com.divesh.SnippetVault.exceptions.GroupDoesnotExits;
import com.divesh.SnippetVault.models.SnippetVersion;
import com.divesh.SnippetVault.models.Snippets;
import com.divesh.SnippetVault.rowmapper.SnippetRowMapper;
import com.divesh.SnippetVault.service.SnippetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class SnippetRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public Long createSnippet(String title, String description, String content,
                              String language, String visibility,
                              long userId, Long groupId) {

        String query;

        if (groupId == null) {
            query = "INSERT INTO snippets (title, content, language, description, user_id, visibility, current_version) VALUES (?, ?, ?, ?, ?, ?, 1)";
        } else {
            query = "INSERT INTO snippets (title, content, language, description, user_id, group_id, visibility, current_version) VALUES (?, ?, ?, ?, ?, ?, ?, 1)";
        }

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {

            PreparedStatement ps = connection.prepareStatement(
                    query,
                    Statement.RETURN_GENERATED_KEYS
            );

            ps.setString(1, title);
            ps.setString(2, content);
            ps.setString(3, language);
            ps.setString(4, description);
            ps.setLong(5, userId);

            if (groupId == null) {
                ps.setString(6, visibility);
            } else {
                ps.setLong(6, groupId);
                ps.setString(7, visibility);
            }

            return ps;

        }, keyHolder);

        Long snippetId=  keyHolder.getKey().longValue();

        String query2 = "INSERT INTO snippet_versions\n" +
                "(snippet_id, version_number, title, content, language, description, edited_by)\n" +
                "VALUES (?, ?, ?, ?, ?, ?, ?);";

        jdbcTemplate.update(query2,snippetId, 1, title, content, language, description, userId);

        return  snippetId;
    }

    public List<Snippets> getPublicSnippets() {
        String query = "select snippet_id, title, content, language, description, group_id, user_id, visibility,current_version, active_yn from snippets where visibility = 'PUBLIC' and active_yn = 1";
        return jdbcTemplate.query(query, new SnippetRowMapper());
    }

    public List<Snippets> getMySnippets(long userId) {
        String query = "select snippet_id, title, content, language, description, group_id, user_id, visibility,current_version, active_yn from snippets where active_yn = 1 and user_id = ?";
        return jdbcTemplate.query(query, new SnippetRowMapper(), userId);
    }

    public List<Snippets> getMyPrivateSnippets(long userId) {
        String query = "select snippet_id, title, content, language, description, group_id, user_id, visibility,current_version, active_yn from snippets where visibility = 'PRIVATE' and active_yn = 1 and user_id = ?";
        return jdbcTemplate.query(query, new SnippetRowMapper(), userId);
    }

    public List<Snippets> getGroupSnippets(long groupId, long userId) {
        String query = "select snippet_id, title, content, language, description, group_id, user_id, visibility,current_version, active_yn from snippets where visibility = 'GROUP' and active_yn = 1 and group_id = ?";
        return jdbcTemplate.query(query, new SnippetRowMapper(), groupId);
    }

    public Snippets getSnippetById(Long id, long userId) {
        String query = "select snippet_id, title, content, language, description, group_id, user_id, visibility,current_version, active_yn from snippets where active_yn = 1 and user_id = ? and snippet_id = ?";
        return jdbcTemplate.queryForObject(query, new SnippetRowMapper() , userId, id);
    }

    public void editSnippet(Long id, long userId, String title, String description, String content, String language, String visibility, Long groupId) {
        String query1 = "select current_version from snippets where snippet_id = ? and user_id = ? and active_yn = 1";
        Integer currentVersion = jdbcTemplate.queryForObject(query1,Integer.class ,id, userId);
        Integer newVersion = currentVersion+1;
        String query2 = "INSERT INTO snippet_versions\n" +
                "(snippet_id, version_number, title, content, language, description, edited_by)\n" +
                "VALUES (?, ?, ?, ?, ?, ?, ?);";
        jdbcTemplate.update(query2, id, newVersion, title, content, language, description, userId);

        if(groupId != null){
            String query = "update snippets set title = ?, content = ?, description = ?, language = ?, visibility = ?, group_id = ?, current_version = ? where snippet_id = ? and user_id = ?";
            jdbcTemplate.update(query, title, content, description, language, visibility, groupId, newVersion, id, userId);
        }else{
            String query = "update snippets set title = ?, content = ?, description = ?, language = ?, visibility = ?, current_version = ? where snippet_id = ? and user_id = ?";
            jdbcTemplate.update(query, title, content, description, language, visibility, newVersion, id, userId);
        }
    }

    public void deleteSnippet(int id, long userId) {
        String query = "update snippets set active_yn = 0 where snippet_id = ? and user_id = ?";
        jdbcTemplate.update(query, id, userId);
    }

    public List<SnippetVersionHistory> getVersionsOfASnippet(int id, long userId) {
        String query = "SELECT \n" +
                "    sv.version_number,\n" +
                "    sv.edited_by,\n" +
                "    sv.created_at,\n" +
                "    sv.title,\n" +
                "    sv.description,\n" +
                "    sv.content,\n" +
                "    sv.language\n" +
                "FROM snippet_versions sv\n" +
                "JOIN snippets s ON sv.snippet_id = s.snippet_id\n" +
                "WHERE sv.snippet_id = ?\n" +
                "AND (\n" +
                "    s.user_id = ?\n" +
                "    OR s.visibility = 'PUBLIC'\n" +
                "    OR (\n" +
                "        s.visibility = 'GROUP'\n" +
                "        AND EXISTS (\n" +
                "            SELECT 1\n" +
                "            FROM group_member gm\n" +
                "            WHERE gm.group_id = s.group_id\n" +
                "            AND gm.user_id = ?\n" +
                "        )\n" +
                "    )\n" +
                ")\n" +
                "ORDER BY sv.version_number DESC;";

        return jdbcTemplate.query(query, (rs, rownum)->{
            SnippetVersionHistory history = new SnippetVersionHistory();
            history.setVersionNumber(rs.getLong("version_number"));
            history.setEditedBy(rs.getLong("edited_by"));
            history.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            history.setTitle(rs.getString("title"));
            history.setDescription(rs.getString("description"));
            history.setContent(rs.getString("content"));
            history.setLanguage(rs.getString("language"));
            return history;
        }, id, userId, userId);
    }

    public SnippetVersion getSnippetFromVersion(Long id, int versionNumber, long userId) {
        String query = "SELECT \n" +
                "    sv.version_id,\n" +
                "    sv.snippet_id,\n" +
                "    sv.version_number,\n" +
                "    sv.title,\n" +
                "    sv.content,\n" +
                "    sv.language,\n" +
                "    sv.description,\n" +
                "    sv.edited_by,\n" +
                "    sv.created_at\n" +
                "FROM snippet_versions sv\n" +
                "JOIN snippets s ON sv.snippet_id = s.snippet_id\n" +
                "WHERE sv.snippet_id = ?\n" +
                "AND sv.version_number = ?\n" +
                "AND s.user_id = ?";

        return jdbcTemplate.queryForObject(query, new SnippetVersionsRowMapper(), id, versionNumber, userId);
    }

    @Transactional
    public Snippets fork(Long id, int versionNumber, long userId) throws GroupDoesnotExits, RuntimeException {
        String query = "SELECT \n" +
                "    sv.title,\n" +
                "    sv.description,\n" +
                "    sv.content,\n" +
                "    sv.language\n" +
                "FROM snippet_versions sv\n" +
                "JOIN snippets s ON sv.snippet_id = s.snippet_id\n" +
                "WHERE sv.snippet_id = ?\n" +
                "AND sv.version_number = ?\n" +
                "AND (\n" +
                "    s.user_id = ?\n" +
                "    OR s.visibility = 'PUBLIC'\n" +
                "    OR (\n" +
                "        s.visibility = 'GROUP'\n" +
                "        AND EXISTS (\n" +
                "            SELECT 1\n" +
                "            FROM group_member gm\n" +
                "            WHERE gm.group_id = s.group_id\n" +
                "            AND gm.user_id = ?\n" +
                "        )\n" +
                "    )\n" +
                ");";

        try {
            return jdbcTemplate.queryForObject(query,(rs, rowNum) ->{
                Snippets snippet = new Snippets();
                snippet.setTitle(rs.getString("title"));
                snippet.setContent(rs.getString("content"));
                snippet.setDescription(rs.getString("description"));
                snippet.setLanguage(rs.getString("language"));
                snippet.setVisibility("PRIVATE");
                snippet.setGroupId(null);
                snippet.setFolderId(null);
                return  snippet;
            } , id, versionNumber, userId, userId);

        } catch (EmptyResultDataAccessException e) {
            throw new RuntimeException("Snippet version not found or access denied");
        }
    }
}
