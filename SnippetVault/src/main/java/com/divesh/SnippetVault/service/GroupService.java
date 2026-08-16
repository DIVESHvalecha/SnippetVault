package com.divesh.SnippetVault.service;

import com.divesh.SnippetVault.exceptions.GroupAlreadyExistsException;
import com.divesh.SnippetVault.exceptions.GroupAlreadyJoined;
import com.divesh.SnippetVault.exceptions.GroupDoesnotExits;
import com.divesh.SnippetVault.models.CustomUserDetails;
import com.divesh.SnippetVault.models.Group;
import com.divesh.SnippetVault.repository.GroupRepository;
import com.divesh.SnippetVault.utils.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GroupService {
//    CustomUserDetails user = (CustomUserDetails)
//            SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    @Autowired
    GroupRepository groupRepository;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom random = new SecureRandom();

    public String createGroup(Group group) throws GroupAlreadyExistsException {

        CustomUserDetails user = SecurityUtils.getLoggedInUser();

        String name = group.getName();
        String description = group.getDescription();
        String groupCode;
        do{
            groupCode = generateGroupCode(6);
        }while(groupRepository.checkIfCodeUsed(groupCode) != null);

        String groupVisibility = group.getGroupVisibility();
        long user_id = user.getId();
        group.setUserId(user_id);

        if(groupRepository.checkIfGroupExist(name, user_id) == null){
            groupRepository.createGroup(name, description, groupCode, groupVisibility, user_id);
            return groupCode;
        }else{
            throw new GroupAlreadyExistsException();
        }
    }

    public static String generateGroupCode(int length) {
        StringBuilder code = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(CHARACTERS.length());
            code.append(CHARACTERS.charAt(index));
        }
        return code.toString();
    }

    public void joinGroup(String groupCode) throws GroupDoesnotExits, GroupAlreadyJoined{
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        Group group = groupRepository.checkIfCodeUsed(groupCode);
        if(group == null){
            throw new GroupDoesnotExits();
        }else{
            long id = group.getId();
            long userId = user.getId();
            Integer res = groupRepository.checkIfAlreadyJoined(id, userId);
            if(res == null){
                groupRepository.joinGroup(id, userId);
            }else{
                throw new GroupAlreadyJoined();
            }
        }
    }

    public Map<Group, Integer> getPublicGroups() {
        log.info("reached service");
        Map<Group, Integer> test =  groupRepository.getPublicGroups();
        return test;
    }

    public List<Group> getMyGroups() {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();
        List<Group> test = groupRepository.getMyGroups(userId);
        return test;
    }

    public void leaveGroup(String groupCode) throws GroupDoesnotExits {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        Group group = groupRepository.checkIfCodeUsed(groupCode);
        if(group == null){
            throw new GroupDoesnotExits();
        }else{
            long id = group.getId();
            long userId = user.getId();
            Integer res = groupRepository.checkIfAlreadyJoined(id, userId);
            if(res != null){
                groupRepository.leaveGroup(res);
            }else{
                throw new GroupDoesnotExits("No user with given id found in group");
            }
        }
    }
}
