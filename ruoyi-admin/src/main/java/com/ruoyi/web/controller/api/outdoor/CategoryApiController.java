package com.ruoyi.web.controller.api.outdoor;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.ruoyi.common.annotation.Anonymous;
import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.framework.tenant.TenantContextHolder;
import com.ruoyi.outdoor.tenantcategory.domain.Category;
import com.ruoyi.outdoor.tenantcategory.service.ICategoryService;

/**
 * 活动分类 API（按当前租户过滤）
 *
 * @author ruoyi
 */
@RestController
@RequestMapping("/api/category")
public class CategoryApiController extends BaseController
{
    @Autowired
    private ICategoryService categoryService;

    /**
     * 查询当前租户的分类（默认返回树，tree=false 返回扁平列表）
     */
    @Anonymous
    @GetMapping("/list")
    public AjaxResult list(@RequestParam(value = "tree", required = false, defaultValue = "true") boolean tree)
    {
        Long tenantId = TenantContextHolder.getTenantId();
        List<Category> list = tree
                ? categoryService.selectCategoryTreeByClubId(tenantId)
                : categoryService.selectCategoryListByClubId(tenantId);
        return success(list);
    }
}
