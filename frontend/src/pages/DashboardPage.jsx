import { useAuth } from '../AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  const cards = [
    { icon: '🔥', label: 'Trending Topics', value: 'View Trends' },
    { icon: '💡', label: 'Content Ideas', value: 'Generate Ideas' },
    { icon: '🎬', label: 'Videos', value: 'Manage Videos' },
    { icon: '📊', label: 'Analytics', value: 'View Stats' },
  ];

  return (
    <div className="page">
      <h1>Welcome back{user?.email ? `, ${user.email}` : ''}! 👋</h1>
      <p className="page-subtitle">Here&apos;s an overview of your creator dashboard.</p>
      <div className="card-grid">
        {cards.map(card => (
          <div key={card.label} className="summary-card">
            <span className="card-icon">{card.icon}</span>
            <h3>{card.label}</h3>
            <p>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
