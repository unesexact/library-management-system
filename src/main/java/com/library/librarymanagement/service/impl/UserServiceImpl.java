package com.library.librarymanagement.service.impl;

import com.library.librarymanagement.entity.User;
import com.library.librarymanagement.repository.UserRepository;
import com.library.librarymanagement.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;


    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }


    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    @Override
    public User getUserById(Long id) {

        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }


    @Override
    public User updateUser(Long id, User user) {

        User existingUser = getUserById(id);

        existingUser.setUsername(user.getUsername());
        existingUser.setPassword(user.getPassword());
        existingUser.setFullName(user.getFullName());
        existingUser.setRole(user.getRole());

        return userRepository.save(existingUser);
    }


    @Override
    public void deleteUser(Long id) {

        User user = getUserById(id);

        userRepository.delete(user);
    }
}