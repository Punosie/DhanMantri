import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = ({ selectedDate, onChange }) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date) => onChange(date)}
      dateFormat="yyyy-MM-dd"
      placeholderText="Select a date"
    />
  );
};

export default DatePickerComponent;
