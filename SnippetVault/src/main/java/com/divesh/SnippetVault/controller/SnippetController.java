package com.divesh.SnippetVault.controller;

import com.divesh.SnippetVault.DTO.SnippetVersionHistory;
import com.divesh.SnippetVault.exceptions.GroupDoesnotExits;
import com.divesh.SnippetVault.models.SnippetVersion;
import com.divesh.SnippetVault.models.Snippets;
import com.divesh.SnippetVault.service.SnippetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class SnippetController {

    @Autowired
    SnippetService snippetService;

    @PostMapping("/create-snippet")
    public ResponseEntity<Map<String, String>> createSnippet(@RequestBody Snippets snippet) {
        try {
            snippetService.createSnippet(snippet);
            return ResponseEntity.ok().body(Map.of("body", "Snippet created successfully"));
        } catch (GroupDoesnotExits e) {
            return ResponseEntity.badRequest().body(Map.of("body", e.getMessage()));
        }
    }

    // all public snippets
    @GetMapping("/snippets/public")
    public List<Snippets> getPublicSnippets() {
        return snippetService.getPublicSnippets();
    }

    // my all snippets
    @GetMapping("/snippets/own")
    public List<Snippets> getMySnippets() {
        return snippetService.getMySnippets();
    }

    // my private snippets
    @GetMapping("/snippets/private")
    public List<Snippets> getMyPrivateSnippets() {
        return snippetService.getMyPrivateSnippets();
    }

    // snippets of a specific group
    @GetMapping("/snippets/group/{groupCode}")
    public ResponseEntity<Map<String, Object>> getGroupSnippets(@PathVariable("groupCode") String groupCode) {
        try {
            List<Snippets> snippets = snippetService.getGroupSnippets(groupCode);
            return ResponseEntity.ok().body(Map.of("body", snippets));
        } catch (GroupDoesnotExits e) {
            return ResponseEntity.badRequest().body(Map.of("body", e.getMessage()));
        }
    }

    // get snippet by id
    @GetMapping("/snippets/{id:\\d+}")
    public ResponseEntity<Map<String, Object>> getSnippetById(@PathVariable("id") Long id) {
        Snippets snippet = snippetService.getSnippetById(id);
        return ResponseEntity.ok().body(Map.of("body", snippet));
    }

    // edit snippet
    @PatchMapping("/snippets/{id}")
    public ResponseEntity<Map<String, Object>> editSnippet(@PathVariable("id") Long id, @RequestBody Snippets snippet) {
        try {
            snippetService.editSnippet(id, snippet);
            return ResponseEntity.ok().body(Map.of("body", "Snippet edited successfully"));
        } catch (GroupDoesnotExits e) {
            return ResponseEntity.badRequest().body(Map.of("body", e.getMessage()));
        }
    }

    // delete snippet
    @DeleteMapping("/snippets/{id}")
    public void deleteSnippet(@PathVariable("id") int id) {
        snippetService.deleteSnippet(id);
    }

    // get versions of a snippet
    @GetMapping("/snippets/{id}/versions")
    public List<SnippetVersionHistory> getVersionsOfASnippet(@PathVariable("id") int id) {
        return snippetService.getVersionsOfASnippet(id);
    }

    // get snippet from version
    @GetMapping("/snippets/{id}/versions/{versionNumber}")
    public SnippetVersion getSnippetFromVersion(@PathVariable("id") Long id,
            @PathVariable("versionNumber") int versionNumber) {
        return snippetService.getSnippetFromVersion(id, versionNumber);
    }

    // restore snippet from version
    @PostMapping("/snippets/{id}/restore/{versionNumber}")
    public void restore(@PathVariable("id") Long id, @PathVariable("versionNumber") int versionNumber) {
        snippetService.restore(id, versionNumber);
    }

    // fork snippet
    @PostMapping("snippets/{id}/fork/{versionNumber}")
    public ResponseEntity<Map<String, String>> fork(@PathVariable("id") Long id,
            @PathVariable("versionNumber") int versionNumber) {
        try {
            snippetService.fork(id, versionNumber);
            return ResponseEntity.ok().body(Map.of("body", "Snippet created successfully"));
        } catch (GroupDoesnotExits | RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("body", e.getMessage()));
        }
    }
}
