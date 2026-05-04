package com.localkart.controller;

import com.localkart.service.ChatBotService;
import com.localkart.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class ChatBotController {

    private final ChatBotService chatBotService;

    public ChatBotController(ChatBotService chatBotService) {
        this.chatBotService = chatBotService;
    }

    @PostMapping("/query")
    public ResponseEntity<?> query(@RequestBody Map<String, String> request) {
        String query = request.get("query");
        if (query == null || query.isBlank()) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", "Query cannot be empty", null));
        }
        String response = chatBotService.getResponse(query);
        return ResponseEntity.ok(new ApiResponse("success", "Response generated", response));
    }
}
