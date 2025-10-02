const { Server } = require('socket.io');
const socketAuthMiddleware = require('../middleware/socketAuth');
const logger = require('../utils/logger');
const handleChatRequestEvents = require('../services/socket/chatRequestService');
const Enums = require('../utils/constants');

class SocketManager {
    constructor() {
        this.io = null,
            this.userSockets = new Map();
        this.onlineUsers = new Set();
        this.onlineAdmins = new Set();
        this.activeSessions = new Map();
        this.sessionTimeouts = new Map();
        this.disconnectTimeouts = new Map();
    }

    initialize(server) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.CLIENTS_URLS?.split(',') || ['http://localhost:3000'],
                methods: ['GET', 'POST'],
                credentials: true,
            },
            connectionStateRecovery: {
                maxDisconnectionDuration: 2 * 60 * 1000,
                skipMiddlewares: true
            }
        })
        this.io.use(socketAuthMiddleware)

        this.io.on('connection', (socket) => {
            const { userId, role } = socket.user
            logger.info('Socket connected: userId=' + userId + ', role=' + role);
            this.trackConnection(userId, socket.id, role);
            socket.join(`user_${userId}`);

            if (role === Enums.USER.ROLE.USER) {
                socket.join('users');
            } else if (role === Enums.USER.ROLE.ADMIN) {
                socket.join('admins');
            }
            handleChatRequestEvents(this, socket);
            this.broadcastOnlineLists();
            socket.on('disconnect', () => {
                this.cleanup(userId, socket.id, role);
                logger.info('Socket disconnected: userId=' + userId + ', role=' + role);
            })
        })
    }

    trackConnection(userId, socketId, role) {
        userId = userId.toString();
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());

            if (role === Enums.USER.ROLE.USER) {
                this.onlineUsers.add(userId);
            } else if (role === Enums.USER.ROLE.ADMIN) {
                this.onlineAdmins.add(userId);
            }
        }

        for (const [key, timeout] of this.disconnectTimeouts.entries()) {
            if (key.endsWith(`_${userId}`)) {
                clearTimeout(timeout);
                this.disconnectTimeouts.delete(key);
            }
        }

        this.userSockets.get(userId).add(socketId);
    }

    cleanup(userId, socketId, role) {
        userId = userId.toString();
        const sockets = this.userSockets.get(userId);
        if (sockets) {
            sockets.delete(socketId);
            if (sockets.size === 0) {
                this.userSockets.delete(userId);

                if (role === Enums.USER.ROLE.ASTROLOGER) {
                    this.onlineAstrologers.delete(userId);
                } else if (role === Enums.USER.ROLE.USER) {
                    this.onlineUsers.delete(userId);
                } else if (role === Enums.USER.ROLE.ADMIN) {
                    this.onlineAdmins.delete(userId);
                }
            }
        }
    }

    broadcastOnlineLists() {
        // this.io.to('users').emit('online_astrologers', Array.from(this.onlineAstrologers));
        this.io.to('astrologers').emit('online_users', Array.from(this.onlineUsers));
        this.io.to('admins').emit('online_users', Array.from(this.onlineUsers));
        // this.io.to('admins').emit('online_astrologers', Array.from(this.onlineAstrologers));
    }

    getActiveSession(userId) {
        return this.activeSessions.get(userId.toString());
    }

    setActiveSession(userId, astrologerId, sessionId) {
        this.activeSessions.set(userId.toString(), { astrologerId: astrologerId.toString(), sessionId });
        this.activeSessions.set(astrologerId.toString(), { userId: userId.toString(), sessionId });
    }

    clearActiveSession(userId, astrologerId) {
        this.activeSessions.delete(userId.toString());
        this.activeSessions.delete(astrologerId.toString());
    }
}


module.exports = new SocketManager();