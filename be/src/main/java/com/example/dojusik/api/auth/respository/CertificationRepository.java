package com.example.dojusik.api.auth.respository;

import com.example.dojusik.api.auth.entity.CertificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationRepository extends JpaRepository<CertificationEntity,String> {

}
