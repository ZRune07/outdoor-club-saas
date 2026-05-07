package com.ruoyi.outdoor.club.mapper;

import java.util.List;
import com.ruoyi.outdoor.club.domain.Club;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 俱乐部Mapper接口
 * 
 * @author ruoyi
 */
@Mapper
public interface ClubMapper 
{
    /**
     * 查询俱乐部
     * 
     * @param clubId 俱乐部ID
     * @return 俱乐部
     */
    public Club selectClubById(@Param("clubId") Long clubId);

    /**
     * 根据俱乐部编码查询俱乐部
     * 
     * @param clubCode 俱乐部编码
     * @return 俱乐部
     */
    public Club selectClubByCode(@Param("clubCode") String clubCode);

    /**
     * 查询俱乐部列表
     * 
     * @param club 俱乐部
     * @return 俱乐部集合
     */
    public List<Club> selectClubList(Club club);

    /**
     * 新增俱乐部
     * 
     * @param club 俱乐部
     * @return 结果
     */
    public int insertClub(Club club);

    /**
     * 修改俱乐部
     * 
     * @param club 俱乐部
     * @return 结果
     */
    public int updateClub(Club club);

    /**
     * 删除俱乐部
     * 
     * @param clubId 俱乐部ID
     * @return 结果
     */
    public int deleteClubById(@Param("clubId") Long clubId);

    /**
     * 批量删除俱乐部
     * 
     * @param clubIds 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteClubByIds(@Param("clubIds") Long[] clubIds);
}
