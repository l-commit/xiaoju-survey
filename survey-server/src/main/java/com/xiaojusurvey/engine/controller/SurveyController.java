package com.xiaojusurvey.engine.controller;

import com.xiaojusurvey.engine.common.entity.User;
import com.xiaojusurvey.engine.common.entity.survey.Survey;
import com.xiaojusurvey.engine.common.rpc.IdResult;
import com.xiaojusurvey.engine.common.rpc.RpcResult;
import com.xiaojusurvey.engine.common.util.RpcResultUtil;
import com.xiaojusurvey.engine.core.survey.SurveyService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import java.util.List;

/**
 * @Author: LYF
 * @CreateTime: 2024-06-05
 * @Description: 问卷Controller
 */
@RequestMapping("/api/survey")
@RestController
public class SurveyController {
    @Resource
    private SurveyService surveyService;

    /**
     * 创建问卷
     */
    @RequestMapping("/createSurvey")
    public RpcResult<IdResult<String>> createSurvey(@Validated @RequestBody Survey survey) {
        return RpcResultUtil.createSuccessIdResult(surveyService.createSurvey(survey));
    }
}
