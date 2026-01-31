package com.team06.usermgmt.dao;

import com.team06.usermgmt.domain.User;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class UserDao {

  private final JdbcTemplate jdbcTemplate;

  public UserDao(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  private final RowMapper<User> userRowMapper =
      (rs, rowNum) -> {
        Long id = rs.getLong("id");
        String email = rs.getString("email");
        String password = rs.getString("password");
        String fullName = rs.getString("full_name");

        Timestamp createdAtTs = rs.getTimestamp("created_at");
        LocalDateTime createdAt = createdAtTs != null ? createdAtTs.toLocalDateTime() : null;

        return new User(id, email, password, fullName, createdAt);
      };

  public void insert(User user) {
    String sql = "INSERT INTO users(email, password, full_name) VALUES (?, ?, ?)";

    KeyHolder keyHolder = new GeneratedKeyHolder();
    jdbcTemplate.update(
        con -> {
          PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
          ps.setString(1, user.getEmail());
          ps.setString(2, user.getPassword());
          ps.setString(3, user.getFullName());
          return ps;
        },
        keyHolder);

    Number key = keyHolder.getKey();
    if (key != null) {
      user.setId(key.longValue());
    }
  }

  public Optional<User> findByEmail(String email) {
    String sql = "SELECT id, email, password, full_name, created_at FROM users WHERE email = ?";
    try {
      User user = jdbcTemplate.queryForObject(sql, userRowMapper, email);
      return Optional.ofNullable(user);
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }

  public Optional<User> findById(Long id) {
    String sql = "SELECT id, email, password, full_name, created_at FROM users WHERE id = ?";
    try {
      User user = jdbcTemplate.queryForObject(sql, userRowMapper, id);
      return Optional.ofNullable(user);
    } catch (EmptyResultDataAccessException e) {
      return Optional.empty();
    }
  }
}

