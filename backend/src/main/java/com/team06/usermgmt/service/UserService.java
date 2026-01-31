package com.team06.usermgmt.service;

import com.team06.usermgmt.dao.UserDao;
import com.team06.usermgmt.domain.LoginUser;
import com.team06.usermgmt.domain.User;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserDao userDao;

  public UserService(UserDao userDao) {
    this.userDao = userDao;
  }

  public void signup(String email, String password, String name) {
    Optional<User> existing = userDao.findByEmail(email);
    if (existing.isPresent()) {
      throw new IllegalStateException("이미 사용 중인 이메일입니다.");
    }

    User user = new User();
    user.setEmail(email);
    user.setPassword(password);
    user.setFullName(name);
    userDao.insert(user);
  }

  public LoginUser login(String email, String password) {
    User user =
        userDao
            .findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

    if (user.getPassword() == null || !user.getPassword().equals(password)) {
      throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    return new LoginUser(user.getId(), user.getEmail(), user.getFullName());
  }
}

