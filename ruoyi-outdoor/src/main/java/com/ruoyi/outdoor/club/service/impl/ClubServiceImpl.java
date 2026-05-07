package com.ruoyi.outdoor.club.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.common.utils.SecurityUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.outdoor.club.mapper.ClubMapper;
import com.ruoyi.outdoor.club.domain.Club;
import com.ruoyi.outdoor.club.service.IClubService;

/**
 * 俱乐部 服务层实现
 * 
 * @author ruoyi
 */
@Service
public class ClubServiceImpl implements IClubService
{
    @Autowired
    private ClubMapper clubMapper;

    /**
     * 查询俱乐部信息
     * 
     * @param clubId 俱乐部ID
     * @return 俱乐部信息
     */
    @Override
    public Club selectClubById(Long clubId)
    {
        return clubMapper.selectClubById(clubId);
    }

    /**
     * 查询俱乐部列表
     * 
     * @param club 俱乐部信息
     * @return 俱乐部集合
     */
    @Override
    public List<Club> selectClubList(Club club)
    {
        return clubMapper.selectClubList(club);
    }

    /**
     * 新增俱乐部
     * 
     * @param club 俱乐部信息
     * @return 结果
     */
    @Override
    public int insertClub(Club club)
    {
        return clubMapper.insertClub(club);
    }

    /**
     * 修改俱乐部
     * 
     * @param club 俱乐部信息
     * @return 结果
     */
    @Override
    public int updateClub(Club club)
    {
        return clubMapper.updateClub(club);
    }

    /**
     * 批量删除俱乐部
     * 
     * @param clubIds 需要删除的俱乐部ID
     * @return 结果
     */
    @Override
    public int deleteClubByIds(Long[] clubIds)
    {
        return clubMapper.deleteClubByIds(clubIds);
    }

    /**
     * 删除俱乐部信息
     * 
     * @param clubId 俱乐部ID
     * @return 结果
     */
    @Override
    public int deleteClubById(Long clubId)
    {
        return clubMapper.deleteClubById(clubId);
    }
}
