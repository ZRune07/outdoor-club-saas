package com.ruoyi.outdoor.tenantcategory.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ruoyi.outdoor.tenantcategory.domain.Category;
import com.ruoyi.outdoor.tenantcategory.mapper.CategoryMapper;
import com.ruoyi.outdoor.tenantcategory.service.ICategoryService;

/**
 * 活动分类 服务层实现
 *
 * @author ruoyi
 */
@Service
public class CategoryServiceImpl implements ICategoryService
{
    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public List<Category> selectCategoryListByClubId(Long clubId)
    {
        return categoryMapper.selectCategoryListByClubId(clubId);
    }

    @Override
    public List<Category> selectCategoryTreeByClubId(Long clubId)
    {
        List<Category> list = categoryMapper.selectCategoryListByClubId(clubId);
        return buildTree(list);
    }

    /**
     * 把扁平分类列表组装成树（parentId 为 null 或 0 视为根节点）
     */
    private List<Category> buildTree(List<Category> list)
    {
        Map<Long, Category> byId = new HashMap<>();
        for (Category node : list)
        {
            byId.put(node.getId(), node);
        }
        List<Category> roots = new ArrayList<>();
        for (Category node : list)
        {
            Long parentId = node.getParentId();
            Category parent = parentId == null ? null : byId.get(parentId);
            if (parent == null)
            {
                roots.add(node);
            }
            else
            {
                parent.getChildren().add(node);
            }
        }
        return roots;
    }
}
