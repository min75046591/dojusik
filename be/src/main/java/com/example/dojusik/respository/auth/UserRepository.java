package com.example.dojusik.respository.auth;

import com.example.dojusik.entity.auth.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity,String> {
}
