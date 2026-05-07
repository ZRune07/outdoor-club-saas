package com.ruoyi.outdoor.club.service;

import java.util.List;
import com.ruoyi.outdoor.club.domain.Club;

public interface IClubService 
{
    public Club selectClubById(Long clubId);

    public List<Club> selectClubList(Club club);

    public int insertClub(Club club);

    public int updateClub(Club club);

    public int deleteClubByIds(Long[] clubIds);

    public int deleteClubById(Long clubId);
}
