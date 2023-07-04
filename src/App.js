import React, { useState, useEffect } from 'react'
import { Box, makeStyles, Typography, Select, MenuItem, } from '@material-ui/core'
import './App.css'
import { Info } from './Info'
import { CountryTable } from './CountryTable'
import { Chart } from './Chart'
import { Map } from './Map'
import "leaflet/dist/leaflet.css";

export const App = () => {

  const classes = makeStyles({
    app: {
      display: 'flex',
      '@media (max-width: 780px)': {
        flexDirection: 'column'
      }
    },
    app__left: {
      flex: '0.75',
      width: '100%',
      padding: '10px',
    },
    app__left__header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      '&>h1': {
        fontWeight: 'bold',
        fontSize: '30px',
        color:"red"
      },
      '& .MuiInputBase-input':{
        background:'white'
      }
    },
    app__left__info: {
      display: 'flex',
      justifyContent: 'space-around',

    },
    app__right: {
      flex: '0.25',
      width: '100%',
      padding: '10px'
    }
  })()

  const [data, setData] = useState([])
  const [selectValue, setSelectValue] = useState('worldWide')
  const [countryData, setCountryData] = useState([])
  const [tableData, setTableData] = useState([])
  const [caseType, setCaseType] = useState('cases')
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    const fetchCounty = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then(res => res.json())
        .then(dat => {
          const countries = dat.map(item => (
            {
              countryName: item.country,
              countryCode: item?.countryInfo?.iso2,
              totalCases: item.cases,
              lat: item.countryInfo.lat,
              long: item.countryInfo.long
            }
          ))
          setTableData(dat)
          setData(countries)
        }
        )
    }
    fetchCounty()
  }, [])

  const handleSelectChange = (e) => {
    setSelectValue(e.target.value)
  }

  useEffect(() => {
    let url = selectValue === 'worldWide' ?
      'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${selectValue}`;
    const fetchCountryData = async () => {
      await fetch(url).then(res => res.json())
        .then(dat => {
          if (selectValue === 'worldWide') {
            setMapCenter({ lat: 34.80746, lng: -40.4796 })
          }
          else {
            setMapCenter({ lat: dat?.countryInfo?.lat, lng: dat?.countryInfo?.long })
            setMapZoom(4)
          }
          setCountryData({
            lat: dat?.countryInfo?.lat,
            long: dat?.countryInfo?.long,
            countryName: dat?.country,
            flag: dat?.countryInfo?.flag,
            todayCases: dat.todayCases,
            todayRecovered: dat.todayRecovered,
            todayDeaths: dat.todayDeaths,
            totalCases: dat.cases,
            totalRecovered: dat.recovered,
            totalDeaths: dat.deaths,
          })
        })
    }
    fetchCountryData()

  }, [selectValue])

  return (
    <Box component='div' className={classes.app}>
      <Box className={classes.app__left}>
        <Box className={classes.app__left__header}>
          <Typography component='h1'>
            COVID-19 TRACKER
        </Typography>
          <Select value={selectValue} onChange={handleSelectChange} variant='outlined'>
            <MenuItem value={'worldWide'}>WorldWide</MenuItem>
            {
              data.map(iter => (
                <MenuItem value={iter.countryCode} key={iter.countryName}>{iter.countryName}</MenuItem>
              ))
            }
          </Select>
        </Box>
        <Box className={classes.app__left__info} >
          <Info
            title='corona virus cases'
            cases={countryData.todayCases}
            total={countryData.totalCases}
            onclick={() => setCaseType('cases')}
            active={caseType==='cases'}
            caseType={caseType}
          />
          <Info
            title='Recovered'
            cases={countryData.todayRecovered}
            total={countryData.totalRecovered}
            onclick={() => setCaseType('recovered')}
            active={caseType==='recovered'}
            caseType={caseType}
          />
          <Info
            title='Deaths'
            cases={countryData.todayDeaths}
            total={countryData.totalDeaths}
            onclick={() => setCaseType('deaths')}
            active={caseType==='deaths'}
            caseType={caseType}
          />
        </Box>
        <Map
          mapData={selectValue === 'worldWide' ? data : [countryData]}
          caseType={caseType}
          center={mapCenter}
          zoom={mapZoom} 
          selectedValue={selectValue}/>
      </Box>

      <Box className={classes.app__right}>
        <CountryTable tableData={tableData} />
        <Chart countryNm={selectValue} caseType={caseType} />
      </Box>
    </Box>
  )
}


// if(selectValue==='worldWide'){
//   setMapCenter({ lat: 34.80746, lng: -40.4796 })
// }
// else{
//   setMapCenter({lat:countryData.lat,lng:countryData.long})
// }