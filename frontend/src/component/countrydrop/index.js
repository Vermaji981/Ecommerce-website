import { useMemo, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const countryOptions = [
  "Select",
  "India",
  "Sri Lanka",
  "Pakistan",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Germany",
  "Singapore",
  "South Africa",
];

const CountryDropdown = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("Select");

  const filteredCountries = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return countryOptions;

    return countryOptions.filter((country) => country.toLowerCase().includes(term));
  }, [searchTerm]);

  const handleClose = () => {
    setOpen(false);
    setSearchTerm("");
  };

  const handleSelect = (country) => {
    setSelectedCountry(country);
    handleClose();
  };

  return (
    <div className="country-dropdown-wrapper">
      <button className="countrydrop" onClick={() => setOpen(true)} type="button">
        <div className="info">
          <span className="label">Your Location</span>
          <span className="name">{selectedCountry}</span>
        </div>
        <span className="dropdown-icon">
          <FaAngleDown />
        </span>
      </button>

      <Dialog open={open} onClose={handleClose} className="locationModel" fullWidth maxWidth="sm">
        <DialogTitle>Choose your location</DialogTitle>
        <p className="location-description">Search and select your preferred country or region.</p>
        <button className="close_" onClick={handleClose} type="button" aria-label="Close location dialog">
          <IoClose />
        </button>
        <DialogContent dividers>
          <div className="location-searchbar">
            <input
              type="text"
              placeholder="Search country or region..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <button className="search-icon" type="button" aria-label="Search">
              <FaSearch />
            </button>
          </div>

          {filteredCountries.length > 0 ? (
            <ul className="countrylist">
              {filteredCountries.map((country) => (
                <li key={country}>
                  <button
                    type="button"
                    className={`country-option${selectedCountry === country ? " selected" : ""}`}
                    onClick={() => handleSelect(country)}
                  >
                    {country}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-country-found">No country found for your search.</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog> 
    </div>
  );
};

export default CountryDropdown;