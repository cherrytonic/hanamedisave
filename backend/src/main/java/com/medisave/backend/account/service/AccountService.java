package com.medisave.backend.account.service;

import com.medisave.backend.account.domain.*;
import com.medisave.backend.account.dto.SavingRecordDTO;
import com.medisave.backend.account.repository.*;
import com.medisave.backend.alert.dto.WebSocketMessage;
import com.medisave.backend.member.domain.Member;
import com.medisave.backend.member.repository.MemberRepository;
import com.medisave.backend.member.service.MemberService;
import com.medisave.backend.util.EmailUtil;
import com.medisave.backend.util.PdfUtil;
import com.medisave.backend.util.SMSUtil;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.Locale;
import java.util.stream.Collectors;


@Service
public class AccountService {
    private static final Logger logger = LoggerFactory.getLogger(AccountService.class);

    @Autowired
    private MedAccountRepository medAccountRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountRecordRepository accountRecordRepository;

    @Autowired
    private SavingRecordRepository savingRecordRepository;

    @Autowired
    private ParticipantAccountRepository participantAccountRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MemberService memberService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private SMSUtil smsUtil;

    // memberId로 계좌 목록 조회
    public List<Account> getAccountsByMemberId(String memberId) {
        return accountRepository.findByMemberId(memberId);
    }
    public List<MedAccount> getMedAccountsByMemberId(String memberId) {
        return medAccountRepository.findByMemberId(memberId);
    }
    public List<MedAccount> getClosedMedAccountsByMemberId(String memberId) {
        return medAccountRepository.findByMemberIdAndClosed(memberId, "Y");
    }
    public List<MedAccountWithRecordDTO> getActiveMedAccountsByMemberId(String memberId) {
        List<MedAccount> medAccounts = medAccountRepository.findByMemberIdAndClosed(memberId, "N");

        // 2. 결과 리스트 생성
        List<MedAccountWithRecordDTO> result = new ArrayList<>();

        // 3. 각 적금 계좌에 대해 입금 기록 조회 및 DTO 변환
        for (MedAccount medAccount : medAccounts) {
            MedAccountWithRecordDTO dto = new MedAccountWithRecordDTO();
            dto.setMedAccountId(medAccount.getMedAccountId());
            dto.setAccountId(medAccount.getAccountId());
            dto.setMedAccountDt(medAccount.getMedAccountDt());
            dto.setMedAccountBalance(medAccount.getMedAccountBalance());
            dto.setTargetSavingsAmount(medAccount.getTargetSavingsAmount());
            dto.setInterestRate(medAccount.getInterestRate());
            dto.setPerDepositAmount(medAccount.getPerDepositAmount());
            dto.setPreTaxInterest(medAccount.getPreTaxInterest());
            dto.setPostTaxInterest(medAccount.getPostTaxInterest());
            dto.setGoalPeriodMonths(medAccount.getGoalPeriodMonths());
            dto.setAccountType(medAccount.getAccountType());
            dto.setDepositCycle(medAccount.getDepositCycle());
            dto.setTransferDay(medAccount.getTransferDay());
            dto.setExpectedEndDate(medAccount.getExpectedEndDate());
            dto.setMemberId(medAccount.getMemberId());
            dto.setExpectedMoney(medAccount.getExpectedMoney());
            dto.setMedAccountNm(medAccount.getMedAccountNm());
            dto.setClosed(medAccount.getClosed());
            dto.setWithdraw(medAccount.getWithdraw());

            // 4. 해당 계좌의 입금 기록 조회
            List<SavingRecord> savingRecords = savingRecordRepository.findByMedAccountId(medAccount.getMedAccountId());

            dto.setRecords(savingRecords);

            // 6. 결과 리스트에 추가
            result.add(dto);
        }

        // 7. 결과 반환
        return result;
    }
    public boolean verifyAccountPassword(Long accountId, String password) {
        return accountRepository.findById(accountId)
                .map(account -> account.getAccountPw().equals(password))
                .orElse(false);
    }
    public SavingRecord createSavingRecord(BigDecimal initialDeposit, Long medAccountId) {
        SavingRecord savingRecord = new SavingRecord();
        savingRecord.setSavingAmount(initialDeposit);
        savingRecord.setSavingDate(LocalDateTime.now());
        savingRecord.setMedAccountId(medAccountId);

        return savingRecordRepository.save(savingRecord);  // 저장 후 반환
    }
    @Transactional
    public MedAccount createMedAccount(MedAccount medAccount, String personName, String residentRegistrationNumber, String email, String selectedItem) {
        // 1. 해당 회원의 계좌 정보 조회
        List<Account> accounts = accountRepository.findByMemberId(medAccount.getMemberId());

        // 리스트가 비어있으면 예외 발생
        if (accounts.isEmpty()) {
            throw new RuntimeException("계좌를 찾을 수 없습니다.");
        }
        Account account = accounts.get(0); // 첫 번째 계좌 선택

        // 2. 계좌의 잔액에서 첫 납입금 차감
        BigDecimal initialDeposit = medAccount.getPerDepositAmount();
        if (account.getAccountBalance().compareTo(initialDeposit) < 0) {
            throw new RuntimeException("잔액이 부족합니다.");
        }
        account.setAccountBalance(account.getAccountBalance().subtract(initialDeposit));
        accountRepository.save(account);

        // 3. 적금 계좌 생성
        MedAccount savedMedAccount = medAccountRepository.save(medAccount);
        String memberId = savedMedAccount.getMemberId();
        System.out.println("회원 ID: " + memberId);

        // 4. 입출금 거래 기록 저장
        AccountRecord accountRecord = new AccountRecord();
        accountRecord.setAccountId(account.getAccountId());
        accountRecord.setTransactionDate(LocalDateTime.now());
        accountRecord.setAmount(initialDeposit.negate());
        accountRecord.setDescription("MED_ACCOUNT 첫 납입");
        accountRecordRepository.save(accountRecord);

        // 5. SavingRecord 저장 - 첫 납입 기록
        SavingRecord savingRecord = new SavingRecord();
        savingRecord.setMedAccountId(savedMedAccount.getMedAccountId());
        savingRecord.setSavingDate(LocalDateTime.now());
        savingRecord.setSavingAmount(initialDeposit);
        savingRecord.setSender(memberId);  // 첫 납입자 ID 기록
        savingRecordRepository.save(savingRecord);

        // 6. ParticipantAccount 생성 (Only for FREE accounts)
        if ("FREE".equalsIgnoreCase(medAccount.getAccountType())) {
            ParticipantAccount participantAccount = new ParticipantAccount();
            participantAccount.setMedAccount(savedMedAccount);

            // 회원 정보 조회
            Member member = memberRepository.findByMemberId(savedMedAccount.getMemberId())
                    .orElseThrow(() -> new RuntimeException("Member not found."));
            participantAccount.setMember(member);
            participantAccount.setCanWithdraw("Y");
            participantAccount.setParticipationDate(LocalDate.now());
            participantAccountRepository.save(participantAccount);
        }

        // 7. PDF 생성 및 이메일 발송
        PdfUtil pdfUtil = new PdfUtil();
        pdfUtil.modifyPdf(savedMedAccount, personName, residentRegistrationNumber, selectedItem);

        String filePath = "src/main/resources/pdf/contract.pdf";
        String subject = "하나메디세이브 적금 상품 계약서";
        String messageBody = "적금 계약서 파일을 첨부합니다.";
        System.out.println("서비스 이메일" + email);
        EmailUtil.sendEmailWithAttachment(email, "fairy3530@naver.com", "smtp.naver.com", subject, messageBody, filePath);

        return savedMedAccount;
    }

