import { WhirlpoolForecastCustomCard } from "./custom-element/whirlpool-forecast-custom-card";
import { printVersion } from "./utils";

// Registering card
customElements.define("whirlpool-forecast-custom-card", WhirlpoolForecastCustomCard);
const w : any = window;
w.customCards = w.customCards || [],
w.customCards.push({
    type: "whirlpool-forecast-custom-card",
    name: "whirlpool-forecast-custom-card",
    preview: false
});
printVersion();