package runc.jbnusw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

//데이터 베이스 연결안하고 테스트용 나중에 db연결할때 ()안에 있는 구문 지우고 실행
@SpringBootApplication
public class JbnuswApplication {

	public static void main(String[] args) {
		SpringApplication.run(JbnuswApplication.class, args);
	}

}
