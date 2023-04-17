import React, { useState, useEffect } from "react";
import "./Linkedin.css";
import SearchBar from "../../components/SearchBar";
import FilterOptions from "../../components/FilterOptions";
// import WorldMap from "../../components/WorldMap";
import CardLayout from "../../components/CardLayout";

const Linkedin = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [locations, setLocations] = useState(["All"]);
  const [from, setFrom] = useState(["All"]);
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchValue === "" || searchValue) handleSearchChange(searchValue);
  }, [searchValue]);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/data");
      const jsonData = await response.json();
      setData(jsonData);
      const uniqueLocations = [];
      const uniqueFrom = [];
      for (const data of jsonData) {
        if (!uniqueLocations.includes(data.City) && data.City !== "") {
          uniqueLocations.push(data.City);
        }
        if (!uniqueFrom.includes(data.from)) {
          uniqueFrom.push(data.from);
        }
      }
      uniqueLocations.sort();
      uniqueFrom.sort();
      setLocations([...locations, ...uniqueLocations]);
      setFrom([...from, ...uniqueFrom]);
      setFilteredData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearchChange = (value) => {
    filterData(value);
  };

  const filterData = (value) => {
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div className="App">
      <div className="search-filter">
        <SearchBar
          filteredData={filteredData}
          setSearchValue={setSearchValue}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
        />
        <FilterOptions
          data={data}
          filteredData={filteredData}
          locations={locations}
          from={from}
          onFilterChange={(filtered) => setFilteredData(filtered)}
        />
      </div>
      {/* <WorldMap data={filteredData} /> */}
      <CardLayout data={filteredData} />
    </div>
  );
};

export default Linkedin;
