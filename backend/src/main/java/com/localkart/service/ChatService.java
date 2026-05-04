package com.localkart.service;

import com.localkart.dto.ChatMessageDTO;
import com.localkart.entity.ChatMessage;
import com.localkart.entity.User;
import com.localkart.repository.ChatMessageRepository;
import com.localkart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public ChatService(ChatMessageRepository chatMessageRepository, UserRepository userRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
    }

    public static String buildRoomId(Integer userId, Integer vendorId) {
        return "user_" + userId + "_vendor_" + vendorId;
    }

    @Transactional
    public ChatMessageDTO sendMessage(Integer senderId, Integer recipientId, String message,
                                      String messageType, Double offerPrice, Integer productId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        // Determine roomId: always user_X_vendor_Y
        Integer userId = "VENDOR".equals(sender.getRole()) ? recipientId : senderId;
        Integer vendorId = "VENDOR".equals(sender.getRole()) ? senderId : recipientId;
        String roomId = buildRoomId(userId, vendorId);

        ChatMessage msg = new ChatMessage();
        msg.setRoomId(roomId);
        msg.setSender(sender);
        msg.setRecipient(recipient);
        msg.setMessage(message);
        msg.setMessageType(messageType != null ? messageType : "TEXT");
        msg.setOfferPrice(offerPrice);
        msg.setProductId(productId);
        msg.setIsRead(false);

        ChatMessage saved = chatMessageRepository.save(msg);
        return convertToDTO(saved);
    }

    public List<ChatMessageDTO> getMessages(Integer userId, Integer vendorId) {
        String roomId = buildRoomId(userId, vendorId);
        return chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId)
                .stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Integer userId, Integer vendorId, Integer readerId) {
        String roomId = buildRoomId(userId, vendorId);
        User reader = userRepository.findById(readerId).orElse(null);
        if (reader != null) {
            chatMessageRepository.markRoomAsRead(roomId, reader);
        }
    }

    public long getUnreadCount(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return 0;
        return chatMessageRepository.countUnreadMessages(user);
    }

    public List<String> getConversations(Integer userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return List.of();
        return chatMessageRepository.findAllRoomsForUser(user);
    }

    private ChatMessageDTO convertToDTO(ChatMessage msg) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(msg.getId());
        dto.setRoomId(msg.getRoomId());
        dto.setMessage(msg.getMessage());
        dto.setMessageType(msg.getMessageType());
        dto.setOfferPrice(msg.getOfferPrice());
        dto.setProductId(msg.getProductId());
        dto.setIsRead(msg.getIsRead());
        dto.setSentAt(msg.getSentAt());

        if (msg.getSender() != null) {
            dto.setSenderId(msg.getSender().getId());
            dto.setSenderName(msg.getSender().getName());
            dto.setSenderRole(msg.getSender().getRole());
        }
        if (msg.getRecipient() != null) {
            dto.setRecipientId(msg.getRecipient().getId());
            dto.setRecipientName(msg.getRecipient().getName());
        }
        return dto;
    }
}
