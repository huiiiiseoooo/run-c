import { useState } from 'react';
import './Auth.css';

function Login({ onSwitchToSignUp, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    if (!formData.userId.trim() || !formData.password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const params = new URLSearchParams({
        userId: formData.userId,
        password: formData.password,
      });

      const response = await fetch(`http://localhost:8080/api/users/login?${params}`, {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || '로그인에 실패했습니다.');
        return;
      }

      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);
      setFormData({ userId: '', password: '' });
      onLoginSuccess(data);
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-container">
      <section className="auth-box">
        <p className="eyebrow">RUN-C</p>
        <h1>로그인</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="userId">아이디</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              placeholder="아이디를 입력하세요"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="switch-link">
          계정이 없으신가요?
          <button onClick={onSwitchToSignUp} type="button">
            회원가입
          </button>
        </p>
      </section>
    </main>
  );
}

export default Login;
