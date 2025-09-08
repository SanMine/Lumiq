📊 LUMIQ Dormitory System (Thailand)
│
├── 👥 STUDENTS TABLE
│   │
│   ├── 👤 Student [ID: 1] "John Doe"
│   │   ├── 📧 Email: johndoe@gmail.com
│   │   ├── 💭 About: "Engineering student, 2nd year"
│   │   ├── 📱 Phone: +66 81-234-5678
│   │   └── 📋 CONTRACTS (One-to-Many)
│   │       ├── 🏠 Contract [ID: 1] ⭐ ACTIVE
│   │       │   ├── 📅 Move-in: 2025-01-01
│   │       │   ├── 📅 Expected move-out: Open-ended
│   │       │   ├── 📅 Booked on: 2024-12-20
│   │       │   ├── 💰 Monthly rent: ฿3,500/month
│   │       │   ├── 🛡️ Insurance: ฿6,000 (refundable after 6 months)
│   │       │   ├── 💧 Water: ฿100/person/month
│   │       │   ├── ⚡ Electricity: ฿8/unit (varies monthly)
│   │       │   ├── 📊 Status: active (living in room)
│   │       │   ├── 🏠 Room: 302 @ Holly Star
│   │       │   ├── 📞 Emergency contact: Jane Doe (+66 81-111-2222)
│   │       │   └── 📝 Special: "Quiet room requested"
│   │       │
│   │       └── 💳 Monthly Bills
│   │           ├── 🧾 January 2025: ฿3,650 (Rent ฿3,500 + Water ฿100 + Electric ฿50)
│   │           ├── 🧾 February 2025: ฿3,720 (Rent ฿3,500 + Water ฿100 + Electric ฿120)
│   │           └── 🧾 March 2025: Due ฿3,680 (pending)
│   │
│   ├── 👤 Student [ID: 2] "Ploy Siriporn"
│   │   ├── 📧 Email: ploy.siriporn@gmail.com
│   │   ├── 💭 About: "Medical student, 3rd year"
│   │   ├── 📱 Phone: +66 82-345-6789
│   │   └── 📋 CONTRACTS
│   │       ├── 🏠 Contract [ID: 2] 🎓 COMPLETED
│   │       │   ├── 📅 Move-in: 2024-08-01
│   │       │   ├── 📅 Move-out: 2025-01-15 (stayed 5.5 months)
│   │       │   ├── 💰 Monthly rent: ฿2,500/month
│   │       │   ├── 🛡️ Insurance: ฿3,000 (❌ NOT refunded - stayed < 6 months)
│   │       │   ├── 📊 Status: completed
│   │       │   ├── 🏠 Room: 12 @ Molly Dorm
│   │       │   └── 📝 Reason: "Graduated early"
│   │       │
│   │       └── 🏠 Contract [ID: 4] ⏳ PENDING
│   │           ├── 📅 Planned move-in: 2025-03-01
│   │           ├── 📅 Booked on: 2025-01-28
│   │           ├── 💰 Monthly rent: ฿2,800/month
│   │           ├── 🛡️ Insurance: ฿4,000 (refundable after 6 months)
│   │           ├── 📊 Status: approved (waiting for move-in)
│   │           └── 🏠 Room: 13 @ Molly Dorm
│   │
│   └── 👤 Student [ID: 3] "Sarah Wilson"
│       ├── 📧 Email: sarah.wilson@gmail.com
│       ├── 💭 About: "Exchange student (6 months)"
│       └── 📋 CONTRACTS: 🔍 (browsing options)
│
├── 🏢 DORMITORIES TABLE
│   │
│   ├── 🏨 Dorm [ID: 1] "Holly Star Dormitory"
│   │   ├── 📍 Location: Sukhumvit 71, Bangkok
│   │   ├── ⭐ Rating: 4.5/5.0 (based on 127 reviews)
│   │   ├── 🛡️ Insurance Policy: ฿6,000 (refund after 6 months)
│   │   ├── 💧 Water fee: ฿100/person/month
│   │   ├── ⚡ Electricity: ฿8/unit
│   │   ├── 🏋️ Facilities: ["Gym", "Parking lot", "24/7 Security", "Swimming Pool", "Laundry"]
│   │   ├── 👤 Admin: Mr. Somchai (+66 2-123-4567)
│   │   ├── 🕒 Office hours: 8:00 AM - 8:00 PM
│   │   ├── 📋 Rules: "No pets, No smoking, Quiet hours 10 PM - 6 AM"
│   │   └── 🚪 ROOMS (One-to-Many)
│   │       ├── 🏠 Room [ID: 1] "302"
│   │       │   ├── 💰 Rent: ฿3,500/month
│   │       │   ├── 📝 Type: "Deluxe Air-con room"
│   │       │   ├── 👥 Capacity: 2 students
│   │       │   ├── 🛏️ Amenities: ["AC", "WiFi", "Private bathroom", "Mini fridge", "Study desk"]
│   │       │   ├── 🔒 Status: OCCUPIED
│   │       │   └── 👤 Current resident: John Doe (since Jan 1, 2025)
│   │       │
│   │       ├── 🏠 Room [ID: 2] "303"
│   │       │   ├── 💰 Rent: ฿3,000/month
│   │       │   ├── 📝 Type: "Standard Air-con room"
│   │       │   ├── 👥 Capacity: 2 students
│   │       │   ├── 🛏️ Amenities: ["AC", "WiFi", "Shared bathroom", "Study desk"]
│   │       │   ├── 🔓 Status: AVAILABLE
│   │       │   └── 📅 Available from: NOW
│   │       │
│   │       └── 🏠 Room [ID: 3] "304"
│   │           ├── 💰 Rent: ฿4,000/month
│   │           ├── 📝 Type: "Premium suite"
│   │           ├── 👥 Capacity: 1 student
│   │           ├── 🛏️ Amenities: ["AC", "WiFi", "Private bathroom", "Balcony", "Kitchenette", "Premium furniture"]
│   │           ├── 🔓 Status: AVAILABLE
│   │           └── 📅 Available from: NOW
│   │
│   ├── 🏨 Dorm [ID: 2] "Molly Student House"
│   │   ├── 📍 Location: Ramkhamhaeng 24, Bangkok
│   │   ├── ⭐ Rating: 3.8/5.0 (based on 89 reviews)
│   │   ├── 🛡️ Insurance Policy: ฿4,000 (refund after 6 months)
│   │   ├── 💧 Water fee: ฿80/person/month
│   │   ├── ⚡ Electricity: ฿7/unit
│   │   ├── 🏋️ Facilities: ["Parking", "24/7 Security", "Common kitchen", "Study room"]
│   │   ├── 👤 Admin: Ms. Niran (+66 2-234-5678)
│   │   └── 🚪 ROOMS
│   │       ├── 🏠 Room [ID: 4] "12"
│   │       │   ├── 💰 Rent: ฿2,500/month
│   │       │   ├── 📝 Type: "Budget fan room"
│   │       │   ├── 👥 Capacity: 1 student
│   │       │   ├── 🛏️ Amenities: ["Fan", "WiFi", "Shared bathroom"]
│   │       │   ├── 🔓 Status: AVAILABLE (recently vacated)
│   │       │   └── 📅 Available from: Jan 16, 2025
│   │       │
│   │       └── 🏠 Room [ID: 5] "13"
│   │           ├── 💰 Rent: ฿2,800/month
│   │           ├── 📝 Type: "Budget AC room"
│   │           ├── 👥 Capacity: 1 student
│   │           ├── 🛏️ Amenities: ["AC", "WiFi", "Shared bathroom"]
│   │           ├── ⏳ Status: RESERVED (for Ploy's move-in March 1)
│   │           └── 📅 Available from: March 1, 2025
│   │
│   └── 🏨 Dorm [ID: 3] "Green View Residence"
│       ├── 📍 Location: Near CMU, Chiang Mai
│       ├── ⭐ Rating: 4.2/5.0 (based on 56 reviews)
│       ├── 🛡️ Insurance Policy: ฿5,000 (refund after 4 months)
│       ├── 💧 Water fee: ฿120/person/month
│       ├── ⚡ Electricity: ฿6/unit
│       ├── 🏋️ Facilities: ["Mountain view", "Garden", "Parking", "Bike rental"]
│       └── 🚪 ROOMS
│           ├── 🏠 Room [ID: 6] "A1"
│           │   ├── 💰 Rent: ฿2,200/month
│           │   ├── 🛏️ Amenities: ["Fan", "WiFi", "Mountain view", "Shared bathroom"]
│           │   └── 🔓 Status: AVAILABLE
│           │
│           └── 🏠 Room [ID: 7] "A2"
│               ├── 💰 Rent: ฿2,400/month
│               ├── 🛏️ Amenities: ["Fan", "WiFi", "Garden view", "Private bathroom"]
│               └── 🔓 Status: AVAILABLE
│
├── 🎫 CONTRACTS TABLE (Student-Room Relationship)
│   │
│   ├── 📋 Contract [ID: 1] 🏠 ACTIVE
│   │   ├── 👤 Student: John Doe
│   │   ├── 🏠 Room: 302 @ Holly Star
│   │   ├── 📅 Contract period: Jan 1, 2025 → Open-ended
│   │   ├── 💰 Financial summary:
│   │   │   ├── Monthly rent: ฿3,500
│   │   │   ├── Insurance paid: ฿6,000 (refundable after 6 months = July 1, 2025)
│   │   │   ├── Water: ฿100/month
│   │   │   └── Electricity: Variable (฿8/unit)
│   │   ├── 📊 Status: active
│   │   └── 🏆 Insurance eligibility: ✅ (if stays until July 1, 2025)
│   │
│   ├── 📋 Contract [ID: 2] 📄 COMPLETED
│   │   ├── 👤 Student: Ploy Siriporn
│   │   ├── 🏠 Room: 12 @ Molly
│   │   ├── 📅 Contract period: Aug 1, 2024 → Jan 15, 2025 (5.5 months)
│   │   ├── 💰 Insurance: ฿3,000 (❌ NOT refunded - stayed < 6 months)
│   │   ├── 📊 Status: completed
│   │   └── 💸 Financial loss: ฿3,000 (insurance forfeited)
│   │
│   └── 📋 Contract [ID: 4] ⏳ APPROVED
│       ├── 👤 Student: Ploy Siriporn
│       ├── 🏠 Room: 13 @ Molly
│       ├── 📅 Contract period: Mar 1, 2025 → Open-ended
│       ├── 💰 Insurance: ฿4,000 (refundable after 6 months = Sep 1, 2025)
│       └── 📊 Status: approved (waiting for move-in)
│
└── 💳 MONTHLY BILLS TABLE
    │
    ├── 🧾 Bill [Jan 2025] - John Doe
    │   ├── 💰 Rent: ฿3,500
    │   ├── 💧 Water: ฿100
    │   ├── ⚡ Electricity: ฿50 (6.25 units × ฿8)
    │   ├── 📊 Total: ฿3,650
    │   └── ✅ Status: paid (Jan 5, 2025)
    │
    ├── 🧾 Bill [Feb 2025] - John Doe
    │   ├── 💰 Rent: ฿3,500
    │   ├── 💧 Water: ฿100
    │   ├── ⚡ Electricity: ฿120 (15 units × ฿8)
    │   ├── 📊 Total: ฿3,720
    │   └── ✅ Status: paid (Feb 3, 2025)
    │
    └── 🧾 Bill [Mar 2025] - John Doe
        ├── 💰 Rent: ฿3,500
        ├── 💧 Water: ฿100
        ├── ⚡ Electricity: ฿80 (10 units × ฿8) [estimate]
        ├── 📊 Total: ฿3,680
        ├── 📅 Due: Mar 5, 2025
        └── ⏳ Status: pending