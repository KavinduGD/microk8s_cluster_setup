package com.experts247.firstApp.controllers;

import com.experts247.firstApp.models.User;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@CrossOrigin
@RestController
@RequestMapping("/users")
public class UserController {

    private final Map<Long, User> users = new HashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    // CREATE
    @PostMapping
    public User createUser(@RequestBody User user) {
        Long id = idGenerator.getAndIncrement();
        user.setId(id);
        users.put(id, user);
        return user;
    }

    // READ ALL
    @GetMapping
    public Collection<User> getAllUsers() {
        return users.values();
    }

    // READ ONE
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return users.get(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        User existingUser = users.get(id);

        if (existingUser == null) {
            return null;
        }

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());

        return existingUser;
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        User removedUser = users.remove(id);

        if (removedUser == null) {
            return "User not found";
        }

        return "User deleted successfully";
    }
}