package com.ruoyi.outdoor.disclaimer.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.outdoor.disclaimer.mapper.DisclaimerMapper;
import com.ruoyi.outdoor.disclaimer.domain.Disclaimer;
import com.ruoyi.outdoor.disclaimer.service.IDisclaimerService;

/**
 * 免责签署Service业务层处理
 * 
 * @author ruoyi
 */
@Service
public class DisclaimerServiceImpl implements IDisclaimerService 
{
    @Autowired
    private DisclaimerMapper disclaimerMapper;

    /**
     * 查询免责签署
     * 
     * @param disclaimerId 免责签署主键
     * @return 免责签署
     */
    @Override
    public Disclaimer selectDisclaimerByDisclaimerId(Long disclaimerId)
    {
        return disclaimerMapper.selectDisclaimerByDisclaimerId(disclaimerId);
    }

    /**
     * 查询免责签署列表
     * 
     * @param disclaimer 免责签署
     * @return 免责签署
     */
    @Override
    public List<Disclaimer> selectDisclaimerList(Disclaimer disclaimer)
    {
        return disclaimerMapper.selectDisclaimerList(disclaimer);
    }

    /**
     * 新增免责签署
     * 
     * @param disclaimer 免责签署
     * @return 结果
     */
    @Override
    public int insertDisclaimer(Disclaimer disclaimer)
    {
        return disclaimerMapper.insertDisclaimer(disclaimer);
    }

    /**
     * 修改免责签署
     * 
     * @param disclaimer 免责签署
     * @return 结果
     */
    @Override
    public int updateDisclaimer(Disclaimer disclaimer)
    {
        return disclaimerMapper.updateDisclaimer(disclaimer);
    }

    /**
     * 批量删除免责签署
     * 
     * @param disclaimerIds 需要删除的免责签署主键
     * @return 结果
     */
    @Override
    public int deleteDisclaimerByDisclaimerIds(Long[] disclaimerIds)
    {
        return disclaimerMapper.deleteDisclaimerByDisclaimerIds(disclaimerIds);
    }

    /**
     * 删除免责签署信息
     * 
     * @param disclaimerId 免责签署主键
     * @return 结果
     */
    @Override
    public int deleteDisclaimerByDisclaimerId(Long disclaimerId)
    {
        return disclaimerMapper.deleteDisclaimerByDisclaimerId(disclaimerId);
    }
}
