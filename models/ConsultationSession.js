const mongoose = require('mongoose');
const Enums = require('../utils/constants');
const { Schema } = mongoose;

const consultationSessionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    owner_id: {
      type: Schema.Types.ObjectId,
      ref: 'Astrologer',
    },
    mode: {
      type: Number,
      enum: Object.values(Enums.SERVICE.TYPE),
      default: Enums.SERVICE.TYPE.CHAT,
    },
    start_time: { type: Date, required: true },
    end_time: { type: Date },
    duration_minutes: { type: Number, min: 1 },
    rate_per_minute: { type: Number, required: true, min: 1 },
    total_amount: { type: Number, min: 0 },
    owner_share_amount: {
      type: Number,
      min: 0,
      required: true,
    },
    commission_pct: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    status: {
      type: Number,
      enum: Object.values(Enums.SERVICE.STATUS),
      default: Enums.SERVICE.STATUS.PENDING,
    },
    payment_status: {
      type: Number,
      enum: Object.values(Enums.PAYMENT.STATUS),
      default: Enums.PAYMENT.STATUS.PENDING,
    },
    meeting_link: { type: String, trim: true },
    chat_id: { type: String, trim: true },
    is_free: { type: Boolean, default: false },
    last_extended_at: { type: Date, default: null }
  }, 
  { timestamps: true }
);

consultationSessionSchema.index({ user_id: 1 });
consultationSessionSchema.index({ astrologer_user_id: 1 });
consultationSessionSchema.index({ status: 1 });
consultationSessionSchema.index({ payment_status: 1 });
consultationSessionSchema.index({ user_id: 1, status: 1 });
consultationSessionSchema.index({ astrologer_user_id: 1, status: 1 });

module.exports = mongoose.model('ConsultationSession', consultationSessionSchema);