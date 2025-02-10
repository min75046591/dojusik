package com.example.dojusik.config;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailProvider {
    private final JavaMailSender javaMailSender;

    private final String SUBJECT = "모의 투자 서비스 [dojusick] 인증 메일입니다";

    public boolean sendCertificationMail(String email, String certivicationNumber){
        try{
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(message, true);

            String htmlContent = getCertificationMessage(certivicationNumber);

            messageHelper.setTo(email);
            messageHelper.setSubject(SUBJECT);
            messageHelper.setText(htmlContent,true);

            javaMailSender.send(message);

        } catch (Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    private String getCertificationMessage(String certificationNumber){
        String certificationMessage = "";
        certificationMessage += "<h1 style='text-align: center; color: #333333; font-size: 24px; margin-bottom: 20px;'>서비스 인증 메일</h1>";
        certificationMessage += "<div style='text-align: center; margin-bottom: 20px;'>";
        certificationMessage += "<h3 style='display: inline-block; color: #555555; font-size: 18px; margin-right: 10px;'>인증 코드를 입력해 주세요:</h3>";
        certificationMessage += "<h3 style='display: inline-block;'>"
                + "<strong style='font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 6px; background-color: #f4f4f4; padding: 10px 20px; border-radius: 5px;'>"
                + certificationNumber
                + "</strong>"
                + "</h3>";
        certificationMessage += "</div>";
        certificationMessage += "<p style='text-align: center; color: #777777; font-size: 14px; margin-top: 20px;'>이 메일은 요청에 따라 발송되었습니다. 본인이 요청하지 않았다면 이 메일을 무시해 주세요.</p>";
        return certificationMessage;
    }

}
