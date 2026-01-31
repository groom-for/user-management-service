package com.team06.usermgmt.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class AuthInterceptor implements HandlerInterceptor {

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
      throws Exception {
    HttpSession session = request.getSession(false);
    Object loginUser = (session != null) ? session.getAttribute("LOGIN_USER") : null;

    if (loginUser == null) {
      response.sendRedirect("/login");
      return false;
    }
    return true;
  }
}

