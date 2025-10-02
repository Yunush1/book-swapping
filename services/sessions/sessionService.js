const userService = require('../user/UserService');
const Enums = require('../../utils/constants');
const ConsultationSession = require('../../models/ConsultationSession');
const logger = require('../../utils/logger');
// const { checkFreeSessionEligibility } = require('../admin/session/sessionSetting');
const User = require('../../models/user');

async function createChatSession({ userId, ownerId, mode = Enums.SERVICE.TYPE.CHAT }) {
  try {
    logger.info(`[createChatSession] Start: userId=${userId}, ownerId=${ownerId}`);
    // const astrologerDetails = await getAstrologerDetails(ownerId, {
    //   service_type:mode
    // });
    // if (!astrologerDetails) {
    //   throw new Error('Astrologer not found or service not available');
    // }
    // const { astrologer, serviceRate } = astrologerDetails;
    // if (!astrologer || !serviceRate?.rate) {
    //   throw new Error('Astrologer service rate not configured');
    // }
    // if (astrologer.is_busy) {
    //   throw new Error('Astrologer is Busy');
    // }
    // const rate = Number(serviceRate.rate);
    // if (isNaN(rate) || rate <= 0) {
    //   throw new Error('Invalid service rate configured');
    // }
    logger.info(`Found astrologer: ${astrologer._id}, rate: ₹${rate}`);
    const user = await User.findById(userId).lean();
    if (!user) throw new Error('User not found');
    const freeEligibility = await checkFreeSessionEligibility(user);
    if (freeEligibility.eligible) {
      logger.info(`User eligible for free session of ${freeEligibility.duration} minutes`);
      const session = await createFreeSession({
        userId,
        astrologer,
        ownerId,
        rate,
        mode,
        commission_pct: serviceRate.commission_pct,
        minutes: freeEligibility.duration,
      });
      return session;
    }
    const walletEligibility = await userService.getWalletSessionEligibility(userId, rate);
    if (!walletEligibility) {
      throw new Error('Could not verify wallet eligibility');
    }
    const { eligible, wallet, maxDuration, reason } = walletEligibility;
    if (!eligible) {
      throw new Error(reason || 'Not eligible for chat session');
    }
    if (!maxDuration || maxDuration <= 0) {
      throw new Error('Invalid session duration calculated');
    }
    logger.info(`Creating paid session for ${maxDuration} minutes`);
    return await createPaidSession({
      userId,
      astrologer,
      ownerId,
      rate,
      minutes: maxDuration,
      mode,
      commission_pct: serviceRate.commission_pct,
    });
  } catch (error) {
    logger.error(`[createChatSession] Failed: ${error.message}`, {
      userId,
      ownerId,
      error: error.stack
    });
    return {
      success: false,
      error: error.message,
      code: error.code || 'SESSION_CREATION_FAILED'
    };
  }
}

// async function createFreeSession({ userId, astrologer, ownerId, rate, mode, commission_pct, minutes }) {
//   if (!minutes || minutes <= 0) {
//     throw new Error('Invalid free session duration');
//   }

//   const now = new Date();
//   const end = new Date(now.getTime() + minutes * 60000);
//   const chatId = `chat_${userId}_${ownerId}_free_${Date.now()}`;
//   const totalAmount = rate * minutes;
//   const astrologerShareAmount = totalAmount * ((100 - commission_pct) / 100);
  
//   const session = await ConsultationSession.create({
//     user_id: userId,
//     astrologer_user_id: ownerId,
//     astrologer_id: astrologer._id,
//     mode,
//     start_time: now,
//     end_time: end,
//     duration_minutes: minutes,
//     rate_per_minute: rate,
//     total_amount: totalAmount,
//     status: Enums.SERVICE.STATUS.PENDING,
//     payment_status: Enums.PAYMENT.STATUS.PENDING,
//     chat_id: chatId,
//     is_free: true,
//     astrologer_share_amount: astrologerShareAmount,
//     commission_pct
//   });

//   logger.info(`Free session created: ${session._id} and mode: ${mode}`);

//   return {
//     success: true,
//     session_id: session._id,
//     chat_id: session.chat_id,
//     duration: session.duration_minutes,
//     astrologer_user_id: ownerId,
//     user_id: userId,
//     start_time: session.start_time,
//     total_amount: 0,
//     rate_per_minute: 0,
//     is_free: true
//   };
// }

async function getSession({sessionId}){
  const session =await ConsultationSession.findById(sessionId);
  return session;
}
async function createPaidSession({ userId, ownerId, rate, minutes,mode,commission_pct }) {
  if (!rate || rate <= 0) {
    throw new Error('Invalid rate provided for paid session');
  }

  if (!minutes || minutes <= 0) {
    throw new Error('Invalid duration requested for paid session');
  }

  const now = new Date();
  const end = new Date(now.getTime() + minutes * 60000);
  const chatId = `chat_${userId}_${ownerId}_${Date.now()}`;
  const totalAmount = rate * minutes;
  const astrologerShareAmount = totalAmount * ((100 - commission_pct) / 100);

  const session = await ConsultationSession.create({
    user_id: userId,
    owner_id: ownerId,
    mode: mode,
    start_time: now,
    end_time: end,
    duration_minutes: minutes,
    rate_per_minute: rate,
    total_amount: rate * minutes,
    status: Enums.SERVICE.STATUS.PENDING,
    payment_status: Enums.PAYMENT.STATUS.PENDING,
    chat_id: chatId,
    astrologer_share_amount: astrologerShareAmount,
    commission_pct
  });

  logger.info(`Paid session created: ${session._id} and mode :${mode}`);
  
  return {
    success: true,
    session_id: session._id,
    chat_id: session.chat_id,
    duration: session.duration_minutes,
    astrologer_user_id: astrologerUserId,
    user_id: userId,
    start_time: session.start_time,
    total_amount: session.total_amount,
    rate_per_minute: session.rate_per_minute
  };
}

async function handleAstroShareProcessing({ sessionId, astroShare, isFree }) {
  try {
    const session = await ConsultationSession.findById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    logger.info(`[AstroShare] Processing astro share for session: ${sessionId}`);
    if (isFree) {
          logger.info('[AstroShare]  astro share — session is free.');
          session.astrologer_share_amount = 0;
    }
    else{
    session.astrologer_share_amount = astroShare;
    }
    await session.save();
  } catch (err) {
    logger.error(`[AstroShare] Failed to process astro share for session ${sessionId}: ${err.message}`, err);
  }
}

module.exports = {
  createChatSession,
  handleAstroShareProcessing,
  getSession
};