// Mock data for revenue trend
export const revenueData = [
  { month: 'Jan', revenue: 45000, bookings: 120 },
  { month: 'Feb', revenue: 52000, bookings: 145 },
  { month: 'Mar', revenue: 48000, bookings: 135 },
  { month: 'Apr', revenue: 61000, bookings: 168 },
  { month: 'May', revenue: 55000, bookings: 152 },
  { month: 'Jun', revenue: 67000, bookings: 185 },
  { month: 'Jul', revenue: 72000, bookings: 198 },
  { month: 'Aug', revenue: 68000, bookings: 190 },
];

// Mock data for booking statistics
export const bookingStats = [
  { name: 'Mon', bookings: 45 },
  { name: 'Tue', bookings: 52 },
  { name: 'Wed', bookings: 48 },
  { name: 'Thu', bookings: 61 },
  { name: 'Fri', bookings: 55 },
  { name: 'Sat', bookings: 67 },
  { name: 'Sun', bookings: 58 },
];

// Mock data for room occupancy
export const occupancyData = [
  { name: 'Single Room', value: 35, color: 'oklch(0.488 0.243 264.376)' },
  { name: 'Double Room', value: 45, color: 'oklch(0.696 0.17 162.48)' },
  { name: 'Suite', value: 15, color: 'oklch(0.769 0.188 70.08)' },
  { name: 'Vacant', value: 5, color: 'oklch(0.929 0.013 255.508)' },
];

// Mock data for recent bookings
export const recentBookings = [
  {
    id: 1,
    guest: 'John Smith',
    room: 'Room 101 - Single',
    checkIn: '2024-01-15',
    checkOut: '2024-01-20',
    status: 'Confirmed',
    amount: 450,
  },
  {
    id: 2,
    guest: 'Sarah Johnson',
    room: 'Room 205 - Double',
    checkIn: '2024-01-16',
    checkOut: '2024-01-22',
    status: 'Confirmed',
    amount: 780,
  },
  {
    id: 3,
    guest: 'Mike Davis',
    room: 'Suite 301',
    checkIn: '2024-01-18',
    checkOut: '2024-01-25',
    status: 'Pending',
    amount: 1200,
  },
  {
    id: 4,
    guest: 'Emily Wilson',
    room: 'Room 102 - Single',
    checkIn: '2024-01-17',
    checkOut: '2024-01-19',
    status: 'Confirmed',
    amount: 320,
  },
  {
    id: 5,
    guest: 'David Brown',
    room: 'Room 210 - Double',
    checkIn: '2024-01-20',
    checkOut: '2024-01-28',
    status: 'Confirmed',
    amount: 1040,
  },
];

// Mock data for dorm management
export const dormRooms = [
  {
    id: 1,
    roomNumber: '101',
    type: 'Single',
    price: 450,
    status: 'Occupied',
    occupant: 'John Smith',
  },
  {
    id: 2,
    roomNumber: '102',
    type: 'Single',
    price: 450,
    status: 'Available',
    occupant: null,
  },
  {
    id: 3,
    roomNumber: '205',
    type: 'Double',
    price: 650,
    status: 'Occupied',
    occupant: 'Sarah Johnson',
  },
  {
    id: 4,
    roomNumber: '210',
    type: 'Double',
    price: 650,
    status: 'Occupied',
    occupant: 'David Brown',
  },
  {
    id: 5,
    roomNumber: '301',
    type: 'Suite',
    price: 1200,
    status: 'Maintenance',
    occupant: null,
  },
];

export interface Dorm {
  _id: number;
  name: string;
  location: string;
  description?: string;
  image_url?: string;
  availibility: boolean;
  facilities?: string[];
  price?: number;
  insurance_policy?: number;
  Water_fee?: number;
  Electricity_fee?: number;
  waterBillingType?: string;
  electricityBillingType?: string;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}
