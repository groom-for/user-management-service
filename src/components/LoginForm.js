import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

const initialState = {
  email: '',
  password: '',
  rememberMe: false,
};

export default function LoginForm({
  onSwitchToSignup = () => {},
  onSwitchToForgot = () => {},
}) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!formData.email.trim()) {
      nextErrors.email = '이메일을 입력해 주세요.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = '올바른 이메일 형식이 아닙니다.';
    }
    if (!formData.password) {
      nextErrors.password = '비밀번호를 입력해 주세요.';
    }
    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setServerError('');
    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }
    setSubmitted(false);
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || '로그인에 실패했습니다.');
      }
      setFormData(initialState);
      setSubmitted(true);
    } catch (error) {
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : '로그인 요청 중 오류가 발생했습니다.';
      setServerError(fallbackMessage || '로그인 요청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldHasError = (key) => Boolean(errors[key]);

  return (
    <Card className="signup-card">
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>
          등록된 이메일과 비밀번호를 입력해 주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <Label htmlFor="loginEmail">이메일</Label>
            <Input
              id="loginEmail"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={fieldHasError('email')}
            />
            {fieldHasError('email') && (
              <p className="form-message">{errors.email}</p>
            )}
          </div>

          <div className="form-field">
            <Label htmlFor="loginPassword">비밀번호</Label>
            <Input
              id="loginPassword"
              name="password"
              type="password"
              placeholder="비밀번호 입력"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={fieldHasError('password')}
            />
            {fieldHasError('password') && (
              <p className="form-message">{errors.password}</p>
            )}
          </div>

          <div className="form-checkbox remember-row">
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>로그인 상태 유지</span>
            </label>
            <button
              type="button"
              className="link-button faint"
              onClick={onSwitchToForgot}
            >
              비밀번호 찾기
            </button>
          </div>

          {serverError && <p className="form-message">{serverError}</p>}

          <Button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            로그인
          </Button>
        </form>
        {submitted && (
          <div className="success-banner" role="status">
            로그인 되었습니다. 대시보드로 이동합니다.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="footer-text">
          아직 계정이 없나요?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToSignup}
          >
            회원가입
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