    @Transactional
    public void depositToMedAccount(Long medAccountId, BigDecimal depositAmount) {
        MedAccount medAccount = medAccountRepository.findById(medAccountId)
                .orElseThrow(() -> new RuntimeException("적금 계좌를 찾을 수 없습니다."));

        // 1. 적금 계좌에 입금
        createSavingRecord(depositAmount, medAccount.getMedAccountId());

        // 2. 잔액 업데이트
        medAccount.setMedAccountBalance(medAccount.getMedAccountBalance().add(depositAmount));
        medAccountRepository.save(medAccount);
    }
    // 매일 한 번씩 실행하여 모든 계좌에 대해 주기와 날짜 확인
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")  // 매일 자정에 실행
    public void processScheduledTransfers() {
        List<MedAccount> medAccounts = medAccountRepository.findAll();  // 모든 계좌 조회
        LocalDate today = LocalDate.now();  // 오늘 날짜

        for (MedAccount medAccount : medAccounts) {
            processSingleMedAccount(medAccount, today);  // 각 MedAccount를 별도의 트랜잭션으로 처리
        }
    }

    @Transactional  // 각 계좌에 대해 별도의 트랜잭션 실행
    public void processSingleMedAccount(MedAccount medAccount, LocalDate today) {
        boolean shouldTransfer = false;

        // 주기별 이체 판단 로직 (depositCycle이 null이 아닌 경우에만 처리)
        if (medAccount.getDepositCycle() != null) {
            if (medAccount.getDepositCycle().equalsIgnoreCase("weekly")) {
                String todayDayOfWeek = today.getDayOfWeek().name();  // 오늘 요일 (예: "THURSDAY")
                if (todayDayOfWeek.equalsIgnoreCase(medAccount.getTransferDay())) {
                    shouldTransfer = true;  // 오늘이 이체할 날이면 true
                }
            } else if (medAccount.getDepositCycle().equalsIgnoreCase("monthly")) {
                if (today.getDayOfMonth() == Integer.parseInt(medAccount.getTransferDay())) {
                    shouldTransfer = true;  // 오늘이 이체할 날이면 true
                }
            }
        }

        // 이체할 조건을 만족하는 경우에만 실행
        if (shouldTransfer) {
            Member owner = memberRepository.findByMemberId(medAccount.getMemberId())
                    .orElseThrow(() -> new RuntimeException("Owner not found for MedAccount"));
            executeTransfer(medAccount, owner);  // 이체 작업 수행
        }

        // 만기일 하루 전 문자 발송 로직
        LocalDate expectedEndDate = medAccount.getExpectedEndDate();  // 이미 LocalDate이므로 바로 사용 가능

        if (today.plusDays(1).isEqual(expectedEndDate)) {
            Member owner = memberRepository.findByMemberId(medAccount.getMemberId())
                    .orElseThrow(() -> new RuntimeException("Owner not found for MedAccount"));

            // 문자 발송
            String messageText = "[하나메디세이브] 귀하의 적금 \"" + medAccount.getMedAccountNm() + "\"이 곧 만기됩니다. 준비해주세요!";
            System.out.println(messageText);
            smsUtil.sendSms(owner.getMemberPhoneNb(), messageText);
        }
    }



