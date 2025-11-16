import dorm1 from '@/assets/dorm-1.jpg'
import dorm2 from '@/assets/dorm-2.jpg'
import dorm3 from '@/assets/dorm-3.jpg'

export const APP_NAME = "Lumiq";
export const SIGNIN = "Sign In";
export const SIGNIN_TITLE = "Welcome Back! 💫";
export const SIGNIN_SUBTITLE = "The faster you fill up, the faster you get your match.";
export const SIGNUP = "Sign Up";
export const SIGNUP_TITLE = "Create your dorm account ✨";
export const SIGNUP_SUBTITLE = "Join now and get matched with your ideal roommate.";

export const NAVLINKS = [
    { to: "/", name: "Home" },
    { to: "/roommate-match", name: "Roommates Matching" },
    { to: "/dorms", name: "All Dormitories" },
    { to: "/account", name: "Account" },
]

export const cards = [
    {
        title: "Explore Dorms",
        subTitle: "Browse our extensive list of student housing options.",
        to: "/dorms"
    },
    {
        title: "Roommate Matching",
        subTitle: "Find compatible roommates with our smart algorithm.",
        to: "/roommate-match"
    }
]

export const dorms = [
    {
        id: 1,
        name: "Campus View Apartments",
        description: "Spacious room with stunning campus views.",
        image: dorm1,
    },
    {
        id: 2,
        name: "The Grove Residences",
        description: "Comfortable living with lush green surroundings.",
        image: dorm2,
    },
    {
        id: 3,
        name: "Urban Living Suites",
        description: "Modern amenities in the heart of the city.",
        image: dorm3,
    }
]

export const footerLinks = [
    {
        title: "Site Map",
        items: [
            {
                title: "Home",
                href: "/",
            },
            {
                title: "About Us",
                href: "/about",
            },
            {
                title: "Dorms",
                href: "/dorms",
            },
            {
                title: "Roomates",
                href: "/roommates",
            },
            {
                title: "Contact",
                href: "/",
            },
        ],
    },
    {
        title: "Legal",
        items: [
            {
                title: "Privacy Policy",
                href: "/about",
            },
            {
                title: "Terms of Service",
                href: "/contact",
            },
            {
                title: "Lawyer's Corners",
                href: "/terms",
            },
        ],
    },
]

export const faqs = [
    {
        question: 'What are the dorm check-in and check-out times?',
        answer: 'Check-in is available from 8:00 AM to 8:00 PM on weekdays, and check-out must be completed by 12:00 PM on the departure date.',
    },
    {
        question: 'Are meals included in the dormitory fee?',
        answer: 'Meals are not included in the dormitory fee. Students can purchase meal plans separately or use the campus cafeteria and nearby food options.',
    },
    {
        question: 'Is there transportation provided to the dormitory?',
        answer: 'The university shuttle bus and local public transport routes stop near the dormitory. No direct airport transfer is provided.',
    },
    {
        question: 'Can I cancel or withdraw from the dormitory application?',
        answer: 'Yes, students may withdraw their dormitory application before the semester begins with a full refund. After moving in, refund policies follow the university’s dormitory regulations.',
    },
    {
        question: 'Are visitors allowed in the dormitory?',
        answer: 'Visitors are allowed only during visiting hours and must register at the front desk. Overnight stays for visitors are not permitted.',
    },
];

export const testimonials = [
    {
        id: 1,
        name: "Viviana",
        content: "Living in the dorm has been an incredible experience. I've met so many amazing people and made lifelong friends. The community here is supportive and vibrant, making it easy to feel at home away from home.",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
        major: "Software Engineering",
        createdAt: "August 15, 2023"
    },
    {
        id: 2,
        name: "Liam",
        content: "The dormitory life has truly enriched my college experience. The convenience of being close to classes and campus facilities is unmatched. I've also enjoyed the various social events organized by the dorm, which have helped me connect with fellow students.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        major: "Computer Science",
        createdAt: "September 10, 2023"
    },
    {
        id: 3,
        name: "Sophia",
        content: "Living in the dorm has been a fantastic journey. The sense of community and the friendships I've formed here are invaluable. The dorm staff are always helpful, and the amenities provided make it a comfortable and enjoyable place to live.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        major: "Information Technology",
        createdAt: "October 5, 2023"
    },
    {
        id: 4,
        name: "Ethan",
        content: "The dormitory has been a great place to live and learn. The environment is conducive to both academic success and personal growth. I've had the opportunity to participate in various activities and events that have enhanced my college experience.",
        image: "https://randomuser.me/api/portraits/men/76.jpg",
        major: "Data Science",
        createdAt: "November 20, 2023"
    }
]