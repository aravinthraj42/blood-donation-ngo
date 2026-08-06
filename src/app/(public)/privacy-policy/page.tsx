import { Metadata } from "next";
import { getAllSettings } from "@/services/public";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Blood Connect – InfoPark News Initiate, Kochi blood donation platform.",
};

export const dynamic = 'force-dynamic';

export default async function PrivacyPolicyPage() {
  const settings = await getAllSettings();
  const ngoName = settings.NGO_NAME || "Blood Connect";
  const contactEmail = settings.CONTACT_EMAIL || "contact@lifeblood.org";

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto prose prose-gray">
          <h1>Privacy Policy</h1>
          <p className="lead">
            Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <h2>Introduction</h2>
          <p>
            {ngoName} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our blood donation
            management platform.
          </p>

          <h2>Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>
              <strong>Donor Registration:</strong> Name, phone number, email
              address, date of birth, blood group, address, city, district, state,
              pincode, occupation, last donation date, and contact preferences.
            </li>
            <li>
              <strong>Blood Requests:</strong> Requester name, patient name, blood
              group requirement, hospital information, contact details, and medical
              reason for the request.
            </li>
            <li>
              <strong>Contact Forms:</strong> Name, email, phone number, and
              message content.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Connect blood donors with patients in need</li>
            <li>Verify donor eligibility and maintain donation records</li>
            <li>Communicate with you regarding blood donation requests</li>
            <li>Send notifications about blood donation camps and events</li>
            <li>Improve our services and platform</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information only in the following
            circumstances:
          </p>
          <ul>
            <li>
              <strong>With Healthcare Providers:</strong> When necessary to
              facilitate blood donation matching, we may share relevant contact
              information with hospitals and healthcare facilities.
            </li>
            <li>
              <strong>With Your Consent:</strong> When you have given us explicit
              permission to share your information.
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to
              protect our rights and safety.
            </li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, no method of
            transmission over the Internet is 100% secure.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Withdraw consent for contact</li>
            <li>Opt out of communications</li>
          </ul>

          <h2>Data Retention</h2>
          <p>
            We retain your personal information for as long as necessary to fulfill
            the purposes outlined in this Privacy Policy, unless a longer retention
            period is required or permitted by law.
          </p>

          <h2>Cookies and Tracking</h2>
          <p>
            Our platform may use cookies and similar tracking technologies to
            improve user experience. You can control cookie settings through your
            browser preferences.
          </p>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our platform is not intended for individuals under the age of 18.
            Blood donation eligibility requires donors to be adults as per
            applicable regulations.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page and
            updating the &quot;Last updated&quot; date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data
            practices, please contact us at:
          </p>
          <p>
            <strong>{ngoName}</strong>
            <br />
            Email:{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
