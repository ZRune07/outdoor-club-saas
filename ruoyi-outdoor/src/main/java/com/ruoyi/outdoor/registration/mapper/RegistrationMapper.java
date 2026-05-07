package com.ruoyi.outdoor.registration.mapper;

import java.util.List;
import com.ruoyi.outdoor.registration.domain.Registration;

/**
 * 报名Mapper接口
 * 
 * @author ruoyi
 */
public interface RegistrationMapper 
{
    /**
     * 查询报名
     * 
     * @param registrationId 报名主键
     * @return 报名
     */
    public Registration selectRegistrationByRegistrationId(Long registrationId);

    /**
     * 查询报名列表
     * 
     * @param registration 报名
     * @return 报名集合
     */
    public List<Registration> selectRegistrationList(Registration registration);

    /**
     * 新增报名
     * 
     * @param registration 报名
     * @return 结果
     */
    public int insertRegistration(Registration registration);

    /**
     * 修改报名
     * 
     * @param registration 报名
     * @return 结果
     */
    public int updateRegistration(Registration registration);

    /**
     * 删除报名
     * 
     * @param registrationId 报名主键
     * @return 结果
     */
    public int deleteRegistrationByRegistrationId(Long registrationId);

    /**
     * 批量删除报名
     * 
     * @param registrationIds 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteRegistrationByRegistrationIds(Long[] registrationIds);
}
