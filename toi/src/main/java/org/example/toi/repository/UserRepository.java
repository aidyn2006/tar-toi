package org.example.toi.repository;

import java.util.Optional;
import org.example.toi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPhoneAndIsDeletedFalse(String phone);
    boolean existsByPhoneAndIsDeletedFalse(String phone);
    Page<User> findAllByIsDeletedFalse(Pageable pageable);
    java.util.List<User> findAllByIsDeletedFalse();
    Optional<User> findByIdAndIsDeletedFalse(Long id);
}
