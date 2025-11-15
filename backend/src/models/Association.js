import { User } from "./User.js";
import { Dorm } from "./Dorm.js";
import { Rating } from "./Rating.js";
import { Room } from "./Room.js";
import { User_personality } from "./User_personality.js";
import { Preferred_roommate } from "./Preferred_roommate.js";

// 🔗 Mongoose uses references instead of associations
// The relationships are defined through ref fields in each schema

// Personality relationships (via userId reference in User_personality)
// User.hasOne(User_personality) - User_personality has ref to User via userId

// Preferred roommate relationships (via userId reference in Preferred_roommate)
// User.hasOne(Preferred_roommate) - Preferred_roommate has ref to User via userId

// Rating relationships (via userId and dormId references in Rating)
// Rating.belongsTo(User) and Rating.belongsTo(Dorm)

// Room relationships (via dormId and current_resident_id references in Room)
// Room.belongsTo(Dorm) - Room has ref to Dorm via dormId
// Room.belongsTo(User) - Room has ref to User via current_resident_id

export { User, Dorm, Rating, Room, User_personality, Preferred_roommate };