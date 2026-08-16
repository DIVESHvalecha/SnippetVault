package com.divesh.SnippetVault.repository;

import com.divesh.SnippetVault.models.Group;
import com.divesh.SnippetVault.models.Snippets;
import com.divesh.SnippetVault.rowmapper.GroupRowMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
@Slf4j
public class GroupRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public Group checkIfGroupExist(String name, long userId){
        String query = "SELECT group_id, name, description, group_code, group_visibility, user_id from user_groups where name = ? and user_id = ? and active_yn = 1";
        try{
            return jdbcTemplate.queryForObject(query, new GroupRowMapper(), name, userId);
        }catch (IncorrectResultSizeDataAccessException e){
            return null;
        }
    }

    public void createGroup(String name, String description, String groupCode, String groupVisibility, long userId) {
        String query = "INSERT INTO user_groups (name, description, group_code, group_visibility, user_id) values(?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE active_yn = 1";
        jdbcTemplate.update(query, name, description, groupCode, groupVisibility, userId);
    }

    public Group checkIfCodeUsed(String groupCode) {
        String query = "SELECT group_id, name, description, group_code, group_visibility, user_id from user_groups where group_code = ?";
        try{
            log.info("group found");
            return jdbcTemplate.queryForObject(query, new GroupRowMapper(), groupCode);
        }catch (EmptyResultDataAccessException e){
            log.info("group is null");
            return null;
        }
    }

    public Integer checkIfAlreadyJoined(long id, long userId){
        String query = "SELECT id, user_id, group_id from group_member where user_id = ? and group_id = ? and active_yn = 1";
        try{
            return (Integer)jdbcTemplate.queryForMap(query, userId, id).get("id");
        }catch (EmptyResultDataAccessException e){
            log.info("User has not joined yet");
            return null;
        }
    }

    public void joinGroup(long id, long userId) {
        String query = "INSERT INTO group_member (user_id, group_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE active_yn = 1";
        jdbcTemplate.update(query, userId, id);
    }

    public Map<Group, Integer> getPublicGroups() {
        String query = """
        SELECT group_id, name, description, group_code, group_visibility, user_id
        FROM user_groups
        WHERE group_visibility = 'PUBLIC' AND active_yn = 1
        """;

        List<Group> groups = jdbcTemplate.query(query, new GroupRowMapper());

        String countQuery = """
        SELECT group_id, COUNT(*) AS cnt
        FROM group_member
        GROUP BY group_id
        """;

        Map<Integer, Integer> countMap = jdbcTemplate.query(countQuery, rs -> {
            Map<Integer, Integer> map = new HashMap<>();
            while (rs.next()) {
                map.put(rs.getInt("group_id"), rs.getInt("cnt"));
            }
            return map;
        });

        Map<Group, Integer> result = new LinkedHashMap<>();
        for (Group g : groups) {
            result.put(g, countMap.getOrDefault(g.getId().intValue(), 0));
        }

        return result;
    }

    public List<Group> getMyGroups(long userId) {
        String query = "SELECT g.group_id, g.name, g.description, g.group_code, g.group_visibility, g.user_id from user_groups g, group_member m where g.group_id = m.group_id and m.user_id = ? and m.active_yn = 1";
        return jdbcTemplate.query(query, new GroupRowMapper(), userId);
    }

    public void leaveGroup(Integer res) {
        String query = "UPDATE group_member SET active_yn = 0 where id = ?";
        jdbcTemplate.update(query, res);
    }

}
