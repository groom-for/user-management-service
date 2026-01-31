import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

const initialState = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  marketingOptIn: false,
};

export default function SignupForm({ onSwitchToLogin = () => {} }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordStrength = useMemo(() => {
    const { password } = formData;
    if (!password) return { label: '보통', level: 0 };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    const labels = ['약함', '보통', '강함', '매우 강함'];
    return { label: labels[Math.min(score, labels.length - 1)], level: score };
  }, [formData]);

  const fieldHasError = (key) => Boolean(errors[key]);

  const validate = () => {
    const nextErrors = {};
    if (!formData.fullName.trim()) {
      nextErrors.fullName = '이름을 입력해 주세요.';
    }
    if (!formData.email.trim()) {
      nextErrors.email = '이메일을 입력해 주세요.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      nextErrors.email = '올바른 이메일 형식이 아닙니다.';
    }
    if (!formData.password) {
      nextErrors.password = '비밀번호를 입력해 주세요.';
    } else if (formData.password.length < 8) {
      nextErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }
    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = '비밀번호 확인을 입력해 주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    if (formData.phone && !/^[0-9-]{9,15}$/.test(formData.phone)) {
      nextErrors.phone = '숫자와 하이픈(-)만 사용할 수 있습니다.';
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
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(false);
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            marketingOptIn: formData.marketingOptIn,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            errorData?.message || '회원가입 요청에 실패했습니다.'
          );
        }
        setSubmitted(true);
        setFormData(initialState);
      } catch (error) {
        const fallbackMessage =
          error instanceof Error
            ? error.message
            : '회원가입 요청 중 오류가 발생했습니다.';
        setServerError(fallbackMessage || '회원가입 요청 중 오류가 발생했습니다.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setSubmitted(false);
    }
  };

  return (
    <Card className="signup-card">
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>
          이메일 인증을 위해 정확한 정보를 입력해 주세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <Label htmlFor="fullName">이름</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="홍길동"
              value={formData.fullName}
              onChange={handleChange}
              aria-invalid={fieldHasError('fullName')}
            />
            {fieldHasError('fullName') && (
              <p className="form-message">{errors.fullName}</p>
            )}
          </div>

          <div className="form-field">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
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
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="8자 이상 입력"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={fieldHasError('password')}
            />
            <div className="password-strength">
              <span>보안 강도: {passwordStrength.label}</span>
              <div className="strength-bar">
                <span
                  className="strength-fill"
                  data-level={passwordStrength.level}
                />
              </div>
            </div>
            {fieldHasError('password') && (
              <p className="form-message">{errors.password}</p>
            )}
          </div>

          <div className="form-field">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="비밀번호 재입력"
              value={formData.confirmPassword}
              onChange={handleChange}
              aria-invalid={fieldHasError('confirmPassword')}
            />
            {fieldHasError('confirmPassword') && (
              <p className="form-message">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="form-field">
            <Label htmlFor="phone">연락처 (선택)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="010-0000-0000"
              value={formData.phone}
              onChange={handleChange}
              aria-invalid={fieldHasError('phone')}
            />
            {fieldHasError('phone') && (
              <p className="form-message">{errors.phone}</p>
            )}
          </div>

          <label className="form-checkbox">
            <input
              type="checkbox"
              name="marketingOptIn"
              checked={formData.marketingOptIn}
              onChange={handleChange}
            />
            <span>프로모션 소식을 이메일로 받을게요.</span>
          </label>

          {serverError && <p className="form-message">{serverError}</p>}

          <Button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            계정 만들기
          </Button>
        </form>
        {submitted && (
          <div className="success-banner" role="status">
            계정 생성 요청이 접수되었습니다. 이메일을 확인해 주세요.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="footer-text">
          이미 계정이 있나요?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToLogin}
          >
            로그인하기
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
