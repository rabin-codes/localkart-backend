package com.localkart.controller;

import com.localkart.dto.ChatMessageDTO;
import com.localkart.security.CustomUserDetails;
import com.localkart.service.ChatService;
import com.localkart.util.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /** Get all messages in a conversation between user and vendor */
    @GetMapping("/messages/{vendorId}")
    public ResponseEntity<?> getMessages(@AuthenticationPrincipal CustomUserDetails userDetails,
                                         @PathVariable Integer vendorId) {
        // Determine userId and vendorId based on caller role
        Integer userId = userDetails.getUserId();
        List<ChatMessageDTO> messages = chatService.getMessages(userId, vendorId);
        return ResponseEntity.ok(new ApiResponse("success", "Messages retrieved", messages));
    }

    /** Send a message to vendor (or user) */
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@AuthenticationPrincipal CustomUserDetails userDetails,
                                         @RequestBody Map<String, Object> payload) {
        try {
            Integer recipientId = (Integer) payload.get("recipientId");
            String message = (String) payload.get("message");
            String messageType = (String) payload.getOrDefault("messageType", "TEXT");
            Double offerPrice = payload.get("offerPrice") != null
                    ? ((Number) payload.get("offerPrice")).doubleValue() : null;
            Integer productId = payload.get("productId") != null
                    ? (Integer) payload.get("productId") : null;

            ChatMessageDTO sent = chatService.sendMessage(
                    userDetails.getUserId(), recipientId, message, messageType, offerPrice, productId);
            return ResponseEntity.ok(new ApiResponse("success", "Message sent", sent));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("error", e.getMessage(), null));
        }
    }

    /** Mark messages as read */
    @PutMapping("/read/{vendorId}")
    public ResponseEntity<?> markAsRead(@AuthenticationPrincipal CustomUserDetails userDetails,
                                        @PathVariable Integer vendorId) {
        chatService.markAsRead(userDetails.getUserId(), vendorId, userDetails.getUserId());
        return ResponseEntity.ok(new ApiResponse("success", "Messages marked as read", null));
    }

    /** Get unread message count */
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(@AuthenticationPrincipal CustomUserDetails userDetails) {
        long count = chatService.getUnreadCount(userDetails.getUserId());
        return ResponseEntity.ok(new ApiResponse("success", "Unread count", Map.of("count", count)));
    }

    /** Get all conversations for current user */
    @GetMapping("/conversations")
    public ResponseEntity<?> getConversations(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<String> rooms = chatService.getConversations(userDetails.getUserId());
        return ResponseEntity.ok(new ApiResponse("success", "Conversations retrieved", rooms));
    }
}
