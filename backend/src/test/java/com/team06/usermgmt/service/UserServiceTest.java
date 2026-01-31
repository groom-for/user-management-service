package com.team06.usermgmt.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.team06.usermgmt.dao.UserDao;
import com.team06.usermgmt.domain.LoginUser;
import com.team06.usermgmt.domain.User;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootTest
class UserServiceTest {

  @Autowired private UserService userService;

  @MockBean private UserDao userDao;

  @Test
  @DisplayName("회원가입 성공: 신규 이메일이면 insert 호출")
  void signup_success() {
    when(userDao.findByEmail("a@test.com")).thenReturn(Optional.empty());
    doNothing().when(userDao).insert(any(User.class));

    userService.signup("a@test.com", "pw1234", "홍길동");

    verify(userDao).insert(any(User.class));
  }

  @Test
  @DisplayName("로그인 성공: 이메일/비밀번호가 일치하면 LoginUser 반환")
  void login_success() {
    User user = new User();
    user.setId(1L);
    user.setEmail("a@test.com");
    user.setPassword("pw1234");
    user.setFullName("홍길동");

    when(userDao.findByEmail("a@test.com")).thenReturn(Optional.of(user));

    LoginUser result = userService.login("a@test.com", "pw1234");

    assertThat(result.getId()).isEqualTo(1L);
    assertThat(result.getEmail()).isEqualTo("a@test.com");
    assertThat(result.getName()).isEqualTo("홍길동");
  }

  @Test
  @DisplayName("로그인 실패: 비밀번호가 다르면 예외 발생")
  void login_fail_passwordMismatch() {
    User user = new User();
    user.setId(1L);
    user.setEmail("a@test.com");
    user.setPassword("pw1234");
    user.setFullName("홍길동");

    when(userDao.findByEmail("a@test.com")).thenReturn(Optional.of(user));

    assertThatThrownBy(() -> userService.login("a@test.com", "wrong"))
        .isInstanceOf(IllegalArgumentException.class);
  }
}

