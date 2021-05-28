import React from "react";
import DynamicForm from "../DynamicForm/dynamicForm";
import EventDetails from "./eventDetails";
import "./homepage.css";

const HomePage = () => {
  return (
    <>
      <div className="split left">
        <EventDetails />
      </div>
      <div className="split right">
        <DynamicForm />
      </div>
    </>
  );
};

export default HomePage;
