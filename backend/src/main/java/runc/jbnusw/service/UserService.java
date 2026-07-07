package runc.jbnusw.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import runc.jbnusw.dto.UserSignUpRequest;
import runc.jbnusw.entity.User;
import runc.jbnusw.repository.UserRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public boolean isUserIdAvailable(String userId) {
        return !userRepository.existsByUserId(userId);
    }

    public User signUp(UserSignUpRequest request) {
        if (!isUserIdAvailable(request.getUserId())) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        User user = User.builder()
                .userId(request.getUserId())
                .username(request.getUsername())
                .name(request.getUsername())
                .accountUsername(request.getUsername())
                .password(request.getPassword())
                .rawPassword(request.getPassword())
                .build();

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Optional<User> login(String userId, String password) {
        Optional<User> user = userRepository.findByUserId(userId);

        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }

        return Optional.empty();
    }
}
