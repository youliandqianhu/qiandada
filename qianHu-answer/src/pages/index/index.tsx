import { View, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";
import Taro from "@tarojs/taro";
import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "./index.scss";
import headerBg from "../../assets/beijing.jpg";
import GlobalFooter from "../../components/GlobalFooter";

export default () => {
  // @ts-ignore
  return (
    <View className="indexPage">
      <View className="at-article__h1 title">MBTI性格测试</View>
      <View className="at-article__h2 subTitle">
        只需2分钟,就能非常准确地描述出你是谁,以及你的性格特点
      </View>
      <AtButton
        type="primary"
        className="enterBtn"
        circle
        onClick={() => {
          Taro.navigateTo({
            url: '/pages/doQuestion/index',
          });
        }}
      >
        开始测试
      </AtButton>
      <Image src={headerBg} />
      <GlobalFooter />
    </View>
  );
};
