import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { FiShoppingBag, FiDollarSign, FiPackage, FiTrendingUp, FiArrowUp } from 'react-icons/fi'

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN')

const STATUS_COLORS = {
  Processing:        '#ff9f00',
  Confirmed:         '#2196f3',
  Shipped:           '#9c27b0',
  'Out for Delivery':'#e91e63',
  Delivered:         '#4caf50',
  Cancelled:         '#f44336',
}

export default function Dashboard() {
  const [stats,    setStats]    = useState(null)
  const [recent,   setRecent]   = useState([])
  const [monthly,  setMonthly]  = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get('/orders/admin/stats').then(({ data }) => {
      setStats(data.stats)
      setRecent(data.recentOrders)
      setMonthly(data.monthlyRevenue)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>

  const maxRev = Math.max(...monthly.map((m) => m.revenue), 1)

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const STAT_CARDS = [
    { label: 'Total Revenue',   value: fmt(stats?.totalRevenue || 0),  icon: <FiDollarSign size={24} />, color: '#e8f5e9', iconColor: '#4caf50', change: '+12.5%' },
    { label: 'Total Orders',    value: stats?.totalOrders || 0,         icon: <FiShoppingBag size={24} />, color: '#e3f2fd', iconColor: '#2196f3', change: '+8.2%' },
    { label: 'Pending Orders',  value: stats?.pendingOrders || 0,       icon: <FiPackage size={24} />,    color: '#fff3e0', iconColor: '#ff9800', change: '-3.1%' },
    { label: 'Delivered Orders',value: stats?.deliveredOrders || 0,     icon: <FiTrendingUp size={24} />, color: '#f3e5f5', iconColor: '#9c27b0', change: '+15.4%' },
  ]

  return (
    <div className="dashboard animate-fade">
      <div className="db-title">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* ── Stats Cards ── */}
      <div className="stats-grid">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-icon" style={{ background: card.color, color: card.iconColor }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <p className="stat-label">{card.label}</p>
              <h2 className="stat-value">{card.value}</h2>
              <span className={`stat-change ${card.change.startsWith('+') ? 'up' : 'down'}`}>
                <FiArrowUp size={11} style={{ transform: card.change.startsWith('-') ? 'rotate(180deg)' : 'none' }} />
                {card.change} vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="db-bottom">
        {/* ── Revenue Chart ── */}
        <div className="db-card revenue-chart">
          <div className="dc-header">
            <h3>Monthly Revenue</h3>
            <span className="chart-note">Last 6 months</span>
          </div>
          {monthly.length > 0 ? (
            <div className="bar-chart">
              {monthly.map((m) => (
                <div key={`${m._id.year}-${m._id.month}`} className="bar-col">
                  <div className="bar-value">{fmt(m.revenue)}</div>
                  <div className="bar-wrap">
                    <div className="bar-fill" style={{ height: `${(m.revenue / maxRev) * 100}%` }} />
                  </div>
                  <div className="bar-label">{MONTHS[m._id.month - 1]}</div>
                  <div className="bar-orders">{m.count} orders</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>No revenue data yet</div>
          )}
        </div>

        {/* ── Recent Orders ── */}
        <div className="db-card recent-orders">
          <div className="dc-header">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="view-all-link">View All</Link>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <Link to={`/orders/${order._id}`} className="order-link">
                        #{order.orderNumber}
                      </Link>
                      <div style={{ fontSize: '.72rem', color: 'var(--gray-400)' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '.85rem' }}>{order.user?.name || 'N/A'}</div>
                      <div style={{ fontSize: '.72rem', color: 'var(--gray-400)' }}>{order.user?.email}</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{fmt(order.totalPrice)}</td>
                    <td>
                      <span className="status-dot" style={{
                        background: STATUS_COLORS[order.orderStatus] + '20',
                        color: STATUS_COLORS[order.orderStatus],
                        padding: '3px 10px', borderRadius: 20, fontSize: '.72rem', fontWeight: 700
                      }}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="qa-grid">
          <Link to="/admin/products/add" className="qa-btn">
            <span>➕</span> Add New Product
          </Link>
          <Link to="/admin/orders" className="qa-btn">
            <span>📦</span> Manage Orders
          </Link>
          <Link to="/admin/users" className="qa-btn">
            <span>👥</span> View Customers
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="qa-btn">
            <span>🛒</span> View Store
          </a>
        </div>
      </div>

      <style>{`
        .dashboard { display: flex; flex-direction: column; gap: 24px; }
        .db-title h1 { font-size: 1.5rem; font-weight: 800; color: var(--dark); }
        .db-title p { color: var(--gray-400); font-size: .875rem; margin-top: 2px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .stat-card { background: #fff; border-radius: 12px; padding: 20px; display: flex; gap: 16px; align-items: flex-start; box-shadow: var(--shadow-sm); }
        .stat-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-label { font-size: .78rem; color: var(--gray-400); font-weight: 500; text-transform: uppercase; letter-spacing: .5px; }
        .stat-value { font-size: 1.6rem; font-weight: 800; color: var(--dark); margin: 4px 0; line-height: 1; }
        .stat-change { font-size: .72rem; display: inline-flex; align-items: center; gap: 3px; font-weight: 600; }
        .stat-change.up { color: var(--success); }
        .stat-change.down { color: var(--accent); }
        .db-bottom { display: grid; grid-template-columns: 1fr 1.3fr; gap: 16px; }
        .db-card { background: #fff; border-radius: 12px; padding: 20px; box-shadow: var(--shadow-sm); }
        .dc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .dc-header h3 { font-size: 1rem; font-weight: 700; }
        .chart-note { font-size: .78rem; color: var(--gray-400); }
        .view-all-link { font-size: .82rem; color: var(--primary); font-weight: 600; }
        .bar-chart { display: flex; align-items: flex-end; gap: 12px; height: 180px; padding-top: 32px; }
        .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px; height: 100%; position: relative; }
        .bar-value { font-size: .65rem; color: var(--gray-400); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; text-align: center; }
        .bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
        .bar-fill { width: 100%; background: var(--primary); border-radius: 4px 4px 0 0; transition: height .6s ease; min-height: 4px; }
        .bar-label { font-size: .7rem; font-weight: 700; color: var(--gray-800); }
        .bar-orders { font-size: .65rem; color: var(--gray-400); }
        .order-link { color: var(--primary); font-weight: 600; font-size: .875rem; }
        .quick-actions { background: #fff; border-radius: 12px; padding: 20px; box-shadow: var(--shadow-sm); }
        .quick-actions h3 { font-size: 1rem; font-weight: 700; margin-bottom: 14px; }
        .qa-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .qa-btn { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: var(--gray-100); border-radius: 10px; font-size: .875rem; font-weight: 600; color: var(--dark); transition: var(--transition); }
        .qa-btn:hover { background: var(--primary-light); color: var(--primary); transform: translateY(-2px); }
        .qa-btn span { font-size: 1.2rem; }
        @media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 900px) { .db-bottom { grid-template-columns: 1fr; } .qa-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .stat-card { padding: 14px; gap: 10px; }
          .stat-icon { width: 40px; height: 40px; }
          .stat-value { font-size: 1.1rem; }
          .db-title h1 { font-size: 1.1rem; }
          .qa-grid { grid-template-columns: 1fr 1fr; }
          .bar-chart { gap: 4px; height: 140px; }
          .bar-value { font-size: .5rem; }
          .bar-orders { display: none; }
          .db-card { padding: 14px; }
        }
        @media (max-width: 400px) {
          .stats-grid { grid-template-columns: 1fr; }
          .stat-card { flex-direction: row; }
        }
      `}</style>
    </div>
  )
}
