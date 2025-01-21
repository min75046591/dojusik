package com.example.dojusik.api.auth.respository;

import com.example.dojusik.api.auth.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity,Integer> {
    UserEntity findByAccId(String accId);
    Boolean existsByAccId(String accId);
    Boolean existsByEmail(String email);
}
