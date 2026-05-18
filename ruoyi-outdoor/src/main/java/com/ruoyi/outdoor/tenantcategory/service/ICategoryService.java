package com.ruoyi.outdoor.tenantcategory.service;

import java.util.List;
import com.ruoyi.outdoor.tenantcategory.domain.Category;

/**
 * 活动分类Service接口
 *
 * @author ruoyi
 */
public interface ICategoryService
{
    /**
     * 按俱乐部（租户）查询分类扁平列表
     *
     * @param clubId 俱乐部ID（租户ID）
     * @return 分类集合
     */
    public List<Category> selectCategoryListByClubId(Long clubId);

    /**
     * 按俱乐部（租户）查询分类树
     *
     * @param clubId 俱乐部ID（租户ID）
     * @return 分类树
     */
    public List<Category> selectCategoryTreeByClubId(Long clubId);
}
