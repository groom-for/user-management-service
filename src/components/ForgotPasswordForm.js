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

export default function ForgotPasswordForm({ onSwitchToLogin = () => {} }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    if (!email.trim()) {
      setError('이메일을 입력해 주세요.');
      setSubmitted(false);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      setSubmitted(false);
      return;
    }
    setError('');
    setServerError('');
    setSubmitted(false);
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || '비밀번호 재설정 요청에 실패했습니다.'
        );
      }
      setEmail('');
      setSubmitted(true);
    } catch (error) {
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : '비밀번호 재설정 요청 중 오류가 발생했습니다.';
      setServerError(
        fallbackMessage || '비밀번호 재설정 요청 중 오류가 발생했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="signup-card">
      <CardHeader>
        <CardTitle>비밀번호 재설정</CardTitle>
        <CardDescription>
          가입 시 사용했던 이메일로 재설정 링크를 보내드릴게요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <Label htmlFor="forgotEmail">이메일</Label>
            <Input
              id="forgotEmail"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError('');
              }}
              aria-invalid={Boolean(error)}
            />
            {error && <p className="form-message">{error}</p>}
          </div>

          {serverError && <p className="form-message">{serverError}</p>}

          <Button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            재설정 링크 보내기
          </Button>
        </form>
        {submitted && (
          <div className="success-banner" role="status">
            재설정 링크를 이메일로 보냈습니다. 받은 편지함을 확인해 주세요.
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="footer-text">
          이미 링크를 받으셨나요?{' '}
          <button
            type="button"
            className="link-button"
            onClick={onSwitchToLogin}
          >
            로그인으로 돌아가기
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
