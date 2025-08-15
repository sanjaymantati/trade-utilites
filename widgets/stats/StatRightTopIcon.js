// Widget : Stat Style 
// Style : Stat widget with right top icon

// import node module libraries
import PropTypes from 'prop-types';
import {Button, Card, Col, Container, Dropdown, Form, Modal, Nav, Row, Tab, Table, Tabs} from 'react-bootstrap';
import {MoreVertical} from "react-feather";
import React, {Fragment, useState, useEffect} from "react";
import Link from "next/link";
import {changeBucketState, createNewBucket, getOrders, getTradeRevisions} from "../../service/homePageService";
import {SquareOff} from "../../pages";

const BucketActionMenu = (props) => {
    const [scrollShow, setScrollShow] = useState(false);
    const {bucket} = props;
    const [modifyBucketState, setModifyBucketState] = useState('');
    const openChangeBucketStateModal = (state) => {
        setModifyBucketState(state);
        setScrollShow(true);
    }
    const changeBucket = async (event) => {
        event.preventDefault();
        const otp = event.target?.bucketChangeStateMFA?.value;
        const {data, error} = await changeBucketState(bucket.id, modifyBucketState, otp)
        if (data) {
            alert("Bucket state changed successfully.");
            setScrollShow(false);
            props.callback(true);
        }
        if (error) {
            alert(`ERROR: ${error}`);
        }
    }
    const CustomToggle = React.forwardRef(({children, onClick}, ref) => (
        (<Link
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className="text-muted text-primary-hover">
            {children}
        </Link>)
    ));
    return (
        <Fragment>
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                    <MoreVertical size="15px" className="text-muted"/>
                </Dropdown.Toggle>
                <Dropdown.Menu align={'end'}>
                    <Dropdown.Item eventKey="2" onClick={() => openChangeBucketStateModal('activate')}>
                        Activate bucket
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2" onClick={() => openChangeBucketStateModal('park')}>
                        Park bucket
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="1" onClick={() => openChangeBucketStateModal('decommission')}>
                        Decommission bucket
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Modal show={scrollShow} onHide={() => setScrollShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modifyBucketState} bucket: {bucket?.name}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={changeBucket}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="bucketChangeStateMFA">
                            <Form.Label>MFA</Form.Label>
                            <Form.Control type="number" placeholder="XXXXXX"/>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setScrollShow(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Fragment>
    )
        ;
};


const OrderDetailsModal = (props) => {
    const [scrollShow, setScrollShow] = useState(false);

    async function createBucket(event) {
        event.preventDefault();
        const request = {
            name: event.target?.bucketNameForm?.value,
            code: event.target?.bucketCode?.value,
            initialValue: parseInt(event.target?.bucketInitialAmount?.value)
        }
        const {data, error} = await createNewBucket(request);
        if (data) {
            alert("Bucket created successfully.");
            setScrollShow(false);
            props.callback(true);
        }
        if (error) {
            alert(`ERROR: ${error}`);
            props.callback(false);
        }
    }

    return (
        <Fragment>

            {/*  */}

        </Fragment>
    )
}

const OrderCard = props => {
    const {info} = props;
    const [showOrderDetailsModel, setShowOrderDetailsModel] = useState(false);
    const [revisionDetails, setRevisionDetails] = useState(undefined)
    useEffect(() => {
        loadTradeRevision(info.id);
    }, [])

    const loadTradeRevision = async (id) => {
        const {data, error} = await getTradeRevisions(id);
        if (data) {
            setRevisionDetails(JSON.parse(JSON.stringify(data)));
        }
    }

    function getCardBg(status) {
        if (status === 'INITIATED') {
            return "seconds";
        } else if (status === 'PLACED') {
            return "light";
        } else if (status === 'EXECUTED') {
            return "light";
        } else if (status === 'SQUARED_OFF') {
            return "secondary";
        } else if (status === 'SQUARED_OFF_FAILED') {
            return "danger";
        } else if (status === 'FAILED') {
            return "secondary";
        }
    }

    console.log(`revisionDetails::::${revisionDetails}`);
    const cardBg = getCardBg(info.status);
    return (
        <>
            <div>
                <Modal show={showOrderDetailsModel} onHide={() => setShowOrderDetailsModel(false)}
                       size="xl"
                       aria-labelledby="contained-modal-title-vcenter"
                       fullscreen={true}
                       centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Order details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {revisionDetails &&
                            <>
                                <Tabs
                                    defaultActiveKey="details"
                                    id="fill-tab-example"
                                    className="mb-3"
                                    fill>
                                    <Tab eventKey="details" title="Details" class="m-2">
                                        <br/>
                                        <Container fluid>
                                            <Row className="justify-content-md-center">
                                                <Col>
                                                    <h4>Company Details:</h4>
                                                    Company name: {info.company.name}<br/>
                                                    Industry: {info.company.industry}<br/>
                                                    Sector: {info.company.sector ? info.company.sector : '-'}<br/>
                                                    Nse Code: {info.company.nseCode}<br/>
                                                    Market Cap.: {info.company.marketCap / 10000000} Cr.<br/>
                                                    Instrument token: {info.company.instrumentToken}<br/><br/>
                                                </Col>
                                                <Col>
                                                    <h4>Order details:</h4>
                                                    Order
                                                    ID: {revisionDetails['trade']['brokerOrderId'] ? revisionDetails['trade']['brokerOrderId'] : '-'}<br/>
                                                    Quantity: {revisionDetails['trade']['brokerOrder'] ? revisionDetails['trade']['brokerOrder']['quantity'] : '-'}<br/>
                                                    Avg Price: {revisionDetails['trade']['brokerOrder'] ? revisionDetails['trade']['brokerOrder']['avgPrice'] : '-'}<br/>
                                                    Status: {revisionDetails['trade']['brokerOrder'] ? revisionDetails['trade']['brokerOrder']['status'] : '-'}<br/>
                                                    Time: {revisionDetails['trade']['brokerOrder'] ? new Date(revisionDetails['trade']['brokerOrder']['createdDate']).toLocaleString() : '-'}<br/><br/>
                                                </Col>
                                                <Col>
                                                    <h4>Squared OFF Order details:</h4>
                                                    Order
                                                    ID: {revisionDetails['trade']['squaredOffBrokerOrderId'] ? revisionDetails['trade']['squaredOffBrokerOrderId'] : '-'}<br/>
                                                    Quantity: {revisionDetails['trade']['squaredOffBrokerOrder'] ? revisionDetails['trade']['squaredOffBrokerOrder']['quantity'] : '-'}<br/>
                                                    Avg Price: {revisionDetails['trade']['squaredOffBrokerOrder'] ? revisionDetails['trade']['squaredOffBrokerOrder']['avgPrice'] : '-'}<br/>
                                                    Status: {revisionDetails['trade']['squaredOffBrokerOrder'] ? revisionDetails['trade']['squaredOffBrokerOrder']['status'] : '-'}<br/>
                                                    Time: {revisionDetails['trade']['squaredOffBrokerOrder'] ? new Date(revisionDetails['trade']['squaredOffBrokerOrder']['createdDate']).toLocaleString() : '-'}<br/>
                                                </Col>
                                            </Row>
                                        </Container>
                                        <br/>
                                        <Table responsive className="text-nowrap" bordered striped>
                                            <thead>
                                            <tr>
                                                <th scope="col">Time</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Trace</th>
                                                <th scope="col">Order ID</th>
                                                <th scope="col">Square-OFF order ID</th>
                                                <th scope="col">GTT</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <>
                                                {revisionDetails['tradeRevisions'].map((r, index) => {
                                                    return (
                                                        <tr key={`trade-revision-${index}`}>
                                                            <td>{new Date(r.modifiedDate).toLocaleString()}</td>
                                                            <td>{r.status}</td>
                                                            <td>{r.traceId}</td>
                                                            <td>{r.brokerOrderId ? r.brokerOrderId : '-'}</td>
                                                            <td>{r.squaredOffBrokerOrderId ? r.squaredOffBrokerOrderId : '-'}</td>
                                                            <td>{r.brokerGTTOrderId ? r.brokerGTTOrderId : '-'}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </>
                                            </tbody>
                                        </Table>
                                    </Tab>
                                    <Tab eventKey="gtt" title="GTT">
                                        <Container fluid>
                                            <Row className="justify-content-md-center">

                                                <Col>
                                                    <h4>GTT Details:</h4>
                                                    Order
                                                    ID: {revisionDetails['trade']['brokerGTTOrder'] ? revisionDetails['trade']['brokerGTTOrder']['brokerGTTOrderId'] : '-'}<br/>
                                                    SL: {revisionDetails['trade']['brokerGTTOrder'] ? revisionDetails['trade']['brokerGTTOrder']['sl'] : '-'}<br/>
                                                    Target: {revisionDetails['trade']['brokerGTTOrder'] ? revisionDetails['trade']['brokerGTTOrder']['target'] : '-'}<br/>
                                                    Status: {revisionDetails['trade']['brokerGTTOrder'] ? <b>{revisionDetails['trade']['brokerGTTOrder']['status']}</b> : '-'}<br/>
                                                    Trigger Order ID: {revisionDetails['trade']['brokerGTTOrder'] ? (
                                                    revisionDetails['trade']['brokerGTTOrder']['brokerOrderId'] ? revisionDetails['trade']['brokerGTTOrder']['brokerOrderId']['brokerOrderId'] : '-'
                                                ) : '-'}<br/>
                                                    Trigger Time: {revisionDetails['trade']['brokerGTTOrder'] ? (
                                                    revisionDetails['trade']['brokerGTTOrder']['brokerOrderId'] ?  new Date(revisionDetails['trade']['brokerGTTOrder']['brokerOrderId']['createdDate']).toLocaleString() : '-'
                                                ) : '-'}<br/>
                                                    Window strategy: {revisionDetails['trade']['brokerGTTOrder'] ? <b>{revisionDetails['trade']['brokerGTTOrder']['windowStrategy']}</b> : '-'}<br/>
                                                    Time: {revisionDetails['trade']['brokerGTTOrder'] ? new Date(revisionDetails['trade']['brokerGTTOrder']['createdDate']).toLocaleString() : '-'}<br/><br/>
                                                </Col>

                                            </Row>
                                        </Container>
                                        <Table responsive className="text-nowrap" bordered striped>
                                            <thead>
                                            <tr>
                                                <th scope="col">Time</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Trace</th>
                                                <th scope="col">Order ID</th>
                                                <th scope="col">SL</th>
                                                <th scope="col">Target</th>
                                                <th scope="col">Curr Val.</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <>
                                                {revisionDetails && revisionDetails['gttRevisions'] && revisionDetails['gttRevisions'].map((r, index) => {
                                                    return (
                                                        <tr key={`gtt-revision-${index}`}>
                                                            <td>{new Date(r.modifiedDate).toLocaleString()}</td>
                                                            <td>{r.brokerStatus ? r.brokerStatus : '-'}</td>
                                                            <td>{r.traceId}</td>
                                                            <td>{r.brokerOrderId ? r.brokerOrderId.brokerOrderId : '-'}</td>
                                                            <td>{r.sl}</td>
                                                            <td>{r.target}</td>
                                                            <td>{r.currentValue}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </>
                                            </tbody>
                                        </Table>
                                    </Tab>
                                    <Tab eventKey="transactions" title="Broker Order">

                                        {revisionDetails['brokerOrder'] && <>
                                            <h3>Broker Order</h3>
                                            Order ID: {revisionDetails['brokerOrder'].brokerOrderId}<br/>
                                            Status: {revisionDetails['brokerOrder'].status}<br/>
                                            Qty. : {revisionDetails['brokerOrder'].quantity}<br/>
                                            Avg Price: {revisionDetails['brokerOrder'].avgPrice}<br/>
                                            Tag: {revisionDetails['brokerOrder'].tag}<br/>
                                            <br/>
                                            <h4>History</h4>
                                            <Table responsive className="text-nowrap" bordered striped>
                                                <thead>
                                                <tr>
                                                    <th scope="col">Time</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Trace</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <>
                                                    {revisionDetails['brokerOrderRevisions'].map((r, index) => {
                                                        return (
                                                            <tr key={`gtt-revision-${index}`}>
                                                                <td>{new Date(r.modifiedDate).toLocaleString()}</td>
                                                                <td>{r.status ? r.status : '-'}</td>
                                                                <td>{r.traceId}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </>
                                                </tbody>
                                            </Table>
                                        </>}
                                    </Tab>

                                    <Tab eventKey="contact" title="Squared OFF">
                                        {revisionDetails['squaredOffOrder'] && <>
                                            <h3>Broker Order</h3>
                                            Order ID: {revisionDetails['squaredOffOrder'].brokerOrderId}<br/>
                                            Status: {revisionDetails['squaredOffOrder'].status}<br/>
                                            Qty. : {revisionDetails['squaredOffOrder'].quantity}<br/>
                                            Avg Price: {revisionDetails['squaredOffOrder'].avgPrice}<br/>
                                            Tag: {revisionDetails['squaredOffOrder'].tag}<br/>
                                            <br/>
                                            <h4>History</h4>
                                            <Table responsive className="text-nowrap" bordered striped>
                                                <thead>
                                                <tr>
                                                    <th scope="col">Time</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col">Trace</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <>
                                                    {revisionDetails['squaredOffOrderRevisions'].map((r, index) => {
                                                        return (
                                                            <tr key={`gtt-revision-${index}`}>
                                                                <td>{new Date(r.modifiedDate).toLocaleString()}</td>
                                                                <td>{r.status ? r.status : '-'}</td>
                                                                <td>{r.traceId}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </>
                                                </tbody>
                                            </Table>
                                        </>}
                                    </Tab>
                                </Tabs>
                            </>}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowOrderDetailsModel(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <Card style={{width: '18rem'}}>
                <Card.Body>
                    <Card.Title><h4 className="mb-0">{info.company.name} <br/>({info.company.nseCode})</h4></Card.Title>
                    <Card.Text>
                        <h6 className={`fw-bold ${cardBg}`}>Status: {info.status}</h6>
                        <h6 className={`fw-bold ${cardBg}`}>Quantity: {info.quantity}</h6>
                        <h6 className={`fw-bold ${cardBg}`}>Avg. price: {info.brokerOrder ? info.brokerOrder.avgPrice : '-'}</h6>
                        <h6 className={`fw-bold ${cardBg}`}>Squared Off Avg. price: {info.squaredOffBrokerOrder ? info.squaredOffBrokerOrder.avgPrice : '-'}</h6>
                        <h6 className={`fw-bold ${cardBg}`}>Status: {info.status}</h6>
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Button variant="secondary mx-6"
                            onClick={() => setShowOrderDetailsModel(true)}>View</Button>
                    {info.status === 'EXECUTED' && <SquareOff id={info.id}/>}
                </Card.Footer>
            </Card>
        </>
    )
}

// Typechecking With PropTypes
OrderCard.propTypes = {
    info: PropTypes.any.isRequired
};

export default OrderCard
