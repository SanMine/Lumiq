/**
 * In-memory tracker for active chat sessions
 * Tracks which users have which conversations actively open
 * 
 * Data structure: Map<userId, Set<conversationId>>
 * This allows a user to have multiple conversations open simultaneously
 */

const activeSessions = new Map();

/**
 * Mark a conversation as actively open for a user
 * @param {number} userId - The user ID
 * @param {number} conversationId - The conversation ID
 */
export function setActiveChatSession(userId, conversationId) {
    if (!activeSessions.has(userId)) {
        activeSessions.set(userId, new Set());
    }
    activeSessions.get(userId).add(conversationId);
    console.log(`✅ Chat session activated: User ${userId} - Conversation ${conversationId}`);
    console.log(`📊 Active sessions:`, Array.from(activeSessions.entries()).map(([uid, convs]) =>
        ({ userId: uid, conversations: Array.from(convs) })
    ));
}

/**
 * Mark a conversation as closed/inactive for a user
 * @param {number} userId - The user ID
 * @param {number} conversationId - The conversation ID
 */
export function clearActiveChatSession(userId, conversationId) {
    if (activeSessions.has(userId)) {
        activeSessions.get(userId).delete(conversationId);

        // Clean up empty sets to prevent memory leaks
        if (activeSessions.get(userId).size === 0) {
            activeSessions.delete(userId);
        }

        console.log(`🔒 Chat session closed: User ${userId} - Conversation ${conversationId}`);
    }
}

/**
 * Check if a user has a specific conversation actively open
 * @param {number} userId - The user ID
 * @param {number} conversationId - The conversation ID
 * @returns {boolean} - True if the conversation is active for the user
 */
export function isConversationActive(userId, conversationId) {
    const active = activeSessions.has(userId) && activeSessions.get(userId).has(conversationId);
    console.log(`🔍 Checking active session: User ${userId} - Conversation ${conversationId}: ${active}`);
    return active;
}

/**
 * Clear all active sessions for a user (useful for logout scenarios)
 * @param {number} userId - The user ID
 */
export function clearAllUserSessions(userId) {
    if (activeSessions.has(userId)) {
        activeSessions.delete(userId);
        console.log(`🧹 Cleared all sessions for User ${userId}`);
    }
}

/**
 * Get all active conversations for a user
 * @param {number} userId - The user ID
 * @returns {number[]} - Array of active conversation IDs
 */
export function getActiveConversations(userId) {
    if (activeSessions.has(userId)) {
        return Array.from(activeSessions.get(userId));
    }
    return [];
}
