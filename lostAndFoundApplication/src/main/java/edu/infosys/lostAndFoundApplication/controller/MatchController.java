package edu.infosys.lostAndFoundApplication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.infosys.lostAndFoundApplication.service.MatchService;

import java.util.*;


@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "http://localhost:3939")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @PostMapping("/find-with-notification")
    public ResponseEntity<List<Map<String, Object>>> findMatchesWithNotification(@RequestBody Map<String, Object> foundItem) {
        try {
            List<Map<String, Object>> matches = matchService.findMatches(foundItem);
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            System.out.println("Error in match controller: " + e.getMessage());
            return ResponseEntity.ok(List.of());
        }
    }
}
