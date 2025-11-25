
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Message } from '../models/Message.js';
import { Conversation } from '../models/Conversation.js';
import { Notification } from '../models/Notification.js';
import { connectDatabase } from '../db/connection.js';

dotenv.config();

const resetChatData = async () => {
    try {
        await connectDatabase();
        console.log('🔌 Connected to database');

        console.log('🗑️  Deleting all Messages...');
        await Message.deleteMany({});
        console.log('✅ Messages cleared');

        console.log('🗑️  Deleting all Conversations...');
        await Conversation.deleteMany({});
        console.log('✅ Conversations cleared');

        console.log('🗑️  Deleting all Notifications...');
        await Notification.deleteMany({});
        console.log('✅ Notifications cleared');

        console.log('✨ Chat data reset complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting chat data:', error);
        process.exit(1);
    }
};

resetChatData();
