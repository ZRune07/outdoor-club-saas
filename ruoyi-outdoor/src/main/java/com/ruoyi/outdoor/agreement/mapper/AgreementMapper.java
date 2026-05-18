package com.ruoyi.outdoor.agreement.mapper;

import com.ruoyi.outdoor.agreement.domain.Agreement;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 电子签协议Mapper接口
 */
@Mapper
public interface AgreementMapper {

    /**
     * 根据ID查询协议
     */
    Agreement selectAgreementById(@Param("id") Long id);

    /**
     * 根据报名ID查询协议（限当前租户）
     */
    Agreement selectAgreementByEnrollmentId(@Param("clubId") Long clubId,
                                            @Param("enrollmentId") Long enrollmentId);

    /**
     * 查询协议列表
     */
    List<Agreement> selectAgreementList(Agreement agreement);

    /**
     * 新增协议
     */
    int insertAgreement(Agreement agreement);

    /**
     * 更新协议
     */
    int updateAgreement(Agreement agreement);

    /**
     * 软删除协议
     */
    int deleteAgreementById(@Param("id") Long id);
}
