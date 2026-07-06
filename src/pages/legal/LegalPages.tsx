import { useEffect, ReactNode } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { AlertTriangle } from "lucide-react";

interface Section {
  heading: string;
  body: ReactNode;
}

interface LegalPageProps {
  metaTitle: string;
  metaDesc: string;
  eyebrow: string;
  title: ReactNode;
  lead: string;
  lastReviewed: string;
  sections: Section[];
}

const DraftNotice = () => (
  <div className="rounded-2xl border border-amber-300/60 bg-amber-50 text-amber-900 p-5 flex gap-3">
    <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
    <div className="text-sm leading-relaxed">
      <strong className="font-semibold">Draft — pending review.</strong>{" "}
      This page is a working template maintained by Clean Energy Gurus Ltd. Text marked{" "}
      <code className="px-1 py-0.5 rounded bg-amber-100 text-amber-900 text-[12px]">[REPLACE]</code>{" "}
      must be completed with verified company details before this page is treated as a
      finalised policy. This is not legal advice.
    </div>
  </div>
);

const LegalPage = ({ metaTitle, metaDesc, eyebrow, title, lead, lastReviewed, sections }: LegalPageProps) => {
  useEffect(() => {
    document.title = metaTitle;
    const meta =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m;
      })();
    meta.setAttribute("content", metaDesc);
  }, [metaTitle, metaDesc]);

  return (
    <SiteLayout>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} cta={false} />
      <section className="py-16 lg:py-20">
        <div className="container-tight max-w-3xl">
          <DraftNotice />
          <p className="mt-6 text-xs text-muted-foreground">
            This page is maintained by Clean Energy Gurus Ltd to describe our current
            practices for the Clean Energy Gurus website and services. Last reviewed:{" "}
            {lastReviewed}.
          </p>
          <div className="mt-10 space-y-10">
            {sections.map((s) => (
              <div key={s.heading}>
                <h2 className="text-xl lg:text-2xl font-display font-semibold text-navy">
                  {s.heading}
                </h2>
                <div className="mt-3 text-[15px] text-navy-soft leading-relaxed space-y-3">
                  {s.body}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 pt-8 border-t border-border text-xs text-muted-foreground">
            Clean Energy Gurus Ltd. Registered in England &amp; Wales.
            Company No. <code>[REPLACE — company number]</code>.
            Registered office: <code>[REPLACE — registered office address]</code>.
            General enquiries: <code>[REPLACE — email]</code> ·{" "}
            <code>[REPLACE — phone]</code>.
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

/* -------------------------------------------------------------------------- */
/*  Terms of Use                                                              */
/* -------------------------------------------------------------------------- */
export const Terms = () => (
  <LegalPage
    metaTitle="Terms of Use | Clean Energy Gurus"
    metaDesc="Terms governing use of the Clean Energy Gurus website and services. Draft — pending review."
    eyebrow="Terms of Use"
    title={<>Website &amp; service <span className="text-gradient">terms</span>.</>}
    lead="These terms explain how you may use the Clean Energy Gurus website, the Energy IQ questionnaire, the Solar Suitability Map and any enquiries submitted to us."
    lastReviewed="[REPLACE — date]"
    sections={[
      {
        heading: "1. About us",
        body: (
          <p>
            The Clean Energy Gurus website is operated by Clean Energy Gurus Ltd,
            registered in England &amp; Wales (Company No. <code>[REPLACE]</code>),
            registered office <code>[REPLACE — registered office address]</code>.
            References to "we", "us" and "our" mean Clean Energy Gurus Ltd.
          </p>
        ),
      },
      {
        heading: "2. Using this website",
        body: (
          <>
            <p>
              You may use this website for lawful purposes only. You agree not to
              misuse the site, attempt to gain unauthorised access, or use it in any
              way that could damage, disable or impair the service or interfere with
              other users.
            </p>
            <p>
              Content on the website — including tools such as the Energy IQ
              questionnaire and the Solar Suitability Map — is provided for general
              information and initial guidance. It is indicative only and does not
              constitute a technical design, quotation, warranty or personalised
              advice.
            </p>
          </>
        ),
      },
      {
        heading: "3. Enquiries, quotations and installation",
        body: (
          <>
            <p>
              Submitting an enquiry, questionnaire response or map outline does not
              create a contract. Any installation work is delivered through
              accredited installer partners (including MCS, OZEV and DNO registered
              partners where applicable). Formal quotations, contracts, warranties
              and consumer protections for installation work are provided by the
              relevant installer partner.
            </p>
            <p>
              Where we introduce you to an installer partner, the contract for the
              works is between you and that partner. We will make clear at the point
              of introduction which party is responsible for the works, the
              quotation and any post-installation support.
            </p>
          </>
        ),
      },
      {
        heading: "4. Indicative estimates",
        body: (
          <p>
            Estimates displayed on the website — including solar yield, savings,
            payback periods, Energy IQ scores and category outcomes — are indicative
            only. They depend on assumptions that may not apply to your property.
            They are not a savings forecast, a guarantee of eligibility for any
            grant or scheme, or confirmation of technical suitability. A site survey
            and technical assessment are required before any binding statement can
            be made.
          </p>
        ),
      },
      {
        heading: "5. Intellectual property",
        body: (
          <p>
            All content on this website, including text, imagery, logos and design,
            is owned by or licensed to Clean Energy Gurus Ltd and protected by
            applicable intellectual property laws. You may view and share content
            for personal, non-commercial use. Any other use requires our prior
            written consent.
          </p>
        ),
      },
      {
        heading: "6. Limitation of liability",
        body: (
          <p>
            To the fullest extent permitted by law, we exclude liability for
            indirect or consequential loss arising from use of the website or
            reliance on any indicative estimate. Nothing in these terms limits
            liability that cannot be limited under UK law, including for death or
            personal injury caused by negligence, or for fraud. Statutory consumer
            rights are not affected.
          </p>
        ),
      },
      {
        heading: "7. Third-party links and services",
        body: (
          <p>
            The website uses third-party services (for example, Google Maps to power
            the Solar Suitability Map). Use of those services is subject to their
            own terms and policies. We are not responsible for the content of
            external websites we link to.
          </p>
        ),
      },
      {
        heading: "8. Changes to these terms",
        body: (
          <p>
            We may update these terms from time to time. The current version
            available on this page applies to your use of the website.
          </p>
        ),
      },
      {
        heading: "9. Governing law",
        body: (
          <p>
            These terms and any dispute arising out of them are governed by the laws
            of <code>[REPLACE — England &amp; Wales / Scotland / Northern Ireland]</code>{" "}
            and subject to the exclusive jurisdiction of its courts.
          </p>
        ),
      },
      {
        heading: "10. Contact",
        body: (
          <p>
            Questions about these terms: <code>[REPLACE — email]</code>.
          </p>
        ),
      },
    ]}
  />
);

/* -------------------------------------------------------------------------- */
/*  Privacy Notice                                                            */
/* -------------------------------------------------------------------------- */
export const Privacy = () => (
  <LegalPage
    metaTitle="Privacy Notice | Clean Energy Gurus"
    metaDesc="How Clean Energy Gurus collects, uses and protects personal data. Draft — pending review."
    eyebrow="Privacy Notice"
    title={<>Your <span className="text-gradient">privacy</span>, plainly explained.</>}
    lead="This notice explains what personal data we collect through the Clean Energy Gurus website, why we collect it, how it is shared with installer partners, and the rights you have over it."
    lastReviewed="[REPLACE — date]"
    sections={[
      {
        heading: "1. Who we are",
        body: (
          <p>
            Clean Energy Gurus Ltd is the data controller for personal data
            collected through this website. Registered in England &amp; Wales
            (Company No. <code>[REPLACE]</code>). ICO registration number:{" "}
            <code>[REPLACE — ICO registration number]</code>. Contact for privacy
            matters: <code>[REPLACE — privacy email]</code>.
          </p>
        ),
      },
      {
        heading: "2. What we collect",
        body: (
          <>
            <p>We collect information you provide when you use the site, including:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Contact details submitted through enquiry or contact forms (name, email, phone, business name where relevant).</li>
              <li>Answers you submit to the Energy IQ questionnaire (property type, energy goals, existing technology, timeline and similar).</li>
              <li>Location information you enter into the Solar Suitability Map (postcode, address, roof or land outline you draw).</li>
              <li>Basic technical information from your device (IP address, browser, pages visited) needed to operate the site securely.</li>
            </ul>
            <p>
              We do not knowingly collect special-category data. Please do not
              submit sensitive personal information through the website forms.
            </p>
          </>
        ),
      },
      {
        heading: "3. Why we use it and lawful basis",
        body: (
          <>
            <p>We use personal data to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Respond to enquiries and provide the guidance you have asked for (lawful basis: legitimate interests and, where relevant, steps to enter into a contract).</li>
              <li>Generate indicative Energy IQ and solar suitability outputs based on the answers you provide.</li>
              <li>Introduce you to an appropriate accredited installer partner where you have asked us to do so.</li>
              <li>Improve the website and the accuracy of the tools we offer.</li>
              <li>Meet legal, regulatory and record-keeping obligations.</li>
            </ul>
          </>
        ),
      },
      {
        heading: "4. Sharing with installer partners and third parties",
        body: (
          <>
            <p>
              Where you request a survey, quotation or installation, we share the
              information needed to progress your enquiry with an accredited
              installer partner (for example, MCS, OZEV or DNO registered
              partners). Once you enter into a contract with that partner, they act
              as data controller for the works and their own privacy notice
              applies.
            </p>
            <p>
              We also use trusted service providers to run the website — for
              example, hosting, email delivery and Google Maps for the Solar
              Suitability Map. These providers act as data processors on our behalf
              or, where they are independent controllers (such as Google Maps),
              under their own policies.
            </p>
          </>
        ),
      },
      {
        heading: "5. Cookies and analytics",
        body: (
          <p>
            The website uses cookies and similar technologies that are strictly
            necessary to operate features you request (for example, loading Google
            Maps for the Solar Suitability Map). If we add optional analytics or
            marketing cookies in future, we will ask for your consent first.
          </p>
        ),
      },
      {
        heading: "6. How long we keep it",
        body: (
          <p>
            We keep enquiry, questionnaire and map data for as long as needed to
            respond to your request and for a reasonable period afterwards for
            record-keeping, typically <code>[REPLACE — retention period, e.g. 24 months]</code>.
            Data linked to a contracted installation is kept for longer where
            required by law or warranty terms.
          </p>
        ),
      },
      {
        heading: "7. Your rights",
        body: (
          <>
            <p>Under UK data protection law you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access the personal data we hold about you.</li>
              <li>Ask us to correct or delete it.</li>
              <li>Restrict or object to certain processing.</li>
              <li>Withdraw consent where processing is based on consent.</li>
              <li>Request a copy of your data in a portable format.</li>
            </ul>
            <p>
              To exercise any of these rights, contact{" "}
              <code>[REPLACE — privacy email]</code>. You also have the right to
              complain to the UK Information Commissioner's Office (ICO) at{" "}
              <a href="https://ico.org.uk" className="underline hover:text-navy">ico.org.uk</a>.
            </p>
          </>
        ),
      },
      {
        heading: "8. Security",
        body: (
          <p>
            We use reasonable technical and organisational measures to protect
            personal data. No online service can be guaranteed fully secure, so we
            ask that you take care with any information you share online.
          </p>
        ),
      },
      {
        heading: "9. Changes to this notice",
        body: (
          <p>
            We may update this notice from time to time. The current version
            available on this page is the one that applies.
          </p>
        ),
      },
    ]}
  />
);

/* -------------------------------------------------------------------------- */
/*  Complaints                                                                */
/* -------------------------------------------------------------------------- */
export const Complaints = () => (
  <LegalPage
    metaTitle="Complaints | Clean Energy Gurus"
    metaDesc="How to raise a complaint with Clean Energy Gurus, our response commitments and escalation routes. Draft — pending review."
    eyebrow="Complaints"
    title={<>How to raise a <span className="text-gradient">complaint</span>.</>}
    lead="We want to know if something has fallen short. This page explains how to contact us, what to include, how long we take to respond, and how to escalate if you are not satisfied with our reply."
    lastReviewed="[REPLACE — date]"
    sections={[
      {
        heading: "1. How to contact us",
        body: (
          <>
            <p>You can raise a complaint by:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Email: <code>[REPLACE — complaints email]</code></li>
              <li>Phone: <code>[REPLACE — complaints phone]</code></li>
              <li>Post: <code>[REPLACE — postal address for complaints]</code></li>
            </ul>
          </>
        ),
      },
      {
        heading: "2. What to include",
        body: (
          <>
            <p>To help us investigate quickly, please include:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Your name and preferred contact details.</li>
              <li>Any reference number we have given you (enquiry, quotation or job reference).</li>
              <li>A clear description of what happened and when.</li>
              <li>What outcome you are looking for.</li>
              <li>Copies of any documents or photos that help explain the issue.</li>
            </ul>
          </>
        ),
      },
      {
        heading: "3. What happens next",
        body: (
          <>
            <p>
              We acknowledge complaints within{" "}
              <code>[REPLACE — e.g. 5 working days]</code> of receipt. We aim to
              provide a full response within{" "}
              <code>[REPLACE — e.g. 8 weeks]</code>. If we need longer we will let
              you know why and give you a revised timescale.
            </p>
            <p>
              Where the issue relates to work carried out by an accredited installer
              partner, we will coordinate with the partner and keep you informed.
              The partner may also have their own complaints process, which we can
              signpost you to.
            </p>
          </>
        ),
      },
      {
        heading: "4. If you are not satisfied",
        body: (
          <p>
            If you are not happy with our final response, you may be able to
            escalate the matter to an independent scheme, for example{" "}
            <code>[REPLACE — RECC / HIES / TrustMark / Energy Ombudsman as applicable]</code>.
            We will share the relevant contact details in our final response and
            confirm any deadlines that apply.
          </p>
        ),
      },
      {
        heading: "5. Records",
        body: (
          <p>
            We keep records of complaints and our responses so we can identify
            trends and improve. Personal data in complaint records is handled in
            line with our Privacy Notice.
          </p>
        ),
      },
    ]}
  />
);

/* -------------------------------------------------------------------------- */
/*  Quality                                                                   */
/* -------------------------------------------------------------------------- */
export const Quality = () => (
  <LegalPage
    metaTitle="Quality Policy | Clean Energy Gurus"
    metaDesc="Our approach to quality across enquiries, partner selection, installation and aftercare. Draft — pending review."
    eyebrow="Quality Policy"
    title={<>Our approach to <span className="text-gradient">quality</span>.</>}
    lead="Quality at Clean Energy Gurus is about giving you clear guidance, matching you with accredited installer partners and staying involved through installation and aftercare."
    lastReviewed="[REPLACE — date]"
    sections={[
      {
        heading: "1. Our commitment",
        body: (
          <p>
            We aim to provide clear, honest and useful guidance from the first
            enquiry through to installation and ongoing performance. We do not
            overclaim on savings, payback or eligibility, and we make clear when an
            output is indicative rather than final.
          </p>
        ),
      },
      {
        heading: "2. Accredited partner model",
        body: (
          <p>
            Installations are delivered through accredited installer partners,
            including MCS-certified installers for solar and heat pump systems,
            OZEV-authorised installers for EV charging and DNO-registered partners
            for grid connections where applicable. Partners are expected to hold
            and maintain the accreditations relevant to the work they carry out.
          </p>
        ),
      },
      {
        heading: "3. Enquiry and design",
        body: (
          <>
            <p>Before any installation, we expect the following to take place:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>An initial review of your property, energy use and goals.</li>
              <li>A site survey and technical assessment by the installer partner.</li>
              <li>A written quotation with system design, expected performance and clear terms.</li>
              <li>Confirmation of any permissions, DNO approvals or grants that apply.</li>
            </ul>
          </>
        ),
      },
      {
        heading: "4. Installation standards",
        body: (
          <p>
            Installations should be carried out in line with the relevant scheme
            standards (for example, MCS installation standards for solar and heat
            pumps, and IET Wiring Regulations for electrical work). Handover should
            include commissioning documentation, warranty details and clear
            operating guidance.
          </p>
        ),
      },
      {
        heading: "5. Aftercare and monitoring",
        body: (
          <p>
            Where you have opted in to monitoring, tariff optimisation or ongoing
            support, we work with you and your installer partner to keep the system
            performing as intended and to flag issues early. Warranty and service
            terms are provided by the installer partner and the equipment
            manufacturers.
          </p>
        ),
      },
      {
        heading: "6. Continuous improvement",
        body: (
          <p>
            We review enquiries, feedback and complaints regularly to improve our
            guidance, our tools and our partner network. Feedback from customers
            and installers is central to that process.
          </p>
        ),
      },
      {
        heading: "7. Giving feedback",
        body: (
          <p>
            Positive or otherwise, we welcome feedback at{" "}
            <code>[REPLACE — feedback email]</code>. If something has gone wrong,
            please see our <a href="/complaints" className="underline hover:text-navy">Complaints</a> page.
          </p>
        ),
      },
    ]}
  />
);
