package runc.jbnusw.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import runc.jbnusw.dto.UserSignUpRequest;
import runc.jbnusw.entity.User;
import runc.jbnusw.service.UserService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;

    @PostMapping("/check-id")
    public ResponseEntity<Map<String, Object>> checkUserId(@RequestParam String userId) {
        boolean available = userService.isUserIdAvailable(userId);
        Map<String, Object> response = new HashMap<>();
        response.put("available", available);
        response.put("message", available ? "사용 가능한 아이디입니다." : "이미 존재하는 아이디입니다.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody UserSignUpRequest request) {
        try {
            User user = userService.signUp(request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다.");
            response.put("userId", user.getUserId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "회원가입 중 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @RequestParam String userId,
            @RequestParam String password
    ) {
        Optional<User> user = userService.login(userId, password);
        Map<String, Object> response = new HashMap<>();

        if (user.isPresent()) {
            response.put("success", true);
            response.put("message", "로그인 성공");
            response.put("userId", user.get().getUserId());
            response.put("username", user.get().getUsername());
            return ResponseEntity.ok(response);
        }

        response.put("success", false);
        response.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
