import { useState } from 'react';
import Login from './components/Login.jsx';
import SignUp from './components/SignUp.jsx';
import './App.css';

function App() {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (loginUser) => {
    setUser(loginUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUser(null);
    setView('login');
  };

  if (user) {
    return (
      <main className="home">
        <section className="home-panel">
          <p className="eyebrow">RUN-C</p>
          <h1>{user.username}님, 환영합니다</h1>
          <p className="home-description">로그인이 완료되었습니다.</p>
          <button type="button" className="primary-action" onClick={handleLogout}>
            로그아웃
          </button>
        </section>
      </main>
    );
  }

  return view === 'login' ? (
    <Login
      onSwitchToSignUp={() => setView('signup')}
      onLoginSuccess={handleLoginSuccess}
    />
  ) : (
    <SignUp onSwitchToLogin={() => setView('login')} />
  );
}

export default App;
