import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';

const DATA = [
    { id: "todo-0", name: "Eat", completed: true },
    { id: "todo-1", name: "Sleep", completed: false },
    { id: "todo-2", name: "Repeat", completed: false }
  ];

test('Test page title', () => {
  const { getByText } = render(<App tasks={DATA}/>);
  const linkElement = getByText(/What needs to be done?/i);
  expect(linkElement).toBeInTheDocument();
});

test('Test All tab presence', () => {
    const { getByTestId, getByText, getByLabelText } = render(<App tasks={DATA}/>);
    const linkElement = getByTestId(/^All$/i);
    expect(linkElement).toBeInTheDocument();
    expect(getByText("3 tasks remaining")).toBeInTheDocument();
    expect(getByLabelText("Eat")).toBeChecked();
    expect(getByLabelText("Sleep")).not.toBeChecked();
    expect(getByLabelText("Repeat")).not.toBeChecked();
});

test('Test Active tab presence', () => {
    const { getByTestId, getByText } = render(<App tasks={DATA}/>);
    const linkElement = getByTestId(/^Active$/i);
    expect(linkElement).toBeInTheDocument();
    userEvent.click(linkElement);
    expect(getByText("2 tasks remaining")).toBeInTheDocument();
});

test('Test Completed tab presence', () => {
    const { getByTestId, getByText } = render(<App tasks={DATA}/>);
    const linkElement = getByTestId(/^Completed$/i);
    expect(linkElement).toBeInTheDocument();
    userEvent.click(linkElement);
    expect(getByText("1 task remaining")).toBeInTheDocument();
});

test('Add a new task', () => {
    const { getByTestId, getByText, getByLabelText } = render(<App tasks={DATA}/>);
    const linkElement = getByLabelText(/What needs to be done?/i);
    expect(linkElement).toBeInTheDocument();
    userEvent.type(linkElement, "Exercise");
    userEvent.click(getByTestId("add_task_button"));
    expect(getByText("4 tasks remaining")).toBeInTheDocument();
    expect(getByLabelText("Exercise")).not.toBeChecked();
});

test('Test Task Status Change', () => {
    const { getByTestId, getByText, getByLabelText } = render(<App tasks={DATA}/>);
    const linkElement = getByTestId(/^All$/i);
    expect(linkElement).toBeInTheDocument();
    expect(getByLabelText("Eat")).toBeChecked();
    userEvent.click(getByLabelText("Eat"));
    expect(getByLabelText("Eat")).not.toBeChecked();
});

test('Test Delete', () => {
    const { getByTestId, getByText, getByLabelText } = render(<App tasks={DATA}/>);
    const linkElement = getByTestId(/^All$/i);
    expect(linkElement).toBeInTheDocument();
    const delNode = getByLabelText("Eat");
    expect(delNode).toBeInTheDocument();
    const delEl = getByTestId("Eat del_btn");
    userEvent.click(delEl);
    expect(delNode).not.toBeInTheDocument();
});

test('Test Edit', () => {
    const { getByTestId, getByText, getByLabelText } = render(<App tasks={DATA}/>);
    const linkElement = getByTestId(/^All$/i);
    expect(linkElement).toBeInTheDocument();
    expect(getByLabelText("Eat")).toBeInTheDocument();
    userEvent.click(getByTestId("Eat edit_btn"));
    userEvent.type(getByLabelText("New name for Eat"), "Eat More");
    userEvent.click(getByTestId("Eat save_btn"));
    expect(getByLabelText("Eat More")).toBeInTheDocument();
});

test('Test Edit Cancel', () => {
    const { getByTestId, getByText, getByLabelText } = render(<App tasks={DATA}/>);
    const linkElement = getByTestId(/^All$/i);
    expect(linkElement).toBeInTheDocument();
    expect(getByLabelText("Eat")).toBeInTheDocument();
    userEvent.click(getByTestId("Eat edit_btn"));
    userEvent.type(getByLabelText("New name for Eat"), "Eat More");
    userEvent.click(getByTestId("Eat cancel_btn"));
    expect(getByLabelText("Eat")).toBeInTheDocument();
});