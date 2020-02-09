import React from "react";
import Enzyme, {shallow, mount} from "enzyme";
import WS from "jest-websocket-mock";
import Quiz from "../components/student/Quiz";
import Adapter from "enzyme-adapter-react-16"

Enzyme.configure({adapter: new Adapter()});

describe("Quiz component", () => {
  test("compotent renders", () => {
    const wrapper = shallow(<Quiz/>);

    expect(wrapper.exists()).toBe(true)
  })
})

/*
let container = null;

beforeEach(async () => {
  container = document.createElement("div");
  document.body.appendChild(container);
  sessionStorage.clear();
  sessionStorage.setItem.mockClear();
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  WS.clean()
});

it('should receive messages via socket', async () => {
  const server = new WS("ws://localhost:1234");
  const client = new WebSocket("ws://localhost:1234");
  await server.connected;

  client.send("hello")
  await expect(server).toReceiveMessage("hello");
  expect(server).toHaveReceivedMessages(["hello"]);
})

it('should receive message via socket and place it into sessionStorage', async () => {
  const server = new WS("ws://localhost:1234");
  const client = new WebSocket("ws://localhost:1234");
  await server.connected;
  const testData = {
    badge: "Hello"
  }
  
  client.send(testData)
  await expect(server).toReceiveMessage(testData);
  expect(server).toHaveReceivedMessages([testData])
  expect(sessionStorage.setItem).toHaveBeenCalledWith(testData);
})

it("renders questions", async () => {
  const fakeData = {
    question: [
        {id: 1,
        question: "I don't know?",
        correct_asnwer: "yep",
        wrong_answer: ["no", "now", "crying"],
        topics_id: 3,
        q_author: "Toni"}],
    result: [
        {question_ids: [2],
        title: "moro"}
    ]};

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeData)
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<Quiz badge="123552687" />, container);
  });


  expect(container.querySelector("h2").textContent).toBe(fakeData.result[0].title);
  expect(container.textContent).toContain(fakeData.question[0].question);

  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
});*/