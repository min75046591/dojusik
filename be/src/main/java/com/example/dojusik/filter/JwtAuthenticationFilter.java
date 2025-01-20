package com.example.dojusik.filter;

import com.example.dojusik.config.CustomUser;
import com.example.dojusik.config.JwtProvider;
import com.example.dojusik.auth.entity.UserEntity;
import com.example.dojusik.auth.respository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;



@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try{
            String token = parseBearerToken(request);
            if (token==null) {
                filterChain.doFilter(request, response);
                return;
            }
            String accId = jwtProvider.validate(token);
            if (accId == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Invalid JWT token.\"}");
                return;
            }
            UserEntity user = userRepository.findByAccId(accId);
            if (user == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"User not found.\"}");
                return;
            }
            String role = user.getRole();

            // role: ROLE_USER / ROLE_ADMIN 권한 설정 String 컨벤션
            // spring Security는 권한 기반 접근 제어 수행
            List<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority(role));

            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            AbstractAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user, null,authorities);
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            securityContext.setAuthentication(authenticationToken);
            SecurityContextHolder.setContext(securityContext);

        }catch (Exception e){
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"An error occurred during authentication.\"}");
            e.printStackTrace();
            return;

        }
        filterChain.doFilter(request,response);
    }
    private String parseBearerToken(HttpServletRequest request){
        String authorization = request.getHeader("Authorization");
        // authorizatino이 존재하는 값인지 검증
        boolean hasAuthorization = StringUtils.hasText(authorization);
        if (!hasAuthorization) return null;
        // Bearer 인증방식인지 확인
        boolean isBearer = authorization.startsWith("Bearer ");
        if(!isBearer) return null;

        // request 객체에서 토큰값 추출
        String token = authorization.substring(7);
        return token;

    }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth");
    }
}
