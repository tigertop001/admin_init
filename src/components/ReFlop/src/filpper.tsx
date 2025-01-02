import "./filpper.css";
import propTypes from "@/utils/propTypes";
import { defineComponent, ref } from "vue";

const props = {
  frontText: propTypes.number.def(0),
  backText: propTypes.number.def(1),
  duration: propTypes.number.def(600)
};

export default defineComponent({
  name: "ReFlop",
  props,
  setup(props) {
    const { frontText, backText, duration } = props;
    const isFlipping = ref(false);
    const flipType = ref("down");
    const frontTextFromData = ref(frontText);
    const backTextFromData = ref(backText);

    const textClass = (number: number) => {
      return "number" + number;
    };

    const flip = (type: string, front: number, back: number) => {
      if (isFlipping.value) return false;
      frontTextFromData.value = front;
      backTextFromData.value = back;
      flipType.value = type;
      isFlipping.value = true;

      setTimeout(() => {
        isFlipping.value = false;
        frontTextFromData.value = back;
      }, duration);
    };

    const flipDown = (front: any, back: any): void => {
      flip("down", front, back);
    };

    const flipUp = (front: any, back: any): void => {
      flip("up", front, back);
    };

    function setFront(text: number): void {
      frontTextFromData.value = text;
    }

    const setBack = (text: number): void => {
      backTextFromData.value = text;
    };

    return {
      flipType,
      isFlipping,
      frontTextFromData,
      backTextFromData,
      textClass,
      flipDown,
      flipUp,
      setFront,
      setBack
    };
  },

  render() {
    const main = `m-flipper ${this.flipType} ${this.isFlipping ? "go" : ""}`;
    const front = `digital front ${this.textClass(this.frontTextFromData)}`;
    const back = `digital back ${this.textClass(this.backTextFromData)}`;
    return (
      <div class={main}>
        <div class={front} />
        <div class={back} />
      </div>
    );
  }
});
