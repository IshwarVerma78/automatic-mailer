import mongoose from 'mongoose';
const emailLogSchema = new mongoose.Schema({
    date: String,
    time: String,
    to: [String],
    position: String,
    cv: String,
    template: String,
    status: String,
    error_message: String
}, { timestamps: true });

const EmailLog = mongoose.model('EmailLog', emailLogSchema);
export default EmailLog;