    // 이체 로직
    private void executeTransfer(MedAccount medAccount, Member member) {
        // 1. Account에서 금액 차감
        Account account = accountRepository.findById(medAccount.getAccountId())
                .orElseThrow(() -> new RuntimeException("계좌를 찾을 수 없습니다."));

        BigDecimal transferAmount = medAccount.getPerDepositAmount();
        if (account.getAccountBalance().compareTo(transferAmount) < 0) {
            throw new RuntimeException("계좌 잔액이 부족합니다.");
        }

        // Account에서 금액 차감
        account.setAccountBalance(account.getAccountBalance().subtract(transferAmount));
        accountRepository.save(account);

        // MedAccount에 금액 추가
        medAccount.setMedAccountBalance(medAccount.getMedAccountBalance().add(transferAmount));
        medAccountRepository.save(medAccount);

        // 2. SavingRecord에 기록 추가
        SavingRecord savingRecord = new SavingRecord();
        savingRecord.setSavingAmount(transferAmount);
        savingRecord.setSavingDate(LocalDateTime.now());
        savingRecord.setMedAccountId(medAccount.getMedAccountId());
        savingRecord.setSender(member.getMemberId());  // Member 대신 memberId를 String으로 저장
        savingRecordRepository.save(savingRecord);

        // 3. AccountRecord에 거래 기록 추가
        AccountRecord accountRecord = new AccountRecord();
        accountRecord.setAccountId(account.getAccountId());
        accountRecord.setTransactionDate(LocalDateTime.now());
        accountRecord.setAmount(transferAmount.negate());  // 출금 기록
        accountRecord.setDescription("자동 이체 - " + medAccount.getMedAccountId());
        accountRecordRepository.save(accountRecord);
    }

    public Map<String, Object> getCategorizedAccountsWithMonthlyTrends(String memberId) {
        Map<String, Object> response = new HashMap<>();

        // Retrieve accounts and categorize them
        List<Account> accounts = accountRepository.findByMemberId(memberId);
        List<MedAccount> medAccounts = medAccountRepository.findByMemberIdAndClosed(memberId, "N");

        List<Account> depositAccounts = new ArrayList<>();
        List<MedAccount> regularSavings = new ArrayList<>();
        List<MedAccount> freeInstallmentSavings = new ArrayList<>();

        // Categorize accounts
        for (Account account : accounts) {
            depositAccounts.add(account);
        }

        for (MedAccount medAccount : medAccounts) {
            if ("AUTO".equalsIgnoreCase(medAccount.getAccountType())) {
                regularSavings.add(medAccount);
            } else {
                freeInstallmentSavings.add(medAccount);
            }
        }

        // Prepare monthly trend data for each account and medAccount
        Map<String, Map<String, BigDecimal>> monthlyAccountTrends = new HashMap<>();
        Map<String, Map<String, BigDecimal>> monthlySavingTrends = new HashMap<>();

        for (Account account : depositAccounts) {
            List<AccountRecord> accountRecords = accountRecordRepository.findByAccountId(account.getAccountId());
            Map<String, BigDecimal> accountMonthlyTrend = calculateMonthlyTrends(accountRecords);
            monthlyAccountTrends.put("Account_" + account.getAccountId(), accountMonthlyTrend);
        }

        for (MedAccount medAccount : medAccounts) {
            List<SavingRecord> savingRecords = savingRecordRepository.findByMedAccountId(medAccount.getMedAccountId());
            Map<String, BigDecimal> savingMonthlyTrend = calculateMonthlyTrends(savingRecords);
            monthlySavingTrends.put("MedAccount_" + medAccount.getMedAccountId(), savingMonthlyTrend);
        }

        // Return categorized accounts and trends
        response.put("depositAccounts", depositAccounts);
        response.put("regularSavings", regularSavings);
        response.put("freeInstallmentSavings", freeInstallmentSavings);
        response.put("monthlyAccountTrends", monthlyAccountTrends);
        response.put("monthlySavingTrends", monthlySavingTrends);

        return response;
    }


    private Map<String, BigDecimal> calculateMonthlyTrends(List<? extends TransactionRecord> records) {
        Map<String, BigDecimal> monthlyTrends = new HashMap<>();

        // 한국어 월 이름 포맷터
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("M월", Locale.KOREAN);

        for (TransactionRecord record : records) {
            // 월과 연도를 한국어로 포맷
            String month = record.getTransactionDate().format(monthFormatter);
            String year = String.valueOf(record.getTransactionDate().getYear());
            String monthYear = month + " " + year;
            // 해당 월의 거래 금액 합산
            monthlyTrends.put(monthYear, monthlyTrends.getOrDefault(monthYear, BigDecimal.ZERO).add(record.getAmount()));
        }
        return monthlyTrends;
    }

    // 참여자 추가 메소드
    @Transactional
    public void addParticipantToMedAccount(Long medAccountId, String memberId) {
        MedAccount medAccount = medAccountRepository.findById(medAccountId)
                .orElseThrow(() -> new RuntimeException("MedAccount not found."));
        Member member = memberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found."));

        // 이미 참여한 경우 예외 처리
        boolean exists = participantAccountRepository.existsByMedAccountAndMember(medAccount, member);
        if (exists) {
            throw new RuntimeException("Member already participating in this MedAccount.");
        }

        ParticipantAccount participantAccount = new ParticipantAccount();
        participantAccount.setMedAccount(medAccount);
        participantAccount.setMember(member);
        participantAccountRepository.save(participantAccount);

        // 적금 이율에 0.002 추가
        medAccount.setInterestRate(medAccount.getInterestRate().add(BigDecimal.valueOf(0.002)));
        System.out.println("이율 추가됐나" + medAccount.getInterestRate());
        medAccountRepository.save(medAccount);  // 변경된 이율 저장


    }

    // 특정 적금 계좌의 참여자 목록 조회
    public List<ParticipantAccount> getParticipantsByMedAccountId(Long medAccountId) {
        // 해당 적금 계좌 조회
        MedAccount medAccount = medAccountRepository.findById(medAccountId)
                .orElseThrow(() -> new RuntimeException("MedAccount not found."));
        System.out.println(medAccount.getClosed());
        // 적금 계좌가 활성화된 경우 (closed 상태가 'N')에만 참가자 목록 반환
        if ("Y".equals(medAccount.getClosed())) {
            throw new RuntimeException("MedAccount is closed.");
        }
        return participantAccountRepository.findByMedAccount(medAccount);
    }
    // 참여자가 적금에 송금
    @Transactional
    public Map<String, Object> depositToMedAccountFromParticipant(Long medAccountId, String memberId, BigDecimal depositAmount, int point) {
        MedAccount medAccount = medAccountRepository.findById(medAccountId)
                .orElseThrow(() -> new RuntimeException("MedAccount not found."));

        Member member = memberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found."));

        // 참여자 여부 확인
        boolean isParticipant = participantAccountRepository.existsByMedAccountAndMember(medAccount, member);
        if (!isParticipant) {
            throw new RuntimeException("Member is not a participant in this MedAccount.");
        }

        // 참여자의 계좌 조회
        List<Account> accounts = accountRepository.findByMemberId(memberId);
        if (accounts.isEmpty()) {
            throw new RuntimeException("Participant has no account.");
        }
        Account participantAccount = accounts.get(0);

        // 잔액 확인
        if (participantAccount.getAccountBalance().compareTo(depositAmount) < 0) {
            throw new RuntimeException("Participant account has insufficient balance.");
        }

        // 참여자 계좌에서 금액 차감
        participantAccount.setAccountBalance(participantAccount.getAccountBalance().subtract(depositAmount));
        accountRepository.save(participantAccount);

        // 적금 계좌에 금액 추가
        medAccount.setMedAccountBalance(medAccount.getMedAccountBalance().add(depositAmount));
        medAccountRepository.save(medAccount);

        // 포인트 차감 (리워드 감소)
        BigDecimal pointAsBigDecimal = BigDecimal.valueOf(point);
        memberService.updateReward(memberId, pointAsBigDecimal.negate());

        // 거래 기록 저장
        // 참여자 계좌의 출금 기록
        AccountRecord accountRecord = new AccountRecord();
        accountRecord.setAccountId(participantAccount.getAccountId());
        accountRecord.setTransactionDate(LocalDateTime.now());
        accountRecord.setAmount(depositAmount.negate());
        accountRecord.setDescription("Transfer to MedAccount " + medAccountId);
        accountRecordRepository.save(accountRecord);

        // 적금 계좌의 입금 기록
        SavingRecord savingRecord = new SavingRecord();
        savingRecord.setMedAccountId(medAccountId);
        savingRecord.setSavingDate(LocalDateTime.now());
        savingRecord.setSavingAmount(depositAmount);
        savingRecord.setSender(memberId);  // Member 대신 memberId를 String으로 저장
        savingRecordRepository.save(savingRecord);

        // 새롭게 갱신된 리워드를 반환
        Map<String, Object> response = new HashMap<>();
        response.put("newReward", member.getReward());
        return response;
    }


    public Map<String, Object> getParticipantMedAccountsAndRecords(String memberId) {
        // 사용자의 참여 중인 모든 적금 목록을 조회
        Member member = memberRepository.findByMemberId(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found."));

        // 사용자가 참여한 적금 목록 조회
        List<ParticipantAccount> participantAccounts = participantAccountRepository.findByMember(member)
                .stream()
                .filter(participantAccount -> participantAccount.getMedAccount().getClosed().equals("N")) // 활성화된 계좌만 필터링
                .collect(Collectors.toList());

        // 각 적금에 대한 입금 기록을 담을 Map 생성
        Map<String, Object> medAccountsAndRecords = new HashMap<>();

        // 각 참여 중인 적금에 대한 입금 기록 조회
        for (ParticipantAccount participantAccount : participantAccounts) {
            MedAccount medAccount = participantAccount.getMedAccount();

            // 해당 적금의 입금 기록 조회
            List<SavingRecord> savingRecords = savingRecordRepository.findByMedAccountId(medAccount.getMedAccountId());
            List<SavingRecordDTO> savingRecordDTOs = new ArrayList<>();

            for (SavingRecord savingRecord : savingRecords) {
                SavingRecordDTO dto = new SavingRecordDTO();
                dto.setSavingAmount(savingRecord.getAmount());
                dto.setSavingDate(savingRecord.getTransactionDate());

                // sender의 memberId를 가져와 memberNm 조회
                String senderId = savingRecord.getSender();  // sender는 memberId로 저장되어 있음
                if (senderId != null) {
                    Member senderMember = memberRepository.findByMemberId(senderId)
                            .orElseThrow(() -> new RuntimeException("Sender not found with ID: " + senderId));
                    dto.setSenderName(senderMember.getMemberNm());  // sender의 이름 설정
                } else {
                    dto.setSenderName("Unknown");  // sender가 null인 경우 처리
                }
                savingRecordDTOs.add(dto);
            }

            // 적금 정보와 입금 기록을 Map에 저장
            Map<String, Object> accountInfo = new HashMap<>();
            accountInfo.put("medAccountId", medAccount.getMedAccountId());
            accountInfo.put("medAccountName", medAccount.getMedAccountNm());
            accountInfo.put("medAccountDt", medAccount.getMedAccountDt());
            accountInfo.put("accountType", medAccount.getAccountType());
            accountInfo.put("targetSavingAmount", medAccount.getTargetSavingsAmount());
            accountInfo.put("medAccountBalance", medAccount.getMedAccountBalance());
            accountInfo.put("interestRate", medAccount.getInterestRate());
            accountInfo.put("expectedEndDate", medAccount.getExpectedEndDate());
            accountInfo.put("records", savingRecordDTOs);

            // 적금 계좌 정보와 그에 대한 입금 기록을 Map에 저장
            medAccountsAndRecords.put(medAccount.getMedAccountNm() + " (" + medAccount.getMedAccountId() + ")", accountInfo);
        }

        return medAccountsAndRecords;
    }
    @Transactional
    public void closeMedAccount(Long medAccountId, BigDecimal amount, Long accountId) {
        // 1. 해당 적금 계좌 조회
        MedAccount medAccount = medAccountRepository.findById(medAccountId)
                .orElseThrow(() -> new RuntimeException("MedAccount not found."));


        // 3. 이체할 대상 Account 조회
        Account targetAccount = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found."));

        // 4. 금액을 Account로 이체
        targetAccount.setAccountBalance(targetAccount.getAccountBalance().add(amount));
        accountRepository.save(targetAccount);

        // 5. 이체 기록을 AccountRecords에 저장 (입금 기록)
        AccountRecord accountRecord = new AccountRecord();
        accountRecord.setAccountId(accountId);
        accountRecord.setTransactionDate(LocalDateTime.now());
        accountRecord.setAmount(amount);
        accountRecord.setDescription("Account closed - transferred amount");
        accountRecordRepository.save(accountRecord);

        // 6. 적금 계좌 소유자(Member) 정보 조회 (여기서 MEMBER_ID가 있는지 가정)
        Member member = memberRepository.findByMemberId(medAccount.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found."));

        // 7. 메시지 전송 (메시지 내용은 원하는대로 수정 가능)
        String messageText = "[하나메디세이브] 적금 해지가 완료되어 보유하신 하나은행 계좌로 정상 예치되었습니다.";
        System.out.println(messageText);
        smsUtil.sendSms(member.getMemberPhoneNb(), messageText);

        try {
            // 기존 로직

            // 참여자 목록 조회
            List<ParticipantAccount> participants = getParticipantsByMedAccountId(medAccountId);

            // 각 참여자에게 WebSocket 알림 전송
            Set<String> notifiedParticipants = new HashSet<>();

            for (ParticipantAccount participant : participants) {
                if (!notifiedParticipants.contains(participant.getMember().getMemberId())) {
                    String notification = "[하나메디세이브] " + medAccount.getMedAccountNm() + " 적금 계좌가 해지되었습니다.";
                    logger.info("Sending WebSocket notification to /sub/medAccount/closure: {}", notification);
                    messagingTemplate.convertAndSend("/sub/medAccount/closure", new WebSocketMessage(notification));
                    notifiedParticipants.add(participant.getMember().getMemberId());  // 중복 전송 방지
                }
            }

        } catch (Exception e) {
            // 예외 발생 시 상세 로그 출력
            System.err.println("Error while closing med account: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to close med account.");
        }
        // 2. 적금 계좌의 closed 상태를 'Y'로 변경
        medAccount.setClosed("Y");
        medAccountRepository.save(medAccount);
    }

    @Transactional
    public void withdrawMedAccount(Long medAccountId, BigDecimal amount, Long accountId) {
        // 1. 해당 적금 계좌 조회
        MedAccount medAccount = medAccountRepository.findById(medAccountId)
                .orElseThrow(() -> new RuntimeException("MedAccount not found."));

        // 2. withdraw 값이 0 이하인지 확인하여 인출 가능한지 체크
        if (medAccount.getWithdraw() <= 0) {
            throw new RuntimeException("Withdrawal limit reached.");
        }

        // 3. 금액이 적금 계좌의 잔액보다 큰지 확인
        if (medAccount.getMedAccountBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance in the med account.");
        }

        // 4. withdraw 값을 -1 감소 (인출 가능 횟수 감소)
        medAccount.setWithdraw(medAccount.getWithdraw() - 1);

        // 5. 적금 계좌의 잔액에서 인출한 금액을 차감
        medAccount.setMedAccountBalance(medAccount.getMedAccountBalance().subtract(amount));

        // closed 상태는 'N'으로 그대로 유지
        medAccountRepository.save(medAccount);

        // 6. 이체할 대상 Account 조회
        Account targetAccount = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found."));

        // 7. 금액을 Account로 이체
        targetAccount.setAccountBalance(targetAccount.getAccountBalance().add(amount));
        accountRepository.save(targetAccount);

        // 8. 이체 기록을 AccountRecords에 저장 (입금 기록)
        AccountRecord accountRecord = new AccountRecord();
        accountRecord.setAccountId(accountId);
        accountRecord.setTransactionDate(LocalDateTime.now());
        accountRecord.setAmount(amount);
        accountRecord.setDescription("Mid-term withdrawal from med account");
        accountRecordRepository.save(accountRecord);

        // 9. 적금 계좌 소유자(Member) 정보 조회 (여기서 MEMBER_ID가 있는지 가정)
        Member member = memberRepository.findByMemberId(medAccount.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member not found."));

        // 10. 메시지 전송 (메시지 내용은 원하는대로 수정 가능)
        String messageText = "[하나메디세이브] 중도 인출이 완료되어 보유하신 하나은행 계좌로 정상 이체되었습니다.";
        System.out.println(messageText);

        List<ParticipantAccount> participants = getParticipantsByMedAccountId(medAccountId);

        // 각 참여자에게 WebSocket 알림 전송
        Set<String> notifiedParticipants = new HashSet<>();

        for (ParticipantAccount participant : participants) {
//            System.out.println(participant.getMember().getMemberNm());
            if (!notifiedParticipants.contains(participant.getMember().getMemberId())) {
                String notification = "[하나메디세이브] " + medAccount.getMedAccountNm() + " 중도인출이 완료되었습니다.";
                System.out.println("Sending WebSocket notification to /sub/medAccount/withdraw" + participant.getMember().getMemberNm() + notification);
                messagingTemplate.convertAndSend("/sub/medAccount/closure", new WebSocketMessage(notification));
                notifiedParticipants.add(participant.getMember().getMemberId());  // 중복 전송 방지
            }
        }
//    smsUtil.sendSms(member.getMemberPhoneNb(), messageText);
    }

    public MedAccount updateRewardable(Long medAccountId) {
        // medAccountId로 계좌 정보를 찾음
        MedAccount medAccount = medAccountRepository.findById(medAccountId)
                .orElseThrow(() -> new RuntimeException("MedAccount not found with id: " + medAccountId));

        // rewardable 필드를 'N'으로 설정
        medAccount.setRewardable("N");

        // 변경된 정보를 저장
        medAccountRepository.save(medAccount);

        return medAccount;
    }
}
