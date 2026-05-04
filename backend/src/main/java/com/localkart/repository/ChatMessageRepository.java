package com.localkart.repository;

import com.localkart.entity.ChatMessage;
import com.localkart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByRoomIdOrderBySentAtAsc(String roomId);

    @Query("SELECT c FROM ChatMessage c WHERE c.recipient = :user AND c.isRead = false")
    List<ChatMessage> findUnreadMessages(User user);

    @Query("SELECT COUNT(c) FROM ChatMessage c WHERE c.recipient = :user AND c.isRead = false")
    long countUnreadMessages(User user);

    @Modifying
    @Query("UPDATE ChatMessage c SET c.isRead = true WHERE c.roomId = :roomId AND c.recipient = :user")
    void markRoomAsRead(String roomId, User user);

    @Query("SELECT DISTINCT c.roomId FROM ChatMessage c WHERE c.sender = :user OR c.recipient = :user ORDER BY c.roomId")
    List<String> findAllRoomsForUser(User user);
}
