import { User } from "./User.js";
import { Dorm } from "./Dorm.js";
import { Rating } from "./Rating.js";
import { Room } from "./Room.js";
import { User_personality } from "./User_personality.js"; 
import { Preferred_roommate } from "./Preferred_roommate.js";

// Personality associations
User_personality.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(User_personality, { foreignKey: 'userId' });

// Preferred roommate associations
Preferred_roommate.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Preferred_roommate, { foreignKey: 'userId' });

// Rating associations
Rating.belongsTo(User, { foreignKey: 'userId' });
Rating.belongsTo(Dorm, { foreignKey: 'dormId' });

User.hasMany(Rating, { foreignKey: 'userId' });
Dorm.hasMany(Rating, { foreignKey: 'dormId' });

// Room associations
Room.belongsTo(Dorm, { foreignKey: 'dormId' });
Room.belongsTo(User, { 
  foreignKey: 'current_resident_id', 
  as: 'CurrentResident' 
});

Dorm.hasMany(Room, { foreignKey: 'dormId' });
User.hasOne(Room, { 
  foreignKey: 'current_resident_id', 
  as: 'CurrentRoom' 
});

// 🔧 ISSUE FIXED: Added User_personality to exports (was missing before)
// This was causing the personalities routes to fail when importing the model
export { User, Dorm, Rating, Room, User_personality, Preferred_roommate };