package com.example.dojusik.auth.respository;

import com.example.dojusik.auth.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity,String> {
    UserEntity findByAccId(String accId);
    Boolean existsByAccId(String accId);
}
