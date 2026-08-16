package com.divesh.SnippetVault.service;

import com.divesh.SnippetVault.exceptions.GroupDoesnotExits;
import com.divesh.SnippetVault.models.CustomUserDetails;
import com.divesh.SnippetVault.models.Folder;
import com.divesh.SnippetVault.models.Snippets;
import com.divesh.SnippetVault.repository.FolderRepository;
import com.divesh.SnippetVault.repository.GroupRepository;
import com.divesh.SnippetVault.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FolderService {

    @Autowired
    FolderRepository folderRepository;
    @Autowired
    GroupRepository groupRepository;

    public void createFolder(Folder folder) throws GroupDoesnotExits {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();

        String name = folder.getName();
        String description = folder.getDescription();
        Long groupId = folder.getGroupId();

        if(groupId != null){
            Integer res = groupRepository.checkIfAlreadyJoined(groupId, userId);
            if(res == null){
                throw new GroupDoesnotExits("User has not joined this group");
            }else{
                folderRepository.createFolder(name, description, groupId, userId);
            }
        }else{
            folderRepository.createFolder(name, description, groupId, userId);
        }
    }

    public List<Folder> viewFolder() {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();

        return folderRepository.viewFolder(userId);
    }

    public void deleteFolder(int folderId) {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();

        folderRepository.deleteFolder(folderId, userId);
    }

    public void addSnippetToFolder(Long folderId, Long snippetId) {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();

        if (folderRepository.checkUserFolder(folderId, userId)){
            folderRepository.addSnippetToFolder(folderId, snippetId);
        }
    }

    public List<Snippets> getSnippetsOfFolder(int folderId) {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();

        return folderRepository.getSnippetsOfFolder(folderId, userId);
    }

    public void deleteSnippetFromFolder(int folderId, int snippetId) {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();

        folderRepository.deleteSnippetFromFolder(folderId, userId, snippetId);
    }
}
