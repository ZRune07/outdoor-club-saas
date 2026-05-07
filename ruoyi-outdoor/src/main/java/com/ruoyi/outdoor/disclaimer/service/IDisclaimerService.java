package com.ruoyi.outdoor.disclaimer.service;

import java.util.List;
import com.ruoyi.outdoor.disclaimer.domain.Disclaimer;

/**
 * 免责签署Service接口
 * 
 * @author ruoyi
 */
public interface IDisclaimerService 
{
    /**
     * 查询免责签署
     * 
     * @param disclaimerId 免责签署主键
     * @return 免责签署
     */
    public Disclaimer selectDisclaimerByDisclaimerId(Long disclaimerId);

    /**
     * 查询免责签署列表
     * 
     * @param disclaimer 免责签署
     * @return 免责签署集合
     */
    public List<Disclaimer> selectDisclaimerList(Disclaimer disclaimer);

    /**
     * 新增免责签署
     * 
     * @param disclaimer 免责签署
     * @return 结果
     */
    public int insertDisclaimer(Disclaimer disclaimer);

    /**
     * 修改免责签署
     * 
     * @param disclaimer 免责签署
     * @return 结果
     */
    public int updateDisclaimer(Disclaimer disclaimer);

    /**
     * 批量删除免责签署
     * 
     * @param disclaimerIds 需要删除的免责签署主键集合
     * @return 结果
     */
    public int deleteDisclaimerByDisclaimerIds(Long[] disclaimerIds);

    /**
     * 删除免责签署信息
     * 
     * @param disclaimerId 免责签署主键
     * @return 结果
     */
    public int deleteDisclaimerByDisclaimerId(Long disclaimerId);
}
