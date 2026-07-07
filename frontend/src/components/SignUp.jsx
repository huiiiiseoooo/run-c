import { useState } from 'react';
import './Auth.css';

function SignUp({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    password: '',
    passwordConfirm: '',
  });
  const [idCheckResult, setIdCheckResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'userId') {
      setIdCheckResult(null);
    }
  };

  const handleCheckId = async () => {
    setError('');
    setSuccess('');

    if (!formData.userId.trim()) {
      setError('아이디를 입력해주세요.');
      return;
    }

    setIsCheckingId(true);

    try {
      const params = new URLSearchParams({ userId: formData.userId });
      const response = await fetch(`http://localhost:8080/api/users/check-id?${params}`, {
        method: 'POST',
      });
      const data = await response.json();

      setIdCheckResult(data.available);

      if (!data.available) {
        setError(data.message || '이미 사용 중인 아이디입니다.');
      }
    } catch (err) {
      setError('아이디 확인 중 오류가 발생했습니다.');
    } finally {
      setIsCheckingId(false);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.userId.trim() || !formData.username.trim() || !formData.password.trim()) {
      setError('모든 항목을 입력해주세요.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (idCheckResult !== true) {
      setError('아이디 중복 확인을 해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: formData.userId,
          username: formData.username,
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || '회원가입에 실패했습니다.');
        return;
      }

      setSuccess('회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.');
      setFormData({
        userId: '',
        username: '',
        password: '',
        passwordConfirm: '',
      });
      setIdCheckResult(null);
      setTimeout(onSwitchToLogin, 1200);
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-container">
      <section className="auth-box">
        <p className="eyebrow">RUN-C</p>
        <h1>회원가입</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label htmlFor="userId">아이디</label>
            <div className="input-with-button">
              <input
                type="text"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                placeholder="아이디를 입력하세요"
                disabled={isCheckingId || isSubmitting}
              />
              <button
                type="button"
                onClick={handleCheckId}
                disabled={isCheckingId || isSubmitting || !formData.userId.trim()}
                className="check-btn"
              >
                {isCheckingId ? '확인 중...' : '중복 확인'}
              </button>
            </div>
            {idCheckResult === true && (
              <div className="success-text">사용 가능한 아이디입니다.</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username">이름</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="이름을 입력하세요"
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

          <div className="form-group">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={isSubmitting}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="switch-link">
          이미 계정이 있으신가요?
          <button onClick={onSwitchToLogin} type="button">
            로그인
          </button>
        </p>
      </section>
    </main>
  );
}

export default SignUp;
