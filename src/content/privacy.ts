export interface PrivacyPolicyContent {
  title: string;
  lastUpdated: string;
  summary: string;
  sections: {
    heading: string;
    body: string;
  }[];
}

export const privacyPolicy: PrivacyPolicyContent = {
  title: 'Privacy & Data Protection Notice',
  lastUpdated: 'October 2026',
  summary:
    'GENESIS 2026 is organised by the GDXR Club (AR/VR Club) at the Army Institute of Technology (AIT), Pune. We are committed to protecting participant privacy and handling personal data with care and transparency in compliance with applicable laws, including the Digital Personal Data Protection (DPDP) Act.',
  sections: [
    {
      heading: '1. What We Collect and Why',
      body:
        'When you register for GENESIS 2026 or sign up for notifications, we collect minimal necessary details: Team Leader Name, Email, Phone Number, College, and Team Member names. We collect this solely to communicate event logistics, verify participation, and issue event passes and certificates.',
    },
    {
      heading: '2. Consent and Age Confirmation',
      body:
        'By submitting your details, you confirm that you are 18 years of age or older, or have obtained verifiable consent from a parent or guardian. Participation and notification subscriptions are strictly opt-in.',
    },
    {
      heading: '3. Data Retention and Deletion',
      body:
        'All participant data and notification records are automatically scheduled for permanent erasure 90 days following the conclusion of the event. You may request immediate deletion of your data at any time by contacting us.',
    },
    {
      heading: '4. Contact and Grievances',
      body:
        'For any questions, data requests, or privacy concerns, please contact the GDXR Club organizing team via email at contact@gdxrclub.com or through our faculty coordinators at AIT Pune.',
    },
  ],
};
