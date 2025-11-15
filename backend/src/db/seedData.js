/**
 * Seed Data for MongoDB Collections
 * Creates dummy data with auto-incrementing numeric IDs
 * Run with: npm run seed
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { User } from '../models/User.js';
import { Dorm } from '../models/Dorm.js';
import { Room } from '../models/Room.js';
import { Rating } from '../models/Rating.js';
import { User_personality } from '../models/User_personality.js';
import { Preferred_roommate } from '../models/Preferred_roommate.js';

// Load environment variables
dotenv.config();

// Import connection and counter utilities
import { connectDatabase } from './connection.js';
import { resetAllCounters, Counter, getNextId } from './counter.js';

// Sample Users Data
const usersData = [
  {
    email: 'alice.chen@lumiq.edu',
    name: 'Alice Chen',
    passwordHash: 'Password123!',
    role: 'student',
  },
  {
    email: 'bob.smith@lumiq.edu',
    name: 'Bob Smith',
    passwordHash: 'SecurePass456!',
    role: 'student',
  },
  {
    email: 'carol.johnson@lumiq.edu',
    name: 'Carol Johnson',
    passwordHash: 'MyPassword789!',
    role: 'owner',
  },
  {
    email: 'admin@lumiq.edu',
    name: 'Admin User',
    passwordHash: 'AdminPass123!',
    role: 'admin',
  },
];

// Sample Dorms Data
const dormsData = [
  {
    name: 'Sunrise Heights Dormitory',
    location: 'Downtown District, Block 5',
    rating: 4.5,
    image_url: 'https://via.placeholder.com/400x300?text=Sunrise+Heights',
    description: 'Modern dormitory with excellent facilities, located near campus',
    availibility: true,
    facilities: 'WiFi, Cafeteria, Gym, Library, Security 24/7',
    insurance_policy: 500,
    Water_fee: 150,
    Electricity_fee: 200,
  },
  {
    name: 'Moonlight Residences',
    location: 'University Ave, District 2',
    rating: 4.2,
    image_url: 'https://via.placeholder.com/400x300?text=Moonlight+Residences',
    description: 'Cozy and affordable dorm with friendly community atmosphere',
    availibility: true,
    facilities: 'WiFi, Common Kitchen, Laundry, Study Rooms, Parking',
    insurance_policy: 300,
    Water_fee: 120,
    Electricity_fee: 180,
  },
  {
    name: 'StarLight Lodge',
    location: 'Riverside Road, District 7',
    rating: 4.8,
    image_url: 'https://via.placeholder.com/400x300?text=StarLight+Lodge',
    description: 'Premium dormitory with luxury amenities and top-tier service',
    availibility: true,
    facilities: 'WiFi, Fine Dining, Fitness Center, Swimming Pool, Entertainment Zone, 24/7 Security, Concierge',
    insurance_policy: 800,
    Water_fee: 250,
    Electricity_fee: 350,
  },
];

// Sample Rooms Data
const roomsData = [
  // Sunrise Heights rooms
  {
    room_number: '101',
    dormId: null, // Will be filled after dorm creation
    room_type: 'Double',
    capacity: 2,
    current_resident_id: null, // Will be filled after user creation
    price_per_month: 1500,
    floor: 1,
    status: 'Available',
    images: ['https://via.placeholder.com/400x300?text=Room+101'],
    expected_move_in_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    expected_available_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  },
  {
    room_number: '102',
    dormId: null,
    room_type: 'Single',
    capacity: 1,
    current_resident_id: null,
    price_per_month: 1200,
    floor: 1,
    status: 'Available',
    images: ['https://via.placeholder.com/400x300?text=Room+102'],
    expected_move_in_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    expected_available_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  // Moonlight Residences rooms
  {
    room_number: '201',
    dormId: null,
    room_type: 'Triple',
    capacity: 3,
    current_resident_id: null,
    price_per_month: 900,
    floor: 2,
    status: 'Available',
    images: ['https://via.placeholder.com/400x300?text=Room+201'],
    expected_move_in_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    expected_available_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    room_number: '202',
    dormId: null,
    room_type: 'Double',
    capacity: 2,
    current_resident_id: null,
    price_per_month: 1100,
    floor: 2,
    status: 'Occupied',
    images: ['https://via.placeholder.com/400x300?text=Room+202'],
    expected_move_in_date: new Date(),
    expected_available_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
  },
];

// Sample User Personalities
const personalitiesData = [
  {
    userId: null, // Will be filled after user creation
    nickname: 'Alice',
    age: 22,
    gender: 'Female',
    nationality: 'Thai',
    sleep_type: 'Night Owl',
    study_habits: 'some_noise',
    cleanliness: 'Tidy',
    social: 'Social',
    MBTI: 'ENFP',
    going_out: 'Frequent',
    smoking: false,
    drinking: 'Never',
    pets: 'Dog Person',
    noise_tolerance: 'Medium',
    temperature: 'Cool',
    lifestyle: ['Gym', 'Reading', 'Gaming'],
  },
  {
    userId: null, // Will be filled after user creation (Bob)
    nickname: 'Bob',
    age: 23,
    gender: 'Male',
    nationality: 'American',
    sleep_type: 'Early Bird',
    study_habits: 'silent',
    cleanliness: 'Moderate',
    social: 'Quiet',
    MBTI: 'INTJ',
    going_out: 'Occasional',
    smoking: false,
    drinking: 'Never',
    pets: 'Pet Friendly',
    noise_tolerance: 'Low',
    temperature: 'Warm',
    lifestyle: ['Sports', 'Coding', 'Music'],
  },
];

// Sample Preferred Roommates
const preferredRoommatesData = [
  {
    userId: null, // Will be filled after user creation (Alice)
    preferred_age_range: {
      min: 20,
      max: 25,
    },
    preferred_gender: 'Any',
    preferred_sleep_type: 'Night Owl',
    preferred_smoking: false,
    preferred_pets: false,
    preferred_noise_tolerance: 'Medium',
    preferred_cleanliness: 'Tidy',
    preferred_MBTI: 'ENFP',
    preferred_temperature: 'Cool',
    additional_preferences: 'Friendly and outgoing person who enjoys social activities',
    preferred_dorms: null, // Will be filled after dorm creation
  },
  {
    userId: null, // Will be filled after user creation (Bob)
    preferred_age_range: {
      min: 21,
      max: 24,
    },
    preferred_gender: 'Any',
    preferred_sleep_type: 'Early Bird',
    preferred_smoking: false,
    preferred_pets: true,
    preferred_noise_tolerance: 'Low',
    preferred_cleanliness: 'Tidy',
    preferred_MBTI: 'INTJ',
    preferred_temperature: 'Warm',
    additional_preferences: 'Quiet and focused person, interested in sports and technology',
    preferred_dorms: null,
  },
];

// Sample Ratings
const ratingsData = [
  {
    userId: null, // Alice
    dormId: null, // Sunrise Heights
    rating: 5,
  },
  {
    userId: null, // Bob
    dormId: null, // Moonlight Residences
    rating: 4,
  },
];

/**
 * Main seed function
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await connectDatabase();
    console.log('✅ Connected to MongoDB\n');

    // Reset all counters to start from 1
    console.log('🔄 Resetting ID counters...');
    await resetAllCounters();
    console.log('✅ Counters reset\n');

    // Clear existing data (OPTIONAL - comment out to preserve data)
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Dorm.deleteMany({});
    await Room.deleteMany({});
    await Rating.deleteMany({});
    await User_personality.deleteMany({});
    await Preferred_roommate.deleteMany({});
    await Counter.deleteMany({});
    console.log('✅ Data cleared\n');

    // Create Users (save individually with manual IDs)
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of usersData) {
      const id = await getNextId('users');
      const user = await User.create({ _id: id, ...userData });
      createdUsers.push(user);
      console.log(`   ${createdUsers.length}. ID: ${user._id} - ${user.name} (${user.email}) - ${user.role}`);
    }
    console.log(`✅ Created ${createdUsers.length} users\n`);

    // Create Dorms (save individually with manual IDs)
    console.log('🏢 Creating dorms...');
    const createdDorms = [];
    for (const dormData of dormsData) {
      const id = await getNextId('dorms');
      const dorm = await Dorm.create({ _id: id, ...dormData });
      createdDorms.push(dorm);
      console.log(`   ${createdDorms.length}. ID: ${dorm._id} - ${dorm.name} - ${dorm.location} - Rating: ${dorm.rating}⭐`);
    }
    console.log(`✅ Created ${createdDorms.length} dorms\n`);

    // Create Rooms with references to dorms (save individually with manual IDs)
    console.log('🏠 Creating rooms...');
    const createdRooms = [];
    for (let idx = 0; idx < roomsData.length; idx++) {
      const roomId = await getNextId('rooms');
      const room = {
        _id: roomId,
        ...roomsData[idx],
        dormId: createdDorms[Math.floor(idx / 2)]._id, // 2 rooms per dorm
      };
      const savedRoom = await Room.create(room);
      createdRooms.push(savedRoom);
      const dorm = createdDorms.find(d => d._id === savedRoom.dormId);
      console.log(`   ${createdRooms.length}. ID: ${savedRoom._id} - Room ${savedRoom.room_number} (${savedRoom.room_type}) - ${dorm.name} - ₿${savedRoom.price_per_month}/month`);
    }
    console.log(`✅ Created ${createdRooms.length} rooms\n`);

    // Create User Personalities (save individually with manual IDs)
    console.log('🎭 Creating user personalities...');
    const createdPersonalities = [];
    for (let idx = 0; idx < personalitiesData.length; idx++) {
      const personalityId = await getNextId('personalities');
      const personality = {
        _id: personalityId,
        ...personalitiesData[idx],
        userId: createdUsers[idx]._id,
      };
      const savedPersonality = await User_personality.create(personality);
      createdPersonalities.push(savedPersonality);
      console.log(`   ${createdPersonalities.length}. ID: ${savedPersonality._id} - ${savedPersonality.nickname} - ${savedPersonality.MBTI} - ${savedPersonality.nationality}`);
    }
    console.log(`✅ Created ${createdPersonalities.length} personality profiles\n`);

    // Create Preferred Roommates (save individually with manual IDs)
    console.log('💕 Creating preferred roommate preferences...');
    const createdPreferences = [];
    for (let idx = 0; idx < preferredRoommatesData.length; idx++) {
      const prefId = await getNextId('preferred_roommate');
      const pref = {
        _id: prefId,
        ...preferredRoommatesData[idx],
        userId: createdUsers[idx]._id,
        preferred_dorms: [createdDorms[0]._id], // Set preferred to first dorm
      };
      const savedPref = await Preferred_roommate.create(pref);
      createdPreferences.push(savedPref);
      console.log(`   ${createdPreferences.length}. ID: ${savedPref._id} - Age range: ${savedPref.preferred_age_range.min}-${savedPref.preferred_age_range.max} - ${savedPref.preferred_gender}`);
    }
    console.log(`✅ Created ${createdPreferences.length} roommate preference profiles\n`);

    // Create Ratings (save individually with manual IDs)
    console.log('⭐ Creating ratings...');
    const createdRatings = [];
    for (let idx = 0; idx < ratingsData.length; idx++) {
      const ratingId = await getNextId('ratings');
      const rating = {
        _id: ratingId,
        ...ratingsData[idx],
        userId: createdUsers[idx]._id,
        dormId: createdDorms[idx]._id,
      };
      const savedRating = await Rating.create(rating);
      createdRatings.push(savedRating);
      const user = createdUsers.find(u => u._id === savedRating.userId);
      const dorm = createdDorms.find(d => d._id === savedRating.dormId);
      console.log(`   ${createdRatings.length}. ID: ${savedRating._id} - ${user.name} rated ${dorm.name} - ${savedRating.rating}⭐`);
    }
    console.log(`✅ Created ${createdRatings.length} ratings\n`);

    // Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 Database seeding completed successfully!');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('📊 Summary:');
    console.log(`   ✅ ${createdUsers.length} Users created`);
    console.log(`   ✅ ${createdDorms.length} Dorms created`);
    console.log(`   ✅ ${createdRooms.length} Rooms created`);
    console.log(`   ✅ ${createdPersonalities.length} Personality profiles created`);
    console.log(`   ✅ ${createdPreferences.length} Roommate preferences created`);
    console.log(`   ✅ ${createdRatings.length} Ratings created\n`);

    console.log('🔐 Test Credentials:');
    createdUsers.forEach(user => {
      const originalData = usersData.find(u => u.email === user.email);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${originalData.passwordHash}\n`);
    });

    console.log('🚀 Next Steps:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Test login: POST http://localhost:5000/api/auth/login');
    console.log('   3. Use test credentials above\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeding
seedDatabase();
