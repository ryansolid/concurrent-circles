import {
  createSignal,
  createMemo,
  startTransition,
  enableScheduling,
  batch
} from "solid-js";
import { render } from "solid-js/web";
import Repeat from "./Repeat";
enableScheduling();

let counter = 0;
function createBoxes(number) {
  const boxes = [];
  for (let i = 0; i < number; i++) {
    const [top, setTop] = createSignal(0),
      [left, setLeft] = createSignal(0),
      [color, setColor] = createSignal(null);
    boxes.push({
      top,
      left,
      color,
      setTop,
      setLeft,
      setColor
    });
  }
  return boxes;
}

function tick(box) {
  box.setTop(Math.sin(counter / 10) * 10);
  box.setLeft(Math.cos(counter / 10) * 10);
  box.setColor(counter % 255);
}

// Circle Component
function Circle(props) {
  const count = createMemo(() => {
    var e = performance.now() + 0.8;
    // ** Artificially long execution time.
    while (performance.now() < e) {}
    return props.count;
  }, props.count);

  return (
    <div class="box-view">
      <div
        class="box"
        style={{
          top: `${props.box.top()}px`,
          left: `${props.box.left()}px`,
          background: `rgb(0,0,${props.box.color()})`
        }}
      >
        {count() % 100}
      </div>
    </div>
  );
}

function App() {
  const [numOfBoxes, setNumOfBoxes] = createSignal(0);
  const [boxes, setBoxes] = createSignal([]);
  const [count, setCount] = createSignal(0);
  requestAnimationFrame(function loop() {
    counter++;
    requestAnimationFrame(loop);
    Promise.resolve().then(() => batch(() => boxes().forEach(tick)));
  });

  // ** Without Transition on count update
  // setInterval(() => setCount((c) => c + 1), 1000);
  setInterval(() => startTransition(() => setCount((c) => c + 1)), 1000);

  const create = (c) => {
    const prev = numOfBoxes();
    setBoxes(
      (b) => (prev < c ? b.push(...createBoxes(c - prev)) : (b.length = c), b)
    );
    setNumOfBoxes(c);
  };
  create(20);

  return (
    <>
      <select
        onInput={(e) => {
          const v = +e.currentTarget.value;

          // ** Without Transition on Box creation
          // create(v);
          startTransition(() => create(v));
        }}
      >
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="300">300</option>
      </select>
      <br />
      <Repeat count={numOfBoxes()}>
        {(index) => <Circle count={count()} box={/*@once*/ boxes()[index]} />}
      </Repeat>
    </>
  );
}

render(App, document.getElementById("app"));
