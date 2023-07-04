import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import { Circle, Popup } from 'react-leaflet';
import numeral from "numeral";

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        rgb: "rgb(204, 16, 52)",
        multiplier: 500,
    },
    recovered: {
        hex: "#7dd71d",
        rgb: "rgb(125, 215, 29)",
        multiplier: 500,
    },
    deaths: {
        hex: "#fb4443",
        rgb: "rgb(251, 68, 67)",
        multiplier: 500,
    },
};

export const showDataOnMap = (mapData, caseType, center, selectedValue) => (
    mapData?.map(iter => (
        <Circle
            key={iter.flag}
            center={selectedValue === 'worldWide' ? [iter.lat, iter.long] : [center.lat, center.lng]}
            color={casesTypeColors[caseType].hex}
            fillColor={casesTypeColors[caseType].hex}
            fillOpacity={0.4}
            radius={
                Math.sqrt(iter['totalCases']) * casesTypeColors[caseType].multiplier
            }

        >
            <Popup minWidth='250' key={iter.countryName}>
                <div>
                    <img src={iter.flag} alt={iter.countryName} />
                </div>
                <h3 style={{ textAlign: 'center', marginTop: '10px' }}>countryName: {iter.countryName}</h3>
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <h4>TotalCases:{numeral(iter.totalCases).format("+0 a")}</h4>
                    <h4>TotalRecovered:{numeral(iter.totalRecovered).format("+0 a")}</h4>
                    <h4>TotalDeaths:{numeral(iter.totalDeaths).format("+0 a")}</h4>
                </div>
            </Popup>
        </Circle>
    ))
)


export const Map = ({ mapData, caseType, center, zoom, selectedValue }) => {


    const classes = makeStyles({
        map: {
            height: '500px',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '20px',
            marginTop: '16px',
            boxShadow: '0 0 8px -4px rgba(0, 0, 0, 0.5)',
            '& .leaflet-container': {
                height: '100%',
                borderRadius: '12px',
            }
        }
    })()

    return (
        <div className={classes.map}>
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataOnMap(mapData, caseType, center, selectedValue)}

            </LeafletMap>
        </div>
    )
}


