import { HomeAssistant } from "../ha-types";
import { html, css, LitElement, CSSResultGroup, TemplateResult } from "lit";
import { property } from "lit/decorators";
import { IWhirlpoolForecastConfig } from "../types";
import styles from "./card.css";

/**
 * Main card class definition
 */
export class WhirlpoolForecastCustomCard extends LitElement {

    @property({ attribute: false })
    private cardTitle: string = "Whirlpool Forecast";

    @property({ attribute: false })
    private state: any = "";

    private _hass: any;

    private entity: string = "";

    @property({ attribute: false })
    private  perHour = 0;
    
    @property({ attribute: false })
    private  desired_temperature = 34;

    @property({ attribute: false })
    private  desired_hours = 0;

    /**
     * CSS for the card
     */
    static get styles(): CSSResultGroup {
        return css(<TemplateStringsArray><any>[styles]);
    }

    /**
     * Called on every hass update
     */
    set hass(hass: HomeAssistant) {
        if (!this.entity || !hass.states[this.entity]) {
            return;
        }
        this._hass = hass;
        this.state = hass.states[this.entity].state;
        this.getData();
    }

    /**
     * Called every time when entity config is updated
     * @param config Card configuration (yaml converted to JSON)
     */
    setConfig(config: IWhirlpoolForecastConfig): void {
        this.entity = config.entity;
        this.cardTitle = config.title || "Whirlpool Forecast";
    }

    getData() {
        var lastHour = new Date();
        lastHour.setTime(lastHour.getTime() + (-2 * 60 * 60 * 1000));
        const history = this._hass.callApi('GET', `history/period/${encodeURIComponent(lastHour.toISOString())}?filter_entity_id=${encodeURIComponent(this.entity)}`);
        
        // Process the retrieved data
        history.then((data : any) => {
        var lastUpdate = data[0][0].last_updated
        var lastUpdateState = data[0][0].state
        var oldestUpdate : any = data[0][data[0].length - 1].last_updated
        var oldestUpdateState : any = data[0][data[0].length - 1].state
        var timediff : any= (((new Date(oldestUpdate).getTime() - new Date(lastUpdate).getTime()) / 1000) / 60)
        var perMinute = (lastUpdateState - oldestUpdateState) / timediff;

        this.perHour = Math.floor(perMinute * 60);
        this.desired_hours = Math.floor(((this.desired_temperature - this.state) / perMinute) / 60);
        });
    }

    /**
     * Renders the card when the update is requested (when any of the properties are changed)
     */
    render(): TemplateResult {
        return html`
        <ha-card>
            <div class="card-header">
                <div class="truncate">
                    ${this.cardTitle}
                </div>
            </div>
            <div class="card-content">
                <div>
                <div class="main">
                    <div class="inner-main-icon">
                        <ha-icon icon="mdi:hot-tub"></ha-icon>
                    </div>
                    <div class="inner-main">
                        <span class="child-main">
                            <ha-icon icon="mdi:bullseye-arrow"></ha-icon> ${this.desired_temperature}°C<br />
                            <ha-icon icon="mdi:water-thermometer-outline"></ha-icon> <span id="c1">${this.state}°C</span>
                        </span>
                        <span class="child-main">
                            <ha-icon icon="mdi:clock-alert-outline"></ha-icon> <span id="c2">${this.desired_hours}</span>
                        </span>
                        <span class="child-main">
                            <ha-icon icon="mdi:thermometer-chevron-up"></ha-icon> <span id="c3">${this.perHour}</span>°C/h
                        </span>
                    </div>
                </div>
                </div>
            </div>
        </ha-card>
        `;
    }
}