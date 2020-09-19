
import { FormControl, Select, MenuItem, Card , CardContent } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import InfoBox from "./InfoBox"
import Map from "./Map"
import Table from "./Table"
import {sortData} from './util'
import LineGraph from "./LineGraph"
import "leaflet/dist/leaflet.css"

function App() {

  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({lat: 34.80746 , lng: -40.4796})
  const [mapZoom, setMapZoom]  = useState(3)  
  const [mapCountries, setMapCountries] = useState([])

  useEffect(() =>  {
       fetch ("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      })
  },[])


  useEffect(() => {
    const getCoutnriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //pakistan united kingdom pakistan
            value: country.countryInfo.iso2   // uk USA PK
          }))
          const sortedData = sortData(data)
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries);
          

        })
    }
    getCoutnriesData()
  }, [])


  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log("heyy >>>", countryCode);
    const url = countryCode === "worldwide" ?
    "https://disease.sh/v3/covid-19/all"
    :(`https://disease.sh/v3/covid-19/countries/${countryCode}`)
    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);
        
      // all of the data from the country response
      setCountryInfo(data)
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4)

    })
 
  }

  console.log("heyyy", countryInfo)




  return (
    <div className="app">

      <div className="app__left">

        <div className="app-header">
          This is a Covid-19 Tracker App
        <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country} >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
              {/* <MenuItem value="Pakistan">Pakistan</MenuItem>
            <MenuItem value="Canada">Canada</MenuItem>
            <MenuItem value="Turkey">Turkey</MenuItem>
            <MenuItem value="Germany">Germany</MenuItem> */}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">

          {/* INFO BOX 1 */}
          <InfoBox title="Corona Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          {/* INFO BOX 2 */}
          <InfoBox title="Recoverd" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          {/* INFO BOX 3 */}
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />

        </div>
        <Map countries = {mapCountries} zoom = {mapZoom} center = {mapCenter} />
      </div>  

      <Card className="app_right">
        <CardContent>
          <h3>Live cases by country</h3>
       <Table  countries = {tableData} />
       <h3 className  = "worldwide">Worldwide New Cases</h3>
       <LineGraph  />
        </CardContent>
      </Card>


    </div>
  );
}

export default App;
