import React, {Fragment, useMemo, useState, useEffect} from "react";
import {Button, Col, Container, FloatingLabel, Modal, Row, Tab, Table, Tabs} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import BreakoutTable from '../../layouts/research/breakout';
import IntradayTable from '../../layouts/research/intraday';

const HomePage = () => {
    const [masterData, setMasterData] = useState({});

    useEffect(() => {
        const data = localStorage.getItem("master_data")
        if(data){
            const transformedData = transformData(JSON.parse(data))
            setMasterData(transformedData)
        }
    }, [])


    function transformData(data) {
        const result = {
            breakout: [],
            intraday: []
        };

        data.forEach(sector => {
            const sectorName = sector.name;

            sector.securities.forEach(security => {
                // Process breakout items
                if (security.breakout) {
                    const breakoutItem = {
                        name: security.name,
                        current_value: security.current_value,
                        pre_market_value: security.pre_market_value,
                        percentage_changes: security.percentage_changes,
                        sectors: [sectorName.replace("NIFTY ", "")],
                        factor_value: security.breakout.factor_value,
                        signal: security.breakout.signal,
                        timestamp: security.breakout.timestamp
                    };
                    const data = result.breakout.filter(r => r.name === security.name)
                    if(data.length > 0){
                        data[0].sectors.push(sectorName.replace("NIFTY ", ""));
                    } else {
                        result.breakout.push(breakoutItem);
                    }
                }

                // Process intraday items
                if (security.intraday) {
                    const intradayItem = {
                        name: security.name,
                        current_value: security.current_value,
                        pre_market_value: security.pre_market_value,
                        percentage_changes: security.percentage_changes,
                        sectors: [sectorName.replace("NIFTY ", "")],
                        factor_value: security.intraday.factor_value
                    };
                    const data = result.intraday.filter(r => r.name === security.name)
                    if(data.length > 0){
                        data[0].sectors.push(sectorName.replace("NIFTY ", ""))
                    } else {
                        result.intraday.push(intradayItem);
                    }
                }
            });
        });

        return result;
    }
    const filterSector = (event) => {
        event.preventDefault()
        const selected_sector = event.target.value
        if (selected_sector !== 'All'){
            const data = localStorage.getItem("master_data")
            if(data){
                const filtered_data = JSON.parse(data).filter(datum => datum.name === selected_sector)
                const transformedData = transformData(filtered_data)
                setMasterData(transformedData)
            }
        } else {
            const data = localStorage.getItem("master_data")
            if(data){
                const transformedData = transformData(JSON.parse(data))
                setMasterData(transformedData)
            }
        }
    };

    return (
        <Fragment>
            <Container fluid className="bg-dark pt-2">
                <Row className="mb-2">
                    <Col md={2}>
                    <Form.Select size="sm" onChange={(event) => filterSector(event)}>
                        <option value = "All">All</option>
                        <option value = "NIFTY AUTO">AUTO</option>
                        <option value = "NIFTY 50">NIFTY 50</option>
                        <option value = "NIFTY MID SELECT">MID SELECT</option>
                        <option value = "SENSEX">SENSEX</option>
                        <option value = "NIFTY CEMENT">CEMENT</option>
                        <option value = "NIFTY BANK">BANK</option>
                        <option value = "NIFTY ENERGY">ENERGY</option>
                        <option value = "NIFTY FIN SERVICE">FIN SERVICE</option>
                        <option value = "NIFTY FMCG">FMCG</option>
                        <option value = "NIFTY IT">IT</option>
                        <option value = "NIFTY METAL">METAL</option>
                        <option value = "NIFTY PSU">PSU BANK</option>
                        <option value = "NIFTY PVT BANK">PVT BANK</option>
                        <option value = "NIFTY PHARMA">PHARMA</option>
                        <option value = "NIFTY REALTY">REALTY</option>
                    </Form.Select>
                    </Col>
                </Row>
                <Row className="flex-nowrap overflow-scroll">
                    {masterData.breakout && <Col md={6}>
                        <BreakoutTable type="Breakout" data={masterData.breakout}/>
                    </Col>}
                    {masterData.intraday && <Col md={6}>
                        <IntradayTable type="Intraday" data={masterData.intraday}/>
                    </Col>}
                </Row>

            </Container>
        </Fragment>
    )
}

export default HomePage;
