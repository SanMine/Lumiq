export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: December 1, 2024</p>
                </div>

                {/* Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">

                    {/* Introduction */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Welcome to LUMIQ ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our dormitory and roommate matching platform.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">Personal Information</h3>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            When you register and use LUMIQ, we collect the following personal information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Name, email address, and phone number</li>
                            <li>Date of birth and address</li>
                            <li>Student ID or identification documents (for verification)</li>
                            <li>Payment information for booking transactions</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">Personality Profile Information</h3>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            To provide our roommate matching service, we collect:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>MBTI personality type and lifestyle preferences</li>
                            <li>Sleep schedule, study habits, and cleanliness preferences</li>
                            <li>Social preferences and lifestyle choices</li>
                            <li>Noise tolerance and room temperature preferences</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">Usage Information</h3>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            We automatically collect information about how you interact with our platform:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Device information (IP address, browser type, operating system)</li>
                            <li>Usage data (pages visited, features used, time spent)</li>
                            <li>Search queries and preferences</li>
                            <li>Communication data (messages with potential roommates)</li>
                        </ul>
                    </section>

                    {/* How We Use Your Information */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            We use your information for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Roommate Matching:</strong> To analyze personality compatibility and suggest potential roommates using our AI-powered matching algorithm</li>
                            <li><strong>Booking Management:</strong> To process dormitory reservations and manage your bookings</li>
                            <li><strong>Communication:</strong> To facilitate messaging between matched users and send important notifications</li>
                            <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our platform features</li>
                            <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
                            <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
                        </ul>
                    </section>

                    {/* Information Sharing */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Information Sharing and Disclosure</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">With Other Users</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Your personality profile and basic information are shared with potential roommate matches to facilitate connections. You can control what information is visible to other users through your privacy settings.
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">With Dormitory Administrators</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            When you book a room, we share necessary information (name, contact details, booking details) with the dormitory administrator to process your reservation.
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">With Service Providers</h3>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            We use trusted third-party services to operate our platform:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>GROQ AI:</strong> For personality analysis and compatibility matching</li>
                            <li><strong>MongoDB Atlas:</strong> For secure data storage</li>
                            <li><strong>Payment Processors:</strong> For secure payment transactions</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">Legal Requirements</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            We may disclose your information if required by law, court order, or government regulation, or to protect the rights, property, or safety of LUMIQ, our users, or others.
                        </p>
                    </section>

                    {/* Data Security */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            We implement industry-standard security measures to protect your information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>Encryption of data in transit using HTTPS/TLS</li>
                            <li>Secure password hashing using bcrypt</li>
                            <li>JWT token-based authentication</li>
                            <li>Regular security audits and monitoring</li>
                            <li>Restricted access to personal data on a need-to-know basis</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-3">
                            However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
                        <p className="text-muted-foreground leading-relaxed mb-3">
                            You have the following rights regarding your personal information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information through your account settings</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                            <li><strong>Opt-out:</strong> Unsubscribe from marketing emails and notifications</li>
                            <li><strong>Data Portability:</strong> Request a copy of your data in a structured format</li>
                            <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where applicable</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mt-3">
                            To exercise these rights, please contact us at privacy@lumiq-thailand.com
                        </p>
                    </section>

                    {/* Cookies */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and remember your preferences. You can control cookie settings through your browser, but disabling cookies may affect platform functionality.
                        </p>
                    </section>

                    {/* Children's Privacy */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            LUMIQ is intended for users aged 18 and above. We do not knowingly collect personal information from individuals under 18. If we become aware that we have collected data from a minor, we will take steps to delete such information promptly.
                        </p>
                    </section>

                    {/* Data Retention */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will remove your personal information within 30 days, except where we are required to retain it for legal or regulatory purposes.
                        </p>
                    </section>

                    {/* International Transfers */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Your information may be transferred to and processed in countries other than Thailand, where our service providers operate. We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
                        </p>
                    </section>

                    {/* Changes */}
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our platform and updating the "Last updated" date. Your continued use of LUMIQ after changes indicates your acceptance of the updated policy.
                        </p>
                    </section>

                    {/* Contact */}
                    <section className="border-t pt-8">
                        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                        </p>
                        <div className="bg-muted/50 p-6 rounded-lg">
                            <p className="font-semibold mb-2">LUMIQ Privacy Team</p>
                            <p className="text-muted-foreground">Email: privacy@lumiq-thailand.com</p>
                            <p className="text-muted-foreground">Support: support@lumiq-thailand.com</p>
                            <p className="text-muted-foreground mt-2">Website: <a href="https://www.lumiq-thailand.com" className="text-primary hover:underline">www.lumiq-thailand.com</a></p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
