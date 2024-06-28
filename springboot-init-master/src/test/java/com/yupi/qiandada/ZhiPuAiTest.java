package com.yupi.qiandada;

import com.yupi.qiandada.manager.AiManager;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

@SpringBootTest
public class ZhiPuAiTest {

    @Resource
    private AiManager aiManager;

    @Test
    void test(){
        String s = aiManager.doRequest();
        System.out.println(s);
    }
}
