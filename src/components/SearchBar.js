import React, { useEffect, useState } from "react";
import Autosuggest from "react-autosuggest";

const SearchBar = ({
  filteredData,
  setSearchValue,
  suggestions,
  setSuggestions,
}) => {
  const [value, setValue] = useState("");
  const escapeRegexCharacters = (str) =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  useEffect(() => {
    if (value === "") {
      setSearchValue("");
    }
  }, [value]);

  const getSuggestions = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === "") {
      return [];
    }

    const regex = new RegExp("^" + escapedValue, "i");
    const suggestions = [
      ...filteredData.filter((obj) => regex.test(obj.company)),
      ...filteredData.filter((obj) => regex.test(obj.name)),
    ];

    if (suggestions.length === 0) {
      return [{ isAddNew: true }];
    }

    return suggestions;
  };

  const onChange = (event, { newValue, method }) => {
    setValue(newValue);
  };

  const getSuggestionValue = (suggestion) => {
    if (suggestion.isAddNew) {
      return value;
    }
    return suggestion.name;
  };

  const renderSuggestion = (suggestion) => {
    if (suggestion.isAddNew) {
      return <span>No such result found!</span>;
    }
    return suggestion.name;
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    if (!suggestion.name) return;
    setSearchValue(suggestion.name);
  };

  const inputProps = {
    placeholder: "Search by name...",
    value,
    onChange,
  };

  return (
    <div className="search-bar">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        onSuggestionSelected={onSuggestionSelected}
        inputProps={inputProps}
      />
    </div>
  );
};

export default SearchBar;
