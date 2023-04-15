import React, { useEffect, useState } from "react";

const FilterOptions = ({
  data,
  filteredData,
  onFilterChange,
  from,
  locations,
}) => {
  const [filters, setFilters] = useState({
    location: { applied: false, value: "" },
    from: { applied: false, value: "" },
  });

  useEffect(() => {
    let filtered = data;
    if (filters.location.applied) {
      filtered = filtered.filter(
        (item) => item["location"] === filters.location.value
      );
    }
    if (filters.from.applied) {
      filtered = filtered.filter((item) => item["from"] === filters.from.value);
    }
    onFilterChange(filtered);
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    let newFilters = filters;
    if (value === "All") {
      newFilters[name] = { applied: false, value: value };
    } else {
      newFilters[name] = { applied: true, value: value };
    }
    setFilters({ ...newFilters });
  };

  return (
    <div className="filter-options">
      <select name="location" onChange={handleFilterChange}>
        {locations.map((location, i) => (
          <option value={location} key={i}>
            {location}
          </option>
        ))}
      </select>
      <select name="from" onChange={handleFilterChange}>
        {from.map((item, i) => (
          <option value={item} key={i}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterOptions;
