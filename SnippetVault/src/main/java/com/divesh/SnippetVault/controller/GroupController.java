package com.divesh.SnippetVault.controller;

import com.divesh.SnippetVault.exceptions.GroupAlreadyExistsException;
import com.divesh.SnippetVault.exceptions.GroupAlreadyJoined;
import com.divesh.SnippetVault.exceptions.GroupDoesnotExits;
import com.divesh.SnippetVault.models.Group;
import com.divesh.SnippetVault.models.User;
import com.divesh.SnippetVault.service.GroupService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Slf4j
@RestController
public class GroupController {

    @Autowired
    GroupService groupService;

    // create group
    @PostMapping("/group")
    public ResponseEntity<Map<String, String>> createGroup(@RequestBody Group group){
        try{
            String groupCode = groupService.createGroup(group);
            groupService.joinGroup(groupCode);
            log.info("group created successfully");
            return ResponseEntity.ok().body(Map.of("body", "Group created successfully!"));
        }catch (GroupAlreadyExistsException | GroupDoesnotExits | GroupAlreadyJoined e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("body", e.getMessage()));
        }
    }

    //join group
    @PostMapping("/join-group/{groupCode}")
    public ResponseEntity<Map<String, String>> joinGroup(@PathVariable("groupCode") String groupCode ){
        try{
            groupService.joinGroup(groupCode);
            return ResponseEntity.ok().body(Map.of("body", "Group Joined successfully!"));
        }catch (GroupDoesnotExits | GroupAlreadyJoined e){
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("body", e.getMessage()));
        }
    }

    //list all public groups
    @GetMapping("/groups/public")
    public ResponseEntity<Map<Group, Integer>> getPublicGroups(){
        log.info("reached controller");
        Map<Group, Integer> test =  groupService.getPublicGroups();
        return ResponseEntity.ok().body(test);
    }

    //list all groups i have joined
    @GetMapping("/groups/my-groups")
    public List<Group> getMyGroups(){
        List<Group> test =  groupService.getMyGroups();
        return test;
    }

    //leave group
    @DeleteMapping("/leave-group/{groupCode}")
    public ResponseEntity<Map<String, String>> leaveGroup(@PathVariable("groupCode") String groupCode){
        try{
            groupService.leaveGroup(groupCode);
            return ResponseEntity.ok().body(Map.of("body", "Group left successfully!"));
        }catch (GroupDoesnotExits e){
            return ResponseEntity.badRequest().body(Map.of("body", e.getMessage()));
        }
    }
}
