import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const WorldMap = ({ data }) => {
  return (
    <ComposableMap>
      <Geographies geography="/path/to/world-geojson">
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
      {data.map((item, index) => (
        <Marker key={index} coordinates={item.location}>
          {/* Customize marker appearance here */}
        </Marker>
      ))}
    </ComposableMap>
  );
};

export default WorldMap;
