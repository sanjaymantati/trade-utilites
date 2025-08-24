// import node module libraries
import React, {Fragment, useMemo, useState, useEffect} from "react";
import {Button, Col, Container, FloatingLabel, Modal, Row, Tab, Table, Tabs} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import BarTable from '../layouts/default/bar';

const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [masterData, setMasterData] = useState([]);
    const [onlyBreakout, setOnlyBreakout] = useState(false);
    const [showDataModel, setShowDataModel] = useState(false);
    const filteredMasterData = useMemo(() => {
        const filtered_data = masterData.filter(item =>{
            const filtered_security = item.securities.filter(security => security.name.toLowerCase().includes(searchTerm.toLowerCase()))
            return filtered_security.length
        });
        return filtered_data.map(datum => {
            datum.securities = datum.securities.filter(security => {
                let pass = false
                if (searchTerm === '') {
                    if(onlyBreakout){
                        return  security.breakout !==undefined
                    }
                    return  true
                } else if (searchTerm !== '') {
                    if(onlyBreakout){
                        pass= security.breakout !==undefined
                    }
                    pass = security.name.toLowerCase().includes(searchTerm.toLowerCase())
                }
                return pass
            })
            return datum;
        })
    }, [masterData, searchTerm, onlyBreakout]);

    useEffect(() => {
        const data = localStorage.getItem("master_data")
        if(data){
            setMasterData(JSON.parse(data))
        }
    }, [])
    function getHexColor(values, currentValue) {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const t = Math.max(0, Math.min(1, (currentValue - min) / (max - min)));
        const r = Math.round(255 * (1 - t));
        const g = Math.round(128 * t);
        const b = 0;
        return `rgba(${r}, ${g}, ${b}, 0.3)`; // Use alpha for transparency
    }
    function mergeData(sectors, stocks, signals) {
        sectors = sectors['payload']['data']
        stocks = stocks['payload']['data']
        signals = signals['payload']['data']
        return sectors.map(sector => {
            const sectorName = sector.Symbol;
            const performance = sector.param_3;
            let sectorStocksData = Object.entries(stocks[`${sectorName}_r_factor`] || {}).map(([key, value]) => {
                let name = key
                let current_value = value['param_0']
                let pre_market_value = value['param_1']
                let percentage_changes = value['param_2']
                let r_factor = value['param_3']

                return {
                    name,
                    current_value,
                    pre_market_value,
                    percentage_changes,
                    factor_value: r_factor
                }
            });

            sectorStocksData = sectorStocksData.map(stock => {
                const breakout_beacons = signals.breakout_beacon
                const intraday_boost = signals.intraday_boost
                const data = { ...stock }
                const breakout_data = breakout_beacons.filter(p => p.Symbol == stock.name)
                if (breakout_data.length > 0) {
                    data['breakout'] = {
                        signal: breakout_data[0].param_2,
                        factor_value: breakout_data[0].param_1,
                        timestamp: breakout_data[0].param_3
                    }
                }

                const intraday_data = intraday_boost.filter(p => p.Symbol == stock.name)
                if (intraday_data.length > 0) {
                    data['intraday'] = {
                        factor_value: intraday_data[0].param_3
                    }
                }

                return data;

            });

            return {
                name: sectorName,
                performance: performance,
                securities: sectorStocksData
            };
        });
    }
    async function addData(event) {
        event.preventDefault();
        const sector_data = JSON.parse(event.target.sector_data.value);
        const security_data = JSON.parse(event.target.security_data.value);
        const breakout_data = JSON.parse(event.target.breakout_data.value);
        const final_data = mergeData(sector_data, security_data, breakout_data)
        setMasterData(final_data)
        localStorage.setItem("master_data", JSON.stringify(final_data))
        setShowDataModel(false)
    }
    const sector_performance = masterData.map(p => p.performance)
    return (
        <Fragment>
            <Container fluid className="bg-dark pt-2">
                <Form>
                    <Row>
                        <Col md={3} className="mb-2">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="form-control form-control-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Col>
                        <Col md={1} className="mb-2">
                            <Form.Check // prettier-ignore
                                type="switch"
                                id="custom-switch"
                                label="Breakout"
                                onChange={() => setOnlyBreakout(!onlyBreakout)}
                            />
                        </Col>
                        <Col md={2} className="mb-2">
                            <Button variant="primary" onClick={() => setShowDataModel(true)} size="sm">
                                Add Data
                            </Button>
                        </Col>
                    </Row>
                </Form>
                <div>
                    <Modal show={showDataModel} onHide={() => setShowDataModel(false)}
                           size="xl"
                           aria-labelledby="contained-modal-title-vcenter"
                           fullscreen={true}
                           centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Data</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={addData}>
                                <FloatingLabel
                                    controlId="sector_data"
                                    label="Sector data"
                                    className="mb-3">
                                    <Form.Control as="textarea" />
                                </FloatingLabel>
                                <FloatingLabel
                                    controlId="security_data"
                                    label="Security data"
                                    className="mb-3">
                                    <Form.Control as="textarea" required/>
                                </FloatingLabel>
                                <FloatingLabel
                                    controlId="breakout_data"
                                    label="Breakout"
                                    className="mb-3">
                                    <Form.Control as="textarea" required/>
                                </FloatingLabel>
                                <Button variant="primary" type="submit" className="mt-2">
                                    Execute
                                </Button>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowDataModel(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <Row className="flex-nowrap overflow-scroll">


                    {filteredMasterData.map(datum => {

                        return (
                            <>
                                <Col md={3}>
                                    <BarTable sector={datum} data={datum.securities}
                                              color={getHexColor(sector_performance, datum.performance)}/>
                                </Col>
                            </>

                        )
                    })}

                </Row>

            </Container>
        </Fragment>
    )
}

export default HomePage;
