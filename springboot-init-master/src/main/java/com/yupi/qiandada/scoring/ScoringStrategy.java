package com.yupi.qiandada.scoring;

import com.yupi.qiandada.model.entity.App;
import com.yupi.qiandada.model.entity.UserAnswer;

import java.util.List;

public interface ScoringStrategy {

    UserAnswer doScore(List<String> choices, App app);
}
