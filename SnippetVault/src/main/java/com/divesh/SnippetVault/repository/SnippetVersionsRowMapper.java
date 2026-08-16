package com.divesh.SnippetVault.repository;

import com.divesh.SnippetVault.models.SnippetVersion;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SnippetVersionsRowMapper implements RowMapper<SnippetVersion> {
    @Override
    public SnippetVersion mapRow(ResultSet rs, int rowNum) throws SQLException {
        SnippetVersion version = new SnippetVersion();

        version.setVersionId(rs.getLong("version_id"));
        version.setSnippetId(rs.getLong("snippet_id"));
        version.setVersionNumber(rs.getLong("version_number"));
        version.setTitle(rs.getString("title"));
        version.setContent(rs.getString("content"));
        version.setLanguage(rs.getString("language"));
        version.setDescription(rs.getString("description"));
        version.setEditedBy(rs.getLong("edited_by"));
        version.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());

        return version;
    }
}
