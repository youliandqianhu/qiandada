package com.yupi.qiandada.model.dto.question;

import lombok.Data;

@Data
public class QuestionAnswerDTO {
    /**
     * 题目
     */
    private String title;
    /**
     * 用户答案
     */
    private String usetAnswer;
}
