package com.ruoyi.outdoor.tenantcategory.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.ruoyi.outdoor.tenantcategory.domain.Category;

/**
 * 活动分类Mapper接口
 *
 * @author ruoyi
 */
@Mapper
public interface CategoryMapper
{
    /**
     * 按俱乐部（租户）查询分类列表
     *
     * @param clubId 俱乐部ID（租户ID）
     * @return 分类集合
     */
    public List<Category> selectCategoryListByClubId(@Param("clubId") Long clubId);

    /**
     * 查询分类
     *
     * @param id 分类ID
     * @return 分类
     */
    public Category selectCategoryById(@Param("id") Long id);
}
