package com.divesh.SnippetVault.rowmapper;

import com.divesh.SnippetVault.models.Snippets;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SnippetRowMapper implements RowMapper<Snippets> {

    @Override
    public Snippets mapRow(ResultSet rs, int rowNum) throws SQLException {
        Snippets snippet = new Snippets();

        snippet.setTitle(rs.getString("title"));
        snippet.setContent(rs.getString("content"));
        snippet.setDescription(rs.getString("description"));
        snippet.setLanguage(rs.getString("language"));
        snippet.setVisibility(rs.getString("visibility"));
        snippet.setSnippetId(rs.getLong("snippet_id"));
        snippet.setGroupId(rs.getLong("group_id"));
        snippet.setUserId(rs.getLong("user_id"));
        snippet.setActiveYn(rs.getInt("active_yn"));
        snippet.setCurrentVersion(rs.getLong("current_version"));

        return snippet;
    }
}
