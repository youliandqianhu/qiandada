import { View, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";
import Taro from "@tarojs/taro";
import "taro-ui/dist/style/components/button.scss"; // 按需引入
import question_result from "../../data/question_result.json"
import questions from "../../data/questions.json"
import "./index.scss";
import headerBg from "../../assets/beijing.jpg";
import GlobalFooter from "../../components/GlobalFooter";
import {getBestQuestionResult} from "../../utils/bizUtils";


export default () => {
  // 获取答案列表
  const currentAnswers = Taro.getStorageSync('currentAnswers')
  if (!currentAnswers || currentAnswers.length < 1){
    Taro.showToast({
      title: '答案列表为空',
      icon: 'error',
      duration: 3000
    })
  }
  // 调用我们封装的算法
  const result = getBestQuestionResult(currentAnswers,questions,question_result)
  // @ts-ignore
  return (
    <View className="resultPage">
      <View className="at-article__h1 title">{result.resultName}</View>
      <View className="at-article__h2 subTitle">{result.resultDesc}</View>
      <AtButton
        type="primary"
        className="enterBtn"
        circle
        onClick={() => {
          Taro.reLaunch({
            url: '/pages/index/index'
          });
        }}
      >
        返回主页
      </AtButton>
      <Image src={headerBg} />
      <GlobalFooter />
    </View>
  );
};
