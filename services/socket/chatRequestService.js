const logger = require("../../utils/logger");
const emitSocketError = require("../../utils/socketError");
const { createChatSession } = require("../sessions/sessionService");

function handleChatRequestEvents(socketManager, socket) {
    const { userId, role } = socket.user;

    socket.on('chat_request_send', async ({ ownerID }, callback) => {
        try {
            logger.info(`[SOCKET] chat_request_send initiated by user ${userId} to astrologer ${ownerID}`);
            if (!ownerID || ownerID === userId) {
                return callback?.({ success: false, message: 'Invalid ownerID. Please provide a valid ID.' });
            }
            // const busySessionId = await CacheService.isAstrologerBusy(astrologerId);
            // if (busySessionId) {
            //   return callback?.({ success: false, message: 'Astrologer is Busy' });
            // }
            // const allowed = await isValidationAllowed("ischatAllow");
            // if (!allowed) {
            //     return callback?.({ success: false, message: 'Chat Feature is Disabled.' });
            // }
            const session = await createChatSession({ userId, ownerId:ownerID });
            if (!session.success) {
                return callback?.({ success: false, message: session.error || 'Unable to create chat session.' });
            }
            const payload = {
                from: userId,
                sessionId: session.session_id,
                chatId: session.chat_id,
                duration: session.duration,
                ratePerMinute: session.rate_per_minute,
                totalAmount: session.total_amount,
                channelId: Enums.SERVICE.TYPE.CHAT,
                message: `New chat request from user ${userId}`,
                timestamp: Date.now()
            };
            const targetSockets = socketManager.userSockets.get(ownerID);
            let notifiedVia = 'none';
            logger.info(`[SOCKET] Sending chat request via socket to astrologer ${ownerID}`);
            if (targetSockets && targetSockets.size > 0) {
                logger.info(`[SOCKET] Sending chat request via socket to astrologer ${ownerID}`);
                socketManager.io.to(`user_${ownerID}`).emit('chat_request_received', payload);
                notifiedVia = 'socket';
            } else {
                (async () => {
                    try {
                        const pushSent = await sendPushNotification(
                            ownerID,
                            "New Chat Request",
                            payload.message,
                            payload
                        );
                        logger.info(`[SOCKET] Firebase push ${pushSent ? 'succeeded' : 'failed'} for astrologer ${ownerID}`);
                    } catch (pushErr) {
                        logger.error(`[SOCKET] Push notification failed for astrologer ${ownerID}:`, pushErr);
                    }
                })();
                notifiedVia = 'push';
            }
            return callback?.({
                success: true,
                sessionId: session.session_id,
                duration: session.duration,
                notifiedVia
            });

        } catch (error) {
            logger.error(`[SOCKET] chat_request_send error for user ${userId}:`, error);
            return emitSocketError(socket, 'chat_request_error', 'Failed to send chat request.');
        }
    });
}

module.exports = handleChatRequestEvents;