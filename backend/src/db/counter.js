/**
 * Auto-increment Counter Utility
 * Manages auto-incrementing IDs for all collections
 */

import mongoose from 'mongoose';

// Counter Schema
const CounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model('Counter', CounterSchema, 'counters');

/**
 * Get next ID for a collection
 * @param {string} name - Collection name (e.g., 'users', 'dorms', 'rooms')
 * @returns {Promise<number>} - Next ID
 */
export async function getNextId(name) {
  try {
    const counter = await Counter.findByIdAndUpdate(
      name,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return counter.seq;
  } catch (error) {
    console.error(`❌ Error getting next ID for ${name}:`, error);
    throw error;
  }
}

/**
 * Reset counter (useful for development/testing)
 * @param {string} name - Collection name
 */
export async function resetCounter(name) {
  try {
    await Counter.findByIdAndUpdate(name, { seq: 0 }, { upsert: true });
    console.log(`✅ Counter reset for ${name}`);
  } catch (error) {
    console.error(`❌ Error resetting counter for ${name}:`, error);
    throw error;
  }
}

/**
 * Reset all counters
 */
export async function resetAllCounters() {
  try {
    const counters = ['users', 'dorms', 'rooms', 'ratings', 'personalities', 'preferred_roommate'];
    for (const counter of counters) {
      await resetCounter(counter);
    }
    console.log('✅ All counters reset');
  } catch (error) {
    console.error('❌ Error resetting all counters:', error);
    throw error;
  }
}

/**
 * Get current ID for a collection (without incrementing)
 * @param {string} name - Collection name
 * @returns {Promise<number>} - Current ID
 */
export async function getCurrentId(name) {
  try {
    const counter = await Counter.findById(name);
    return counter ? counter.seq : 0;
  } catch (error) {
    console.error(`❌ Error getting current ID for ${name}:`, error);
    throw error;
  }
}

export { Counter };
