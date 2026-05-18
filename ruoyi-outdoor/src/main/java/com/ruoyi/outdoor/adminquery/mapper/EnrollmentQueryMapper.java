package com.ruoyi.outdoor.adminquery.mapper;

import java.util.List;
import com.ruoyi.outdoor.adminquery.domain.EnrollmentView;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 报名只读查询 Mapper（本单元自有，直接查 reg_registration，不依赖 registration 包）
 *
 * @author ruoyi
 */
@Mapper
public interface EnrollmentQueryMapper
{
    /**
     * 按俱乐部查询报名列表（只读）
     *
     * @param clubId 俱乐部ID（租户ID）
     * @param status 状态（可空）
     * @return 报名列表
     */
    public List<EnrollmentView> selectEnrollments(@Param("clubId") Long clubId,
                                                  @Param("status") String status);

    /**
     * 查询单条报名（用于租户校验，只读）
     *
     * @param registrationId 报名ID
     * @return 报名
     */
    public EnrollmentView selectEnrollmentById(@Param("registrationId") Long registrationId);

    /**
     * 更新报名状态（仅 status 字段）
     *
     * @param registrationId 报名ID
     * @param clubId         俱乐部ID（租户隔离）
     * @param status         新状态
     * @return 结果
     */
    public int updateEnrollmentStatus(@Param("registrationId") Long registrationId,
                                      @Param("clubId") Long clubId,
                                      @Param("status") String status);
}
