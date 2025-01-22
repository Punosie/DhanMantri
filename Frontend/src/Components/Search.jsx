import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import nifty50Symbols from "../Utils/stocks";
import { grey, teal } from '@mui/material/colors';

export default function StockSelector({ selectedSymbol, onSymbolChange }) {
  // Handler for when the stock selection changes
  const handleChange = (event, value) => {
    if (value) {
      onSymbolChange(value); // Update the selected symbol in App
    }
  };

  return (
    <Autocomplete
      disablePortal
      options={nifty50Symbols}
      value={selectedSymbol} // Bind the state to the component
      onChange={handleChange}
      getOptionLabel={(option) => option.replace('.NS', '')} // Remove .NS when displaying options
      sx={{
        backgroundColor: grey[900],
        borderRadius: 2,
        '& .MuiInputBase-input': {
          color: "whitesmoke", // Text color for the input
        },
        '& .MuiFormLabel-root': {
          color: "whitesmoke", // Label text color
        },
        '& .MuiFormLabel-root.Mui-focused': {
          color: "whitesmoke", // Label text color when focused
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: grey[700], // Default border color
          },
          '&:hover fieldset': {
            borderColor: teal[500], // Border color on hover
          },
          '&.Mui-focused fieldset': {
            borderColor: teal[300], // Border color on focus
          },
        },
        '& .MuiSvgIcon-root': {
          color: "whitesmoke", // Change color of arrow and clear icon
        },
      }}
      slotProps={{
        popper: {
          sx: {
            '& .MuiAutocomplete-listbox': {
              backgroundColor: grey[900], // Background color for the dropdown
              color: "whitesmoke", // Text color for dropdown items
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField {...params} label="Stock" />
      )}
    />
  );
}
