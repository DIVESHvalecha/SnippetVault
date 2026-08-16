package com.divesh.SnippetVault.service;

import com.divesh.SnippetVault.DTO.SnippetVersionHistory;
import com.divesh.SnippetVault.exceptions.GroupDoesnotExits;
import com.divesh.SnippetVault.models.CustomUserDetails;
import com.divesh.SnippetVault.models.Group;
import com.divesh.SnippetVault.models.SnippetVersion;
import com.divesh.SnippetVault.models.Snippets;
import com.divesh.SnippetVault.repository.FolderRepository;
import com.divesh.SnippetVault.repository.GroupRepository;
import com.divesh.SnippetVault.repository.SnippetRepository;
import com.divesh.SnippetVault.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SnippetService {

    @Autowired
    SnippetRepository snippetRepository;
    @Autowired
    GroupRepository groupRepository;
    @Autowired
    FolderService folderService;

    @Transactional
    public void createSnippet(Snippets snippet) throws GroupDoesnotExits {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();

        String title = snippet.getTitle();
        String description = snippet.getDescription();
        String content = snippet.getContent();
        String language = snippet.getLanguage();
        String visibility = snippet.getVisibility();
        long userId = user.getId();
        Long groupId = snippet.getGroupId();
        snippet.setUserId(userId);

        if(groupId != null){
            Integer res = groupRepository.checkIfAlreadyJoined(groupId, userId);
            if(res == null){
                throw new GroupDoesnotExits("User has not joined this group");
            }
        }

        Long snippetId = snippetRepository.createSnippet(title, description, content, language, visibility, userId, groupId);

        if(snippet.getFolderId() != null){
            folderService.addSnippetToFolder(snippet.getFolderId(), snippetId);
        }
    }

    public List<Snippets> getPublicSnippets() {
        return snippetRepository.getPublicSnippets();
    }

    public List<Snippets> getMySnippets() {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();
        return snippetRepository.getMySnippets(userId);
    }

    public List<Snippets> getMyPrivateSnippets() {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();
        return snippetRepository.getMyPrivateSnippets(userId);
    }

    public List<Snippets> getGroupSnippets(String groupCode) throws GroupDoesnotExits {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();
        Group group =  groupRepository.checkIfCodeUsed(groupCode);
        if(group == null){
            throw new GroupDoesnotExits();
        }else{
            long groupId = group.getId();
            Integer res = groupRepository.checkIfAlreadyJoined(groupId, userId);
            if(res == null){
                throw new GroupDoesnotExits("User has not joined this group");
            }else{
                return snippetRepository.getGroupSnippets(groupId, userId);
            }
        }
    }

    public Snippets getSnippetById(Long id) {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();

        return snippetRepository.getSnippetById(id, userId);
    }

    @Transactional
    public void editSnippet(Long id, Snippets snippet) throws GroupDoesnotExits {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();

        String title = snippet.getTitle();
        String description = snippet.getDescription();
        String content = snippet.getContent();
        String language = snippet.getLanguage();
        String visibility = snippet.getVisibility();
        Long groupId = snippet.getGroupId();

        if(groupId != null){
            Integer res = groupRepository.checkIfAlreadyJoined(groupId, userId);
            if(res == null){
                throw new GroupDoesnotExits("User has not joined this group");
            }
        }
        snippetRepository.editSnippet(id, userId, title, description, content, language, visibility, groupId);

        if(snippet.getFolderId() != null){
            folderService.addSnippetToFolder(snippet.getFolderId(), id);
        }
    }


    public void deleteSnippet(int id) {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();

        snippetRepository.deleteSnippet(id, userId);
    }

    public List<SnippetVersionHistory> getVersionsOfASnippet(int id) {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();

        return snippetRepository.getVersionsOfASnippet(id, userId);
    }

    public SnippetVersion getSnippetFromVersion(Long id, int versionNumber) {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();

        return snippetRepository.getSnippetFromVersion(id, versionNumber, userId);
    }

    @Transactional
    public void restore(Long id, int versionNumber) {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();

        SnippetVersion snippetVersion = snippetRepository.getSnippetFromVersion(id, versionNumber, userId);

        Snippets snippet = snippetRepository.getSnippetById(id, userId);


        snippetRepository.editSnippet(id, userId, snippetVersion.getTitle(), snippetVersion.getDescription(), snippetVersion.getContent(), snippetVersion.getLanguage(), snippet.getVisibility(), snippet.getGroupId());
    }

    @Transactional
    public void fork(Long id, int versionNumber) throws GroupDoesnotExits, RuntimeException {
        CustomUserDetails user = SecurityUtils.getLoggedInUser();
        long userId = user.getId();

        Snippets result = snippetRepository.fork(id, versionNumber, userId);
        this.createSnippet(result);
    }
}
