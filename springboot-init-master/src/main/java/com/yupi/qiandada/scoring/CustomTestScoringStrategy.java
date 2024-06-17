package com.yupi.qiandada.scoring;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.yupi.qiandada.model.dto.question.QuestionContentDTO;
import com.yupi.qiandada.model.entity.App;
import com.yupi.qiandada.model.entity.Question;
import com.yupi.qiandada.model.entity.ScoringResult;
import com.yupi.qiandada.model.entity.UserAnswer;
import com.yupi.qiandada.model.vo.QuestionVO;
import com.yupi.qiandada.service.QuestionService;
import com.yupi.qiandada.service.ScoringResultService;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ScoringStrategyConfig(appType = 1,scoringStrategy = 0)
public class CustomTestScoringStrategy implements ScoringStrategy{

    @Resource
    private QuestionService questionService;

    @Resource
    private ScoringResultService scoringResultService;

    @Override
    public UserAnswer doScore(List<String> choices, App app) {
        // 1. 根据id查询到题目和题目结果信息
        Question question = questionService.getOne(
                Wrappers.lambdaQuery(Question.class).eq(Question::getAppId, app.getId())
        );
        List<ScoringResult> scoringResultList = scoringResultService.list(
                Wrappers.lambdaQuery(ScoringResult.class).eq(ScoringResult::getAppId, app.getId())
        );
        // 2. 统计用户每个选择对应的属性个数,如I = 10个,E = 5个
        // 初始化一个Map,用于存储每个选项计数
        Map<String, Integer> optionCount = new HashMap<>();

        // 获取题目的选项列表(先转换成VO类型，因为转换成VO方便拿值，有内部类的封装)
        QuestionVO questionVO = QuestionVO.objToVo(question);
        List<QuestionContentDTO> questionContent = questionVO.getQuestionContent();

        // 遍历题目列表
        for (QuestionContentDTO questionContentDTO : questionContent) {
            // 遍历答案列表
            for (String answer : choices) {
                // 遍历题目中的选项
                for (QuestionContentDTO.Option option : questionContentDTO.getOptions()) {
                    if (option.getKey().equals(answer)) {
                        // 获取选项的属性
                        String result = option.getResult();
                        // 如果Map中没有这个属性，则初始化为0
                        if (!optionCount.containsKey(result)) {
                            optionCount.put(result, 0);
                        }
                        // 计数加1
                        optionCount.put(result, optionCount.get(result) + 1);
                    }
                }
            }
        }
        // 3. 遍历每种评分结果，计算哪个结果的得分更高
        int maxScore = 0;
        ScoringResult maxScoreResult = scoringResultList.get(0);
        // 遍历评分结果列表(这里的scoringResult就表示物流师(ISTJ)、守护者(ISFJ)等)
        for (ScoringResult scoringResult : scoringResultList) {
            // 将评分规则转换成集合
            List<String> resultProp = JSONUtil.toList(scoringResult.getResultProp(), String.class);
            // 计算得分(其中prop则为对应的属性:I,E等,getOrDefault表示如果没有找到对应的值默认为0)
            // 例如物流师为ISTJ，则会去寻找ISTJ这4种属性的分数,最后sum则将这4属性的分数加起来，然后拿他进行比较
            int score = resultProp.stream()
                    .mapToInt(prop -> optionCount.getOrDefault(prop, 0))
                    .sum();

            if (score > maxScore) {
                maxScore = score;
                maxScoreResult = scoringResult;
            }
        }
        // 4. 构造返回值,填充答案对象的属性
        UserAnswer userAnswer = new UserAnswer();
        userAnswer.setAppId(app.getId());
        userAnswer.setAppType(app.getAppType());
        userAnswer.setScoringStrategy(app.getScoringStrategy());
        userAnswer.setChoices(JSONUtil.toJsonStr(choices));
        userAnswer.setResultId(maxScoreResult.getId());
        userAnswer.setResultName(maxScoreResult.getResultName());
        userAnswer.setResultDesc(maxScoreResult.getResultDesc());
        userAnswer.setResultPicture(maxScoreResult.getResultPicture());

        return userAnswer;
    }
}
