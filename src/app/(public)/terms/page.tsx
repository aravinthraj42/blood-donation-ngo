import { Metadata } from "next";
import { getAllSettings } from "@/services/public";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Blood Connect – InfoPark News Initiate, Kochi blood donation platform.",
};

export const dynamic = 'force-dynamic';

export default async function TermsPage() {
  const settings = await getAllSettings();
  const ngoName = settings.NGO_NAME || "Blood Connect";
  const contactEmail = settings.CONTACT_EMAIL || "contact@lifeblood.org";

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto prose prose-gray">
          <h1>Terms of Service</h1>
          <p className="lead">
            Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the {ngoName} platform (&quot;Platform&quot;), you
            accept and agree to be bound by these Terms of Service. If you do not
            agree to these terms, please do not use our Platform.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            {ngoName} provides a platform that connects blood donors with
            individuals and healthcare facilities in need of blood donations. Our
            services include:
          </p>
          <ul>
            <li>Donor registration and management</li>
            <li>Blood request submission and processing</li>
            <li>Health awareness content</li>
            <li>Communication between donors and recipients</li>
          </ul>

          <h2>3. Important Medical Disclaimer</h2>
          <p>
            <strong>
              {ngoName} is NOT a medical facility and does NOT provide medical
              advice, diagnosis, or treatment.
            </strong>
          </p>
          <ul>
            <li>
              Final eligibility for blood donation is determined solely by
              qualified healthcare professionals during the screening process.
            </li>
            <li>
              Blood availability information shown on our Platform is based on
              registered donor data and should be confirmed with healthcare
              providers.
            </li>
            <li>
              We do not guarantee the availability, compatibility, or suitability
              of any blood donation.
            </li>
            <li>
              Always consult with medical professionals for healthcare decisions.
            </li>
          </ul>

          <h2>4. User Responsibilities</h2>
          <p>As a user of our Platform, you agree to:</p>
          <ul>
            <li>Provide accurate and truthful information</li>
            <li>Keep your contact information up to date</li>
            <li>Not misuse the Platform for fraudulent purposes</li>
            <li>Respect the privacy of other users</li>
            <li>
              Comply with all applicable laws regarding blood donation in your
              jurisdiction
            </li>
          </ul>

          <h2>5. Donor Obligations</h2>
          <p>If you register as a blood donor, you acknowledge that:</p>
          <ul>
            <li>
              Your registration does not obligate you to donate blood at any time
            </li>
            <li>
              You will undergo proper medical screening before any donation
            </li>
            <li>
              You will provide truthful information about your health history
            </li>
            <li>
              You can withdraw your registration or decline donation requests at
              any time
            </li>
          </ul>

          <h2>6. Blood Request Guidelines</h2>
          <p>When submitting a blood request:</p>
          <ul>
            <li>Provide accurate patient and hospital information</li>
            <li>For emergencies, also contact the hospital blood bank directly</li>
            <li>
              Understand that we facilitate connections but cannot guarantee donor
              availability
            </li>
            <li>Cooperate with our team for verification purposes</li>
          </ul>

          <h2>7. Privacy</h2>
          <p>
            Your use of the Platform is also governed by our Privacy Policy. By
            using the Platform, you consent to the collection and use of
            information as described in our Privacy Policy.
          </p>

          <h2>8. Intellectual Property</h2>
          <p>
            All content on this Platform, including text, graphics, logos, and
            software, is the property of {ngoName} and is protected by
            intellectual property laws.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, {ngoName} shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages, including but not limited to loss of life, health
            complications, or any damages arising from the use of donated blood.
          </p>

          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless {ngoName}, its officers,
            directors, employees, and volunteers from any claims, damages, or
            expenses arising from your use of the Platform or violation of these
            Terms.
          </p>

          <h2>11. Modifications to Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue the Platform
            at any time without notice. We may also update these Terms from time
            to time.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the
            laws of India, without regard to its conflict of law provisions.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            For any questions about these Terms, please contact us at:
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
