package com.ruoyi.outdoor.registration.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.outdoor.registration.mapper.RegistrationMapper;
import com.ruoyi.outdoor.registration.domain.Registration;
import com.ruoyi.outdoor.registration.service.IRegistrationService;

/**
 * 报名Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class RegistrationServiceImpl implements IRegistrationService 
{
    @Autowired
    private RegistrationMapper registrationMapper;

    /**
     * 查询报名
     * 
     * @param registrationId 报名主键
     * @return 报名
     */
    @Override
    public Registration selectRegistrationByRegistrationId(Long registrationId)
    {
        return registrationMapper.selectRegistrationByRegistrationId(registrationId);
    }

    /**
     * 查询报名列表
     * 
     * @param registration 报名
     * @return 报名
     */
    @Override
    public List<Registration> selectRegistrationList(Registration registration)
    {
        return registrationMapper.selectRegistrationList(registration);
    }

    /**
     * 新增报名
     * 
     * @param registration 报名
     * @return 结果
     */
    @Override
    public int insertRegistration(Registration registration)
    {
        return registrationMapper.insertRegistration(registration);
    }

    /**
     * 修改报名
     * 
     * @param registration 报名
     * @return 结果
     */
    @Override
    public int updateRegistration(Registration registration)
    {
        return registrationMapper.updateRegistration(registration);
    }

    /**
     * 批量删除报名
     * 
     * @param registrationIds 需要删除的报名主键
     * @return 结果
     */
    @Override
    public int deleteRegistrationByRegistrationIds(Long[] registrationIds)
    {
        return registrationMapper.deleteRegistrationByRegistrationIds(registrationIds);
    }

    /**
     * 删除报名信息
     * 
     * @param registrationId 报名主键
     * @return 结果
     */
    @Override
    public int deleteRegistrationByRegistrationId(Long registrationId)
    {
        return registrationMapper.deleteRegistrationByRegistrationId(registrationId);
    }
}
