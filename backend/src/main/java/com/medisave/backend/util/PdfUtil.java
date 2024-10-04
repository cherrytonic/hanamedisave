package com.medisave.backend.util;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Canvas;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.medisave.backend.account.domain.MedAccount;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class PdfUtil {
    public void modifyPdf(MedAccount medAccount, String personName, String residentRegistrationNumber, String selectedItem) {
        try {
            String src = getAbsoluteFilePath("pdf/contract_form.pdf");

            String dest = getAbsoluteFilePath("pdf/contract.pdf");

            // PDF 문서 객체 생성
            PdfDocument pdfDoc = new PdfDocument(new PdfReader(src), new PdfWriter(dest));

            // 첫 번째 페이지 가져오기
            PdfPage page = pdfDoc.getPage(1);

            // 페이지 크기 확인
            Rectangle pageSize = page.getPageSize();
            System.out.println("페이지 크기: " + pageSize.getWidth() + "x" + pageSize.getHeight());

            // 페이지 중간에 텍스트 삽입 (중앙 좌표 계산)
            float x = pageSize.getWidth() / 2;  // 가로 중앙
            float y = pageSize.getHeight() / 2; // 세로 중앙

            // 좌표와 크기 지정 (x, y, width, height)
            Rectangle rect = new Rectangle(x - 100, y, 200, 50);  // 텍스트 너비 200 포인트

            // 해당 좌표에 Canvas 객체 생성
            Canvas canvas = new Canvas(new PdfCanvas(page), rect);

            // 한글 폰트 설정
            String fontPath = getAbsoluteFilePath("fonts/Hana2-Regular.ttf");
            PdfFont font = PdfFontFactory.createFont(fontPath, "Identity-H");
            // 오늘 날짜 계산
            LocalDate currentDate = LocalDate.now();
            String formattedDate = currentDate.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일"));
            String formattedDateNoMark = currentDate.format(DateTimeFormatter.ofPattern("yyyy        MM       dd"));

            // 각 필드에 텍스트 추가하기

            // 예금주: 원채령 -> 변경할 것
            addText(page, font, personName, 130, 670, 200, 20);

            // 고객번호: 9612052****** -> 변경할 것
            addText(page, font, residentRegistrationNumber, 280, 670, 200, 20);

            // 신규일: 오늘 날짜
            addText(page, font, formattedDate, 440, 670, 200, 20);

            // 상품명: 하나메디세이브 임플란트목표적금 -> 변경할 것
            addText(page, font, "하나메디세이브 " + selectedItem + " 목표적금", 130, 615, 400, 20);

            // 계좌번호: 아무숫자 (예: 123456789) -> 변경할 것
            addText(page, font, medAccount.getMedAccountId().toString(), 130, 590, 200, 20);

            // 계약기간: 1년 -> 변경할 것
            addText(page, font, medAccount.getGoalPeriodMonths().toString() + "개월", 130, 565, 200, 20);

            // 적용금리: 2.50%(세전) -> 변경할 것
            addText(page, font, medAccount.getInterestRate() != null ? medAccount.getInterestRate().multiply(new BigDecimal("100")).toString() + "% (세전)" : "3.5% (세전)", 130, 540, 200, 20);


            // 과세구분: 일반과세
            addText(page, font, "일반과세", 130, 515, 200, 20);

            // 약관/설명서: 이메일
            addText(page, font, "이메일", 130, 490, 200, 20);

            // 밑에 날짜 (년, 월, 일)
            addText(page, font, formattedDateNoMark, 220, 150, 200, 20);

            // 신규 영업점: 하나금융TI
            addText(page, font, "하나금융TI", 180, 110, 200, 20);

            // 밑줄: 02-2151-6400
            addText(page, font, "02-2151-6400", 180, 70, 200, 20);

            // 예금주: 원채령 -> 변경할 것
            addText(page, font, personName, 400, 110, 200, 20);

            // 신규 직원명: 김하나
            addText(page, font, "김하나", 400, 70, 200, 20);

            // 문서 닫기
            pdfDoc.close();
            System.out.println("PDF 수정 완료!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 텍스트를 추가하는 함수
    private static void addText(PdfPage page, PdfFont font, String text, float x, float y, float width, float height) {
        Rectangle rect = new Rectangle(x, y, width, height);
        Canvas canvas = new Canvas(new PdfCanvas(page), rect);
        Paragraph para = new Paragraph(text).setFont(font).setFontSize(12).setTextAlignment(TextAlignment.LEFT);
        canvas.add(para);
        canvas.close();
    }

    // resources 폴더 내의 파일 경로를 절대 경로로 변환하는 함수
    public static String getAbsoluteFilePath(String relativePath) throws IOException {
        // resources 폴더의 경로를 가져오기
        Path resourceDirectory = Paths.get("src", "main", "resources", relativePath);
        return resourceDirectory.toFile().getAbsolutePath();
    }
}
