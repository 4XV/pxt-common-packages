namespace jacdac {
    export class TouchButtonService extends SensorHost {
        private button: TouchButton;
        constructor(name: string, button: TouchButton) {
            super(name, jacdac.TOUCHBUTTON_DEVICE_CLASS);
            this.button = button;
            jacdac.BUTTON_EVENTS.forEach((ev, j) => {
                control.onEvent(this.button.id(), ev, () => {
                    this.raiseHostEvent(ev);
                })
            })
        }

        serializeState() {
            const buf = control.createBuffer(4);
            buf.setNumber(NumberFormat.UInt8LE, 0, this.button.isPressed() ? 0xff : 0);
            buf.setNumber(NumberFormat.UInt16LE, 1, this.button.value());
            return buf;
        }
    }

    export class TouchButtonsService extends SensorHost {
        private buttons: TouchButton[];
        constructor(name: string, buttons: TouchButton[]) {
            super(name, jacdac.TOUCH_BUTTONS_DEVICE_CLASS);
            this.buttons = buttons;
            this.buttons.forEach((t, i) => {
                jacdac.BUTTON_EVENTS.forEach((ev, j) => {
                    const k = DAL.ACCELEROMETER_EVT_SHAKE + 1
                        + i * jacdac.BUTTON_EVENTS.length + j;
                    t.onEvent(<ButtonEvent><number>ev, () => this.raiseHostEvent(k))
                })
            });
        }

        serializeState() {
            const buf = control.createBuffer(2 * this.buttons.length);
            for (let i = 0; i < this.buttons.length; ++i)
                buf.setNumber(NumberFormat.UInt16LE, i * 2, this.buttons[i].value());
            return buf;
        }
    }
}