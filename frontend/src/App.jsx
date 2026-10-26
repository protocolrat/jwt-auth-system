import { useState } from 'react';
import './Auth.css';

export default function App() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Ошибка при регистрации');
      } else {
        alert('Регистрация прошла успешно!');
        setFormData({ username: '', email: '', password: '' });
      }
    } catch (error) {
      setErrorMessage('Не удалось связаться с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Левая темная промо-секция */}
      <div className="auth-left">
        <div className="brand-logo">
          <div className="logo-icon"></div>
          nova
        </div>

        <div>
          <h1 className="hero-title">Почни за одну хвилину.</h1>
          <p className="hero-subtitle">
            Без карток й зайвих кроків. Створи аккаунт і одразу переходь до справи.
          </p>
        </div>

        <div className="graphic-wrapper">
          <div className="graphic-center"></div>
        </div>

        <div className="features-list">
          <span className="feature-item"><span className="check-mark">✓</span> Легкий старт</span>
          <span className="feature-item"><span className="check-mark">✓</span> Без спаму</span>
        </div>
      </div>

      {/* Правая форма регистрации */}
      <div className="auth-right">
        <div className="form-wrapper">
          <h2 className="form-title">Створити акаунт</h2>
          <p className="form-subtitle">
            Вже зареєстровані? <span className="login-link">Увійти</span>
          </p>

          <div className="social-buttons">
            <button type="button" className="social-btn">Google</button>
            <button type="button" className="social-btn">Apple</button>
          </div>

          <div className="divider">
            <span>або через email</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Ім'я</label>
              <input
                className="form-input"
                type="text"
                name="username"
                placeholder="Як до вас звертатись"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Пароль</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Мінімум 8 символів"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="strength-bar">
                <div className={`strength-step ${formData.password.length > 0 ? 'active' : ''}`}></div>
                <div className={`strength-step ${formData.password.length >= 6 ? 'active' : ''}`}></div>
                <div className={`strength-step ${formData.password.length >= 10 ? 'active' : ''}`}></div>
              </div>
            </div>

            <div className="terms-group">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                Я погоджуюсь з <a href="#">умовами</a> та <a href="#">політикою конфиденційності</a>
              </label>
            </div>

            {errorMessage && <p className="error-msg">{errorMessage}</p>}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Створення...' : 'Створити акаунт →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}