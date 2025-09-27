import dorm1 from '@/assets/dorm-1.jpg'
import dorm2 from '@/assets/dorm-2.jpg'
import dorm3 from '@/assets/dorm-3.jpg'

export const APP_NAME = "Lumiq";

export const NAVLINKS = [
    { to: "/", name: "Home" },
    { to: "/account", name: "Account" },
]

export const cards = [
    {
        title: "Explore Dorms",
        subTitle: "Browse our extensive list of student housing options."
    },
    {
        title: "Roommate Matching",
        subTitle: "Find compatible roommates with our smart algorithm."
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