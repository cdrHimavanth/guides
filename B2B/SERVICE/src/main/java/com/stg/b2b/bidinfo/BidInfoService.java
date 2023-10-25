package com.stg.b2b.bidinfo;

import com.stg.b2b.bidinfo.dto.BidInfoResponse;
import com.stg.b2b.bidinfo.dto.InterviewRequestDto;
import com.stg.b2b.bidinfo.dto.InterviewResponse;
import com.stg.b2b.dashboard.dto.BidInfoSummaryDTO;
import com.stg.b2b.dashboard.dto.BidsByReceivedDateMapper;
import com.stg.b2b.bidinfo.dto.BidInfoDto;
import com.stg.b2b.dashboard.dto.CountWDateDto;
import com.stg.b2b.dashboard.dto.GraphResponseDto;
import com.stg.b2b.entity.BidInfo;
import com.stg.b2b.exception.BadRequestException;
import com.stg.b2b.exception.NotFoundException;
import com.stg.b2b.repository.BidInfoRepository;
import com.stg.b2b.repository.InterviewRepository;
import com.stg.b2b.util.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class BidInfoService{
    private static final Logger logger = LoggerFactory.getLogger(BidInfoService.class);

    @Autowired
    private BidInfoRepository bidInfoRepository;

    public List<BidInfoResponse> getBidInfo(Boolean activeStatus) {
        logger.info("getBidInfo() is called in BidInfoServiceImpl.");
        return this.bidInfoRepository.getAllBids(activeStatus);

    }

    public BidInfoDto updateBidInfo(BidInfoDto bidInfoDto, String userName) {

        logger.info("updateBidInfo() is called in BidInfoTblServiceImpl");
        BidInfo bidInfo = this.bidInfoRepository.findByBidNo( bidInfoDto.getBidNo());
        if(bidInfo == null){
            throw new NotFoundException("Bid Number : " + bidInfoDto.getBidNo() + " not found.");
        }
        bidInfo.setBidOverTarget(bidInfoDto.getBidOverTarget());
        if(bidInfoDto.getBidPoNumber() != null && !bidInfoDto.getBidPoNumber().equals("")){
            bidInfo.setBidPoNumber(bidInfoDto.getBidPoNumber());
            bidInfo.setBidStatus("Shortlisted");
        }
        bidInfo.setBidExternalOrInternal(bidInfoDto.getBidExternalOrInternal());
        bidInfo.setBidSkillSet(bidInfoDto.getBidSkillSet());
        bidInfo.setBidUpdatedBy(userName);
        bidInfo.setBidUpdatedAt(Date.valueOf(LocalDate.now()));

        try {
            BidInfo updatedBidInfo = this.bidInfoRepository.save(bidInfo);
            BidInfoDto responseDto = new BidInfoDto();
            responseDto.setBidName(updatedBidInfo.getBidName());
            responseDto.setOrdBroadcastDate(updatedBidInfo.getOrder().getId().getOrdBroadcastDate());
            responseDto.setOrderNo(updatedBidInfo.getOrder().getId().getOrderNo());
            BeanUtils.copyProperties(updatedBidInfo, responseDto);
            logger.info("updateBidInfo() is completed  and BidInfoTbl details updated for  BidNumber: {} and returned updatedBidInfo.", updatedBidInfo.getBidNo());
            return responseDto;
        }catch (Exception exception){
            throw  new BadRequestException("Update failed for Bid number: " + bidInfoDto.getBidNo());
        }
    }

    public BidInfoSummaryDTO getActiveBidInfoSummary() {

        logger.debug("Entered Inside  BidInfoTblServiceImpl getBidInfoSummary() Method");


        List<BidsByReceivedDateMapper> bidInfos = bidInfoRepository.getBidsByReceivedDate(true).orElseThrow(()-> new NotFoundException("Bids  Data Not Fetched"));

        AtomicInteger today = new AtomicInteger();
        AtomicInteger thisWeek = new AtomicInteger();
        AtomicInteger thisMonth = new AtomicInteger();
        AtomicInteger previousMonth = new AtomicInteger();

        String todatDateString = String.valueOf(LocalDate.now());
        int currentMonth = DateUtils.currentMonthNumber();
        int currentWeek = DateUtils.getWeekNumber(LocalDate.now());

        bidInfos.forEach(eachBid->{
            String eachDate = String.valueOf(eachBid.getBidReceivedDate()); //Converts Each Bid Date to string

            LocalDate eachLocalDate = LocalDate.parse(eachDate); //Converts String Date to LocalDate


            int eachDateWeekOfYear = DateUtils.getWeekNumber(eachLocalDate);

            int eachWeekDay = DateUtils.getWeekDayNumber(eachLocalDate);

            if(todatDateString.equals(eachDate)){
                today.addAndGet(eachBid.getBidsCount());
            }
            if(eachLocalDate.getMonthValue() == currentMonth){
                thisMonth.addAndGet(eachBid.getBidsCount());
            }
            if((eachLocalDate.getMonthValue()) == (currentMonth - 1 )){
                previousMonth.addAndGet(eachBid.getBidsCount());
            }
            if(currentWeek == eachDateWeekOfYear && (eachWeekDay >= 1 && eachWeekDay <=6)){
                thisWeek.addAndGet(eachBid.getBidsCount());
            }

        });

        logger.debug("Exited From BidInfoTblServiceImpl getBidInfoSummary() Method");
        return new BidInfoSummaryDTO(today.intValue(), thisWeek.intValue(), thisMonth.intValue(),  previousMonth.intValue());

    }


    public BidInfoSummaryDTO getClosedBidInfoSummary() {

        logger.debug("Entered Inside  BidInfoTblServiceImpl getBidInfoSummary() Method");


        List<BidsByReceivedDateMapper> bidInfos = bidInfoRepository.getBidsByReceivedDate(false).orElseThrow(()-> new NotFoundException("Bids  Data Not Fetched"));

        AtomicInteger today = new AtomicInteger();
        AtomicInteger thisWeek = new AtomicInteger();
        AtomicInteger thisMonth = new AtomicInteger();
        AtomicInteger previousMonth = new AtomicInteger();

        String todatDateString = String.valueOf(LocalDate.now());
        int currentMonth = DateUtils.currentMonthNumber();
        int currentWeek = DateUtils.getWeekNumber(LocalDate.now());

        bidInfos.forEach(eachBid->{
            String eachDate = String.valueOf(eachBid.getBidReceivedDate()); //Converts Each Bid Date to string

            LocalDate eachLocalDate = LocalDate.parse(eachDate); //Converts String Date to LocalDate


            int eachDateWeekOfYear = DateUtils.getWeekNumber(eachLocalDate);

            int eachWeekDay = DateUtils.getWeekDayNumber(eachLocalDate);

            if(todatDateString.equals(eachDate)){
                today.addAndGet(eachBid.getBidsCount());
            }
            if(eachLocalDate.getMonthValue() == currentMonth){
                thisMonth.addAndGet(eachBid.getBidsCount());
            }
            if((eachLocalDate.getMonthValue()) == (currentMonth - 1 )){
                previousMonth.addAndGet(eachBid.getBidsCount());
            }
            if(currentWeek == eachDateWeekOfYear && (eachWeekDay >= 1 && eachWeekDay <=6)){
                thisWeek.addAndGet(eachBid.getBidsCount());
            }

        });

        logger.debug("Exited From BidInfoTblServiceImpl getBidInfoSummary() Method");
        return new BidInfoSummaryDTO(today.intValue(), thisWeek.intValue(), thisMonth.intValue(),  previousMonth.intValue());

    }


    public GraphResponseDto getBidsCountWDates(String period, String toggle) {
        LocalDate today = LocalDate.now();
        LocalDate startDateLocal;
        LocalDate endDateLocal = null;
        List<CountWDateDto> countWDateDtos = new ArrayList<>();
        Date startDate = null;
        Date endDate = null;
        switch (period){
            case "1W":
                startDateLocal = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
                endDateLocal = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
                startDate = Date.valueOf(startDateLocal);
                endDate = Date.valueOf(endDateLocal);
                countWDateDtos ="all".equals(toggle)?this.bidInfoRepository.getBidsCountWDate(startDate,endDate):this.bidInfoRepository.getBidsCountWDate(startDate,endDate,"open".equals(toggle)?true:false);
                break;
            case "1M":
                startDateLocal = today.with(TemporalAdjusters.firstDayOfMonth());
                endDateLocal = today.with(TemporalAdjusters.lastDayOfMonth());
                startDate = Date.valueOf(startDateLocal);
                endDate = Date.valueOf(endDateLocal);
                countWDateDtos ="all".equals(toggle)?this.bidInfoRepository.getBidsCountWDate(startDate,endDate):this.bidInfoRepository.getBidsCountWDate(startDate,endDate,"open".equals(toggle)?true:false);
                break;
            case "3M":
                startDateLocal = LocalDate.of(today.getYear(), 1, 1);  // First day of current year
                endDateLocal = LocalDate.of(today.getYear(), 12, 31);  // Last day of current year
                startDate = Date.valueOf(startDateLocal);
                endDate = Date.valueOf(endDateLocal);
                countWDateDtos ="all".equals(toggle)?this.bidInfoRepository.getBidsCountWQuarter():this.bidInfoRepository.getBidsCountWQuarter("open".equals(toggle)?true:false);

                break;
            case "1Y":
                startDateLocal = LocalDate.of(today.getYear(), 1, 1);  // First day of current year
                endDateLocal = LocalDate.of(today.getYear(), 12, 31);  // Last day of current year
                startDate = Date.valueOf(startDateLocal);
                endDate = Date.valueOf(endDateLocal);
                countWDateDtos ="all".equals(toggle)?this.bidInfoRepository.getBidsCountWMonth():this.bidInfoRepository.getBidsCountWMonth("open".equals(toggle)?true:false);

                break;
            default:
                throw new NotFoundException("The option you chose("+period+") is invalid!");
        }

        GraphResponseDto graphResponseDto = new GraphResponseDto();
        graphResponseDto.setStartDate(startDate);
        graphResponseDto.setLastDate(endDate);
        graphResponseDto.setData(countWDateDtos);

        return graphResponseDto;
    }
}

