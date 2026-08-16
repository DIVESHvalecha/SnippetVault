package com.divesh.SnippetVault.rowmapper;

import com.divesh.SnippetVault.models.Group;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class GroupRowMapper implements RowMapper<Group> {
    @Override
    public Group mapRow(ResultSet rs, int rowNum) throws SQLException {
        Group group = new Group();

        String name = rs.getString("name");
        String description = rs.getString("description");
        String groupCode = rs.getString("group_code");
        String groupVisibility = rs.getString("group_visibility");
        long id = rs.getLong("group_id");
        long userId = rs.getLong("user_id");

        group.setUserId(userId);
        group.setGroupCode(groupCode);
        group.setName(name);
        group.setDescription(description);
        group.setId(id);
        group.setGroupVisibility(groupVisibility);

        return group;
    }
}
