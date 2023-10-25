package com.stg.b2b.order;


import com.stg.b2b.dashboard.dto.CountWDateDto;
import com.stg.b2b.dashboard.dto.GraphResponseDto;
import com.stg.b2b.dashboard.dto.OpenAndClosedOrdersDto;
import com.stg.b2b.dashboard.dto.OrdersTodayCount;

import com.stg.b2b.entity.*;
import com.stg.b2b.exception.NotFoundException;

import com.stg.b2b.order.dto.OrderResponseDto;
import com.stg.b2b.order.dto.UpdateOrderDto;
import com.stg.b2b.repository.*;
import com.stg.b2b.util.MailUtil;
import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    OrderRepository orderRepository;
    @Autowired
    private MasterRepository masterRepository;
    @Autowired
    EntityManager entityManager;
    @Autowired
    MailUtil mailUtil;
    @Autowired
    private ManagerRepository managerRepository;
    @Autowired
    private OrderFollowUpRepository orderFollowUpRepository;
    @Autowired
    private BusinessUnitRepository businessUnitRepository;

    /**
     * This method returns count of open and closed orders count
     *
     * @return OpenAndClosedOrdersDto
     */
    public OpenAndClosedOrdersDto getOpenAndClosedOrdersCount() {
        int openOrdersCount = orderRepository.countByOrdActiveStatus(true).orElseThrow(() -> new NotFoundException("Open Orders Count Not Fetched"));
        int closedOrdersCount = orderRepository.countByOrdActiveStatus(false).orElseThrow(() -> new NotFoundException("Closed Orders Count Not Fetched"));
        return new OpenAndClosedOrdersDto(openOrdersCount, closedOrdersCount);
    }
    /**
     * This method returns count of orders added today
     * @return
     */
    public OrdersTodayCount getCountOfTodayOrders() {
        Date sqlTodayDate = Date.valueOf(LocalDate.now());
        int ordersCountToday = orderRepository.countByOrdCreatedAt(String.valueOf(sqlTodayDate)).orElseThrow(() -> new NotFoundException("Today's Orders Count Data Not Fetched"));
        return new OrdersTodayCount(ordersCountToday);
    }
    public List<Integer> ordersWoPositions() throws NotFoundException {
        return orderRepository.ordersWOPositions().orElseThrow(() -> new NotFoundException("Data not found"));
    }

    public List<OrderResponseDto> getOrdersList(Boolean status){
        return orderRepository.getOrdersList(status);
    }
    public List<OrderResponseDto> getOrdersListBasedOnSourcing(List<Integer> orders){
        return orderRepository.getOrdersListBasedOnSourcingNotSourcing(orders);
    }

    public Master getMasterValue(String masterName) {
        return masterName != null ? masterRepository.findByMasterName(masterName).orElseThrow(() -> new NotFoundException("Order Type data not found with this ID: " + masterName)) : null;
    }
    public Master getMasterValueWithCategory(String masterCategory,String masterName) {
        return masterName != null ? masterRepository.findByMasterCategoryAndMasterName(masterCategory,masterName).orElseThrow(() -> new NotFoundException("Order Type data not found with this ID: " + masterName+" and this category :"+masterCategory)) : null;
    }

    public Manager getManagerValue(String ll6Manager) {
        return ll6Manager != null ? managerRepository.findByLl6Manager(ll6Manager).orElseThrow(() -> new NotFoundException("Manager data not found with this ID: " + ll6Manager)) : null;
    }

    public BusinessUnit getBusinessUnitValue(String buName, String productLineName) {
        return buName != null && productLineName != null ? businessUnitRepository.findByBuNameAndProductLineName(buName, productLineName).
                orElseThrow(() -> new NotFoundException("BusinessUnit data not found with this Bu ID" + buName + " and productLine Id " + productLineName)) : null;
    }

    public OrderResponseDto updateOrderDetails(UpdateOrderDto updateOrderDto, String username) throws NotFoundException {
        logger.info("updateOrderDetails() called {}", updateOrderDto.getOrderNo());
        try {
            Order order = updateOrderDto.getOrderNo() != null ? orderRepository.getOrder(updateOrderDto.getOrderNo(),updateOrderDto.getBroadcastDate()) : null;
            OrderFollowUp orderFollowUp = orderFollowUpRepository.getOrderFollowUp(order.getId().getOrderNo(), order.getId().getOrdBroadcastDate());
            if (order != null) {
                order.setOrdUpdatedBy(username);
                order.setOrdUpdatedAt(Date.valueOf(LocalDate.now()));
                order.setOrderType(updateOrderDto.getOrderType() != null ? getMasterValueWithCategory("order type",updateOrderDto.getOrderType()) : null);
                order.setRegion(updateOrderDto.getRegion() != null ? getMasterValueWithCategory("region",updateOrderDto.getRegion()) : null);
                order.setManager(updateOrderDto.getManager() != null ? getManagerValue(updateOrderDto.getManager()) : null);
                order.setOrdSkillGroup(updateOrderDto.getSkillGroup());
                order.setBusinessUnit(updateOrderDto.getBusinessUnit() != null ? getBusinessUnitValue(updateOrderDto.getBusinessUnit(), updateOrderDto.getProductLine()) : null);
                logger.info("order table updated");
                orderRepository.save(order);
                if(orderFollowUp != null){
                    orderFollowUp.setOrdfolDidCustomerReachedOut(updateOrderDto.getDidCustomerReachedOut());
                    orderFollowUp.setOrdfolProbability(updateOrderDto.getProbability());
                    orderFollowUp.setOrdfolRecruiter(updateOrderDto.getRecruiter());
                    orderFollowUp.setOrdfolSubmittedAboveTarget(updateOrderDto.getSubmittedAboveTarget());
                    orderFollowUp.setOrder(order);
                    orderFollowUpRepository.save(orderFollowUp);
                    logger.info("order follow up table updated");
                } else {
                    orderFollowUp = new OrderFollowUp();
                    orderFollowUp.setOrdfolDidCustomerReachedOut(updateOrderDto.getDidCustomerReachedOut());
                    orderFollowUp.setOrdfolProbability(updateOrderDto.getProbability());
                    orderFollowUp.setOrdfolRecruiter(updateOrderDto.getRecruiter());
                    orderFollowUp.setOrdfolSubmittedAboveTarget(updateOrderDto.getSubmittedAboveTarget());
                    orderFollowUp.setOrder(order);
                    orderFollowUpRepository.save(orderFollowUp);
                    logger.info("new order follow up table created");
                }
                logger.info(updateOrderDto.getMailId()+"@stgit.com");
                mailUtil.sendHtmlEmail(updateOrderDto.getMailId()+"@stgit.com",updateOrderDto.getOrderNo()+"",updateOrderDto.getRecruiter());
                return orderRepository.getOrderByPK(order.getId().getOrderNo(), order.getId().getOrdBroadcastDate());
            } else {
                throw new NotFoundException("Order not found");

            }
        } catch (NullPointerException e) {
            logger.error("NullPointerException occurred during order update: {}", e.getMessage());
        }
        return null;
    }

    public GraphResponseDto getOrdersCountWDates(String period, String toggle) {
        LocalDate today = LocalDate.now();
        LocalDate startDateLocal;
        LocalDate endDateLocal = null;
        List<CountWDateDto> countWDateDtos = new ArrayList<>();
        Date startDate = null;
        Date endDate = null;
        switch (period){
            case "1W":  // Current Week
                startDateLocal = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
                endDateLocal = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));
                startDate = Date.valueOf(startDateLocal);
                endDate = Date.valueOf(endDateLocal);
                countWDateDtos = "all".equals(toggle)?this.orderRepository.getOrderCountWDates(startDate,endDate):this.orderRepository.getOrderCountWDates(startDate,endDate,"open".equals(toggle)?true:false);
                break;
            case "1M":  // Current Month
                startDateLocal = today.with(TemporalAdjusters.firstDayOfMonth());
                endDateLocal = today.with(TemporalAdjusters.lastDayOfMonth());
                startDate = Date.valueOf(startDateLocal);
                endDate = Date.valueOf(endDateLocal);
                countWDateDtos = "all".equals(toggle)?this.orderRepository.getOrderCountWDates(startDate,endDate):this.orderRepository.getOrderCountWDates(startDate,endDate,"open".equals(toggle)?true:false);

                break;
            case "3M":  // Last 3 Months including current month
                startDateLocal = LocalDate.of(today.getYear(), 1, 1);  // First day of current year
                endDateLocal = LocalDate.of(today.getYear(), 12, 31);  // Last day of current year
                startDate = Date.valueOf(startDateLocal);
                endDate = Date.valueOf(endDateLocal);
                countWDateDtos = "all".equals(toggle) ?
                        this.orderRepository.getOrderCountWQuarter() :
                        this.orderRepository.getOrderCountWQuarter("open".equals(toggle));

                break;
            case "1Y":
                startDateLocal = LocalDate.of(today.getYear(), 1, 1);  // First day of current year
                endDateLocal = LocalDate.of(today.getYear(), 12, 31);  // Last day of current year
                startDate = Date.valueOf(startDateLocal);
                endDate = Date.valueOf(endDateLocal);
                countWDateDtos ="all".equals(toggle) ?
                        this.orderRepository.getOrderCountWDates() :
                        this.orderRepository.getOrderCountWDates("open".equals(toggle));
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
