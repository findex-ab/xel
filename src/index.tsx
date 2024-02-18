import { X, XElement, XFunction, XFunctional, XRenderable, XRenderableFactor, isXElement, isXFunction, mount, xRender } from "./xel";
import { isFunction, isHTMLElement, isNotNullish, isNumber, isString } from "./xel/utils/is";

const toArray = <T = any>(x: T) => Array.isArray(x) ? x : [x];

const jsx = (tag: XRenderable | Function, attributes: { [key: string]: any } | null, ...children: any[]):any => {
  children = toArray<Node>((children || []) as any).filter(isNotNullish);
  attributes = {...(attributes || {}), children: children as Element[]};

  if (isXFunction(tag)) {
    return X('div', {
      ...attributes,
      render: tag
    }) 
  }
  
  if (!isString(tag)) {
    return X('div', {
      ...attributes,
    });
  }

  return X(tag, {
    ...attributes
  });

}

const Button = X("button", {
  cname: 'Button',
  style: {

  },
  stylesheet: {
    display: "block",
    background: "none",
    outline: "none",
    backgroundColor: "#55AAEE",
    border: "none",
    margin: "0px",
    boxSizing: "border-box",
    padding: "0.5rem 1rem",
    color: "white",
    cursor: "pointer",
    ':hover': {
      backgroundColor: "#66BBFF",
    }
  }
});

const Section = X("section", {
  cname: 'Section',
  style: {
    paddingBottom: "1rem",
    borderTopStyle: "solid",
    borderTopWidth: "1px",
    borderTopColor: "gray",
    boxSizing: "border-box",
  },
  stylesheet: {
    '&+&': {
      paddingTop: "1rem",
    }
  }
});

const Canvas: XFunctional<{
  updateFunc: (time: number, dt: number, ctx: CanvasRenderingContext2D) => void;
  width: number;
  height: number;
}> = (props): XElement => {
  return X<Partial<HTMLCanvasElement>>("canvas", {
    width: props.width,
    height: props.height,
    onMount: (x) => {
      const ctx = (x.el as HTMLCanvasElement).getContext("2d");
      let prevTime: number = -1;
      let dt = 0.0;
      const loop = (time: number): number => {
        dt = (time - prevTime) / 1000.0;
        prevTime = time;
        if (!ctx) { throw new Error('no ctx'); }
        props.updateFunc(time, dt, ctx);
        return requestAnimationFrame(loop);
      };
      loop(0);
    },
  });
};

const Counter = X<{ title: string }, { counter: number }>("div", {
  title: "Default title",
  initialState: {
    counter: 0,
  },
  render(cfg, state) {
    return X("div", {
      children: [
        X("div", [
          X("h1", { innerText: cfg.title }),
          Button.call({
            innerText: "Click me",
            onclick: () => (state.counter += 1),
          }),
          X("p", { innerText: `You clicked ${state.counter} times` }),
        ]),
      ],
    });
  },
});

const App = X<{}, { canvasVisible: boolean }>("div", {
  style: {
    fontFamily: "Sans-Serif",
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  initialState: {
    canvasVisible: false,
  },
  render(cfg, state) {

    const Slider = X<{}, { value: number }>("div", {
      initialState: {
        value: 0
      },
      render(props, state) {
        //const pEl = xRef<XElement | undefined>(undefined, (xel) => {
        //  if (!xel) return;
        //  if (!xel.el) return;
        //});
        
        return () => X("div", {
          children: [
            X("p", {
              innerText: `${state.value}`,
         //     ref: pEl
            }),
            X("input", {
              type: "range",
              value: props.value,
              min: 4,
              max: 500,
              oninput: (event: InputEvent & { target: { value: string } }) => {
                const value = parseFloat(event.target.value);
                state.value = Math.round(value);
                //if (pEl.value && pEl.value.el) {
                //  const ee =pEl.value.el as HTMLElement;
                //  ee.innerText = `${state.value}`;
                //}
              },
            }),
          ],
        });
      },
    });

    const showCanvas = () => {
      state.canvasVisible = !state.canvasVisible;
    };
    return X("div", [
      X("div", {
        style: {
          width: '50vw',
          minHeight: '50vh'
        },
        children: [
          Section.call({
            children: [
              Counter.call({ title: "A counter" }),
              Button.call({
                innerText: state.canvasVisible ? "Hide canvas" : "Show canvas",
                onclick: showCanvas,
              }),
              Slider
            ],
          }),
          state.canvasVisible
            ? Section.call({
              children: [
                Canvas({
                  width: 640,
                  height: 480,
                  updateFunc: (time, dt, ctx) => {
                    const { width: w, height: h } = ctx.canvas;
                    const x = Math.cos(time * 0.0025) * (w / 3);
                    const y = Math.sin(time * 0.0025) * (h / 3);

                    ctx.save();
                    ctx.fillStyle = "rgb(48,48,48)";
                    ctx.fillRect(0, 0, w, h);
                    ctx.restore();

                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(w / 2 + x, h / 2 + y, 50, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fillStyle = "red";
                    ctx.fill();
                    ctx.restore();
                  },
                }),
              ],
            })
            : X("div", {}),
        ],
      }),
    ]);
  },
});


const Message = (props: { value: string, counter: number }, state: { counter: number }) => {

  const handleClick = () => {
    state.counter = (state.counter || 0) + 1;
  }
  
  return <div counter={0}>
    <button  onclick={handleClick}>press</button>
    <p>{props.value}</p>
    <span>{state.counter || props.counter}</span>
  </div>;
}

const JSXApp = () => {
  return <div>
    <Message value="hello" counter={0} />
  </div>;
}

console.log(JSXApp());
console.log(mount(App, { target: document.getElementById("app") }));
