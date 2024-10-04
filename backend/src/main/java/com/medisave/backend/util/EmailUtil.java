package com.medisave.backend.util;
import java.io.UnsupportedEncodingException;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;
import javax.activation.*;
public class EmailUtil {
    public static void sendEmailWithAttachment(String to, String from, String host, String subject, String messageBody, String filePath) {
        Properties properties = System.getProperties();
        properties.setProperty("mail.smtp.host", host);
        properties.setProperty("mail.smtp.port", "587");
        properties.setProperty("mail.smtp.auth", "true");
        properties.setProperty("mail.smtp.starttls.enable", "true");
        System.out.println("받는 사람 이메일: " + to);
        System.out.println("보내는 사람 이메일: " + from);
        final String username = "fairy3530@naver.com";
        final String password = "!rhcnqktkr69";

        Session session = Session.getInstance(properties, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            MimeMessage message = new MimeMessage(session);
            String senderName = MimeUtility.encodeText("하나메디세이브", "UTF-8", "B");
            message.setFrom(new InternetAddress(from, senderName));
            if (to == null || to.isEmpty()) {
                throw new IllegalArgumentException("받는 사람의 이메일 주소가 유효하지 않습니다.");
            }
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
            message.setSubject(subject);

            BodyPart messageBodyPart = new MimeBodyPart();
            messageBodyPart.setText(messageBody);

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(messageBodyPart);

            messageBodyPart = new MimeBodyPart();
            DataSource source = new FileDataSource(filePath);
            messageBodyPart.setDataHandler(new DataHandler(source));
            messageBodyPart.setFileName("하나메디세이브 적금 상품 계약서.pdf");
            multipart.addBodyPart(messageBodyPart);

            message.setContent(multipart);

            Transport.send(message);
            System.out.println("Email Sent Successfully");

        } catch (MessagingException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

//    public static void main(String[] args) {
//        PdfUtil pdfUtil = new PdfUtil();
//        pdfUtil.modifyPdf();
//        String filePath = "src/main/resources/pdf/contract.pdf";
//        String to = "fairy3530@naver.com";
//        String from = "fairy3530@naver.com";
//        String host = "smtp.naver.com";
//        String subject = "하나메디세이브 적금 상품 계약서";
//        String messageBody = "첨부파일 확인";
//
//        sendEmailWithAttachment(to, from, host, subject, messageBody, filePath);
//    }
}

