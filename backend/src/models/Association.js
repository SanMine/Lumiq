import { User } from "./User.js";
import { Dorm } from "./Dorm.js";
import { Rating } from "./Rating.js";
import { Room } from "./Room.js";

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

export { User, Dorm, Rating, Room };