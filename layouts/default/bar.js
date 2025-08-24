import React, {useState, useMemo} from 'react';
import {Card} from "react-bootstrap";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Badge from 'react-bootstrap/Badge';

function BarTable({data, sector, color}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState('R'); // Default sort by R Fact
    const [sortDirection, setSortDirection] = useState('desc'); // Default descending

    // Calculate up/down percentages
    const upCount = data.filter(item => parseFloat(item.percentage_changes) >= 0).length;
    const downCount = data.length - upCount;
    const upPercentage = ((upCount / data.length) * 100).toFixed(2);
    const downPercentage = ((downCount / data.length) * 100).toFixed(2);

    const filteredData = useMemo(() => {
        return data.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    const sortedData = useMemo(() => {
        if (!sortColumn) return filteredData;

        return [...filteredData].sort((a, b) => {
            let aValue, bValue;

            // Map column names to data properties
            switch (sortColumn) {
                case 'Symbol':
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case 'Pre C':
                    aValue = a.pre_market_value;
                    bValue = b.pre_market_value;
                    break;
                case '%':
                    aValue = parseFloat(a.percentage_changes);
                    bValue = parseFloat(b.percentage_changes);
                    break;
                case 'R':
                    aValue = parseFloat(a.factor_value);
                    bValue = parseFloat(b.factor_value);
                    break;
                default:
                    aValue = a[sortColumn];
                    bValue = b[sortColumn];
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
        });
    }, [filteredData, sortColumn, sortDirection]);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('desc'); // Default to descending for all columns
        }
    };

    function formatTimestampToTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    return (
        <div>
            <Card className="mycard m2" style={{ backgroundColor: color }}>
                <Card.Header className="mycard-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title as="b" className="mb-0 ">
                            {sector.name.replace("NIFTY ", "")} ({sector.performance > 0 ? '+' : ''}{sector.performance.toFixed(2)}%)


                        </Card.Title>
                        <div className="px-3 py-2">
                            <ProgressBar>
                                <ProgressBar variant="success" now={upPercentage} key={1} label={`${upCount}`}/>
                                <ProgressBar variant="danger" now={downPercentage} key={2} label={`${downCount}`}/>
                            </ProgressBar>

                            <input
                                type="text"
                                placeholder="Search..."
                                className="form-control form-control-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                    </div>
                </Card.Header>

                <Card.Body className="p-0 mycard-body">
                    <div className="table-responsive">
                        <table className="table table-sm table-hover mb-0">
                            <thead className="thead-light">
                            <tr>
                                <th onClick={() => handleSort('Symbol')}>
                                    Symbol {sortColumn === 'Symbol' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('%')}>
                                    % {sortColumn === '%' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('R')}>
                                    R {sortColumn === 'R' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('a')}>
                                    Signal {sortColumn === 'a' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                            </tr>
                            </thead>
                            <tbody className="mycard-table-body">
                            {sortedData.map((item) => (
                                <tr key={item.name}>
                                    <td className="font-weight-bold"><b>{item.name}</b></td>
                                    <td className={item.percentage_changes >= 0 ? 'text-success' : 'text-danger'}>
                                        {
                                            item.percentage_changes > 0 ? (
                                                <Badge bg="success">{item.percentage_changes} ▲</Badge>
                                                // <span className="badge badge-success"></span>
                                            ) : (
                                                <Badge bg="danger">{item.percentage_changes} ▼</Badge>
                                            )
                                        }
                                    </td>
                                    <td>{item.factor_value.toFixed(2)}</td>
                                    <td>
                                        {item.breakout ? (
                                            item.breakout?.signal === "BULL" ? (
                                                <>
                                                    <Badge bg="success">{item.breakout?.factor_value} ▲</Badge>
                                                <Badge>{formatTimestampToTime(item.breakout.timestamp)}</Badge></>
                                            ) : (
                                                <>
                                            <Badge bg="danger">{item.breakout?.factor_value} ▼</Badge>
                                            <Badge>{formatTimestampToTime(item.breakout.timestamp)}</Badge></>
                                            )
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default BarTable;
