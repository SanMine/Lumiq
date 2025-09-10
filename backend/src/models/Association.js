import { User } from "./User.js";
import { Dorm } from "./Dorm.js";
import { Rating } from "./Rating.js";

// Rating associations
Rating.belongsTo(User, { foreignKey: 'userId' });
Rating.belongsTo(Dorm, { foreignKey: 'dormId' });

User.hasMany(Rating, { foreignKey: 'userId' });
Dorm.hasMany(Rating, { foreignKey: 'dormId' });

Room.belongsTo(Dorm, { foreignKey: 'dormId' });
Dorm.hasMany(Room, { foreignKey: 'dormId' });

export { User, Dorm, Rating, Room };