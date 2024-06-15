import { View } from "@tarojs/components";
import { AtButton, AtRadio } from "taro-ui";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import "taro-ui/dist/style/components/button.scss";
import questions from "../../data/questions.json";
import "./index.scss";
import GlobalFooter from "../../components/GlobalFooter";


export default () => {
  // 当前题目序号
  const [current, setCurrent] = useState<number>(1);
  // 当前题目
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[0]);
  // 题目遍历
  const questionOptions = currentQuestion.options.map((option) => {
    return { label: `${option.key} ${option.value}`, value: option.key };
  });
  // 记录当前答案
  const [currentAnswer, setCurretnAnswer] = useState<string>();
  // 记录用户答题列表
  const [currentAnswers] = useState<string[]>([]);
  // 更改题目时触发
  useEffect(() => {
    // 获取当前题目
    setCurrentQuestion(questions[current - 1]);
    // 获取当前已选答案
    setCurretnAnswer(currentAnswers[current - 1]);
  }, [current]);
  return (
    <View className="doQuestionPage">
      <View className="at-article__h2 title">
        {current}、{currentQuestion.title}
      </View>
      <View className="options-wrapper">
        <AtRadio
          options={questionOptions}
          value={currentAnswer}
          onClick={(value) => {
            // 设置当前答案的值
            setCurretnAnswer(value);
            // 将当前答案记录到列表中
            currentAnswers[current - 1] = value;
          }}
        />
      </View>
      {current > 1 && (
        <AtButton
          size="normal"
          circle
          className="controlBtn"
          onClick={() => setCurrent(current - 1)}
        >
          上一题
        </AtButton>
      )}
      {current == questions.length && (
        <AtButton
          type="primary"
          size="normal"
          className="controlBtn"
          circle
          disabled={!currentAnswer}
          onClick={() => {
            // 数据缓存
            Taro.setStorage({
              key:"currentAnswers",
              data:currentAnswers
            })
            // 路由跳转
            Taro.navigateTo({
              url: '/pages/result/index',
            })
          }}
        >
          查看结果
        </AtButton>
      )}
      {current < questions.length && (
        <AtButton
          type="primary"
          size="normal"
          className="controlBtn"
          circle
          disabled={!currentAnswer}
          onClick={() => setCurrent(current + 1)}
        >
          下一题
        </AtButton>
      )}
      <GlobalFooter />
    </View>
  );
};
