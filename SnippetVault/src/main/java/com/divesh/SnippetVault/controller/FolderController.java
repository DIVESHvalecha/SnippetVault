package com.divesh.SnippetVault.controller;

import com.divesh.SnippetVault.exceptions.GroupDoesnotExits;
import com.divesh.SnippetVault.models.Folder;
import com.divesh.SnippetVault.models.Snippets;
import com.divesh.SnippetVault.repository.FolderRepository;
import com.divesh.SnippetVault.service.FolderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class FolderController {

    @Autowired
    FolderService folderService;

    @PostMapping("/folder")
    public ResponseEntity<Map<String, String>> createFolder(@RequestBody Folder folder){
        try {
            folderService.createFolder(folder);
            return ResponseEntity.ok().body(Map.of("body", "Folder created successfully"));
        } catch (GroupDoesnotExits e) {
            return ResponseEntity.badRequest().body(Map.of("body", e.getMessage()));
        }
    }

    @GetMapping("/folder")
    public List<Folder> viewFolder(){
        return folderService.viewFolder();
    }

    @DeleteMapping("/folder/{id}")
    public  void deleteFolder(@PathVariable (name = "id") int folderId){
        folderService.deleteFolder(folderId);
    }

    @PostMapping("/folder/{id}/snippet/{snippetId}")
    public void addSnippetToFolder(@PathVariable (name = "id") Long folderId, @PathVariable (name = "snippetId") Long snippetId){
        folderService.addSnippetToFolder(folderId, snippetId);
    }

    @GetMapping("/folder/{id}/snippet")
    public List<Snippets> getSnippetsOfFolder(@PathVariable (name = "id") int folderId){
        return folderService.getSnippetsOfFolder(folderId);
    }

    @DeleteMapping("/folder/{id}/snippet/{snippetId}")
    public void deleteSnippetFromFolder(@PathVariable (name = "id") int folderId, @PathVariable (name = "snippetId") int snippetId){
        folderService.deleteSnippetFromFolder(folderId, snippetId);
    }
}
