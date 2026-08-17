import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import './PolicyPage.css';

interface PolicySection {
  title: string;
  body: string[];
}

interface PolicyPageProps {
  title: string;
  updated?: string;
  intro?: string;
  sections: PolicySection[];
  note?: string;
}

export default function PolicyPage({
  title,
  updated = 'Last updated: August 17, 2026',
  intro,
  sections,
  note,
}: PolicyPageProps) {
  return (
    <div className="policy-page">
      <Header />
      <main className="policy-main">
        <div className="policy-container">
          <h1 className="policy-title">{title}</h1>
          <p className="policy-updated">{updated}</p>
          <div className="policy-content">
            {intro && (
              <section className="policy-section">
                <p>{intro}</p>
              </section>
            )}
            {note && <p className="policy-note">{note}</p>}
            {sections.map((section) => (
              <section className="policy-section" key={section.title}>
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
