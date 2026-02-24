import { Link } from 'react-router-dom'

const features = [
  {
    icon: '📈',
    title: 'Trend Scanner',
    desc: 'Discover viral trends before they peak and tailor your content strategy.',
  },
  {
    icon: '💡',
    title: 'AI Idea Generator',
    desc: 'Get 10 AI-powered video concepts for any niche in seconds.',
  },
  {
    icon: '🎬',
    title: 'Video Processing',
    desc: 'Auto-captions, smart reframing, and highlight extraction built in.',
  },
  {
    icon: '📅',
    title: 'Content Scheduler',
    desc: 'Plan and schedule your posts for peak engagement windows.',
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    desc: 'Track views, sales, and UTM performance all in one place.',
  },
  {
    icon: '👥',
    title: 'Creator Community',
    desc: 'Connect with mentors and fellow creators to grow faster.',
  },
]

export default function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-logo">
          <span>🎵</span> Creator Studio
        </div>
        <div className="landing-header-actions">
          <Link to="/login" className="btn btn-ghost">
            Log in
          </Link>
          <Link to="/signup" className="btn btn-primary">
            Get started free
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-badge">🚀 The all-in-one TikTok growth platform</div>
        <h1 className="hero-title">
          Grow your TikTok<br />
          <span className="accent">10× faster</span>
        </h1>
        <p className="hero-subtitle">
          Trends, AI ideas, video processing, scheduling, analytics and community —
          everything you need to go viral, in one place.
        </p>
        <div className="hero-actions">
          <Link to="/signup" className="btn btn-primary btn-lg">
            Start for free →
          </Link>
          <Link to="/pricing" className="btn btn-ghost btn-lg">
            View plans
          </Link>
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">Everything you need to grow</h2>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to go viral?</h2>
        <p>Join thousands of creators who are already growing with Creator Studio.</p>
        <Link to="/signup" className="btn btn-primary btn-lg">
          Create your free account
        </Link>
      </section>

      <footer className="landing-footer">
        <span>© 2025 TikTok Creator Studio</span>
      </footer>
    </div>
  )
}
