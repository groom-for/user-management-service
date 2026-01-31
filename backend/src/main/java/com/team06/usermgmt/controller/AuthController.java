package com.team06.usermgmt.controller;

import com.team06.usermgmt.domain.LoginUser;
import com.team06.usermgmt.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AuthController {

  private final UserService userService;

  public AuthController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/signup")
  public String signupForm() {
    return "signup";
  }

  @PostMapping("/signup")
  public String signup(
      @RequestParam String email,
      @RequestParam String password,
      @RequestParam String name,
      Model model) {
    try {
      userService.signup(email, password, name);
      return "redirect:/login";
    } catch (IllegalStateException e) {
      model.addAttribute("error", e.getMessage());
      model.addAttribute("email", email);
      model.addAttribute("name", name);
      return "signup";
    }
  }

  @GetMapping("/login")
  public String loginForm() {
    return "login";
  }

  @PostMapping("/login")
  public String login(
      @RequestParam String email,
      @RequestParam String password,
      HttpSession session,
      Model model) {
    try {
      LoginUser loginUser = userService.login(email, password);
      session.setAttribute("LOGIN_USER", loginUser);
      return "redirect:/home";
    } catch (IllegalArgumentException e) {
      model.addAttribute("error", e.getMessage());
      model.addAttribute("email", email);
      return "login";
    }
  }

  @PostMapping("/logout")
  public String logout(HttpSession session) {
    session.invalidate();
    return "redirect:/login";
  }

  @GetMapping({"/", "/home"})
  public String home(HttpSession session, Model model) {
    Object loginUser = session.getAttribute("LOGIN_USER");
    model.addAttribute("loginUser", loginUser);
    return "home";
  }
}

