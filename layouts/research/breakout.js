import React, {useState, useMemo} from 'react';
import {Card} from "react-bootstrap";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Badge from 'react-bootstrap/Badge';

function BreakoutTable({data, type}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState('R'); // Default sort by R Fact
    const [sortDirection, setSortDirection] = useState('desc'); // Default descending


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
                case 'Trend':
                    aValue = a.signal;
                    bValue = b.signal;
                    break;
                case 'Symbol':
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case 'Time':
                    aValue = a.timestamp;
                    bValue = b.timestamp;
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
            <Card>
                <Card.Header className="mycard-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title as="b" className="mb-0 ">
                            {type}
                        </Card.Title>

                        <div className="px-3 py-2">
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
                                <th onClick={() => handleSort('Trend')}>
                                    Trend {sortColumn === 'Trend' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('Symbol')}>
                                    Symbol {sortColumn === 'Symbol' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('%')}>
                                    % {sortColumn === '%' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('R')}>
                                    Factor {sortColumn === 'R' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('Time')}>
                                    Time {sortColumn === 'Time' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th>Sector</th>
                            </tr>
                            </thead>
                            <tbody className="mycard-table-body">
                            {sortedData.map(item =>
                                <tr key={item.name}>
                                    <td className={item.percentage_changes >= 0 ? 'text-success' : 'text-danger'}>
                                        {
                                            item.signal === "BULL" ? (
                                                <Badge bg="success">{item.signal}</Badge>
                                            ) : (
                                                <Badge bg="danger">{item.signal}</Badge>
                                            )
                                        }
                                    </td>
                                    <td className="font-weight-bold">
                                        <a
                                            href={`https://www.tradingview.com/chart/wPoMD3jL/?symbol=NSE%3A${item.name}&interval=5`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <b>{item.name}</b></a>
                                    </td>
                                    <td className={item.percentage_changes >= 0 ? 'text-success' : 'text-danger'}>
                                        {
                                            item.percentage_changes > 0 ? (
                                                <Badge bg="success">{item.percentage_changes} ▲</Badge>
                                            ) : (
                                                <Badge bg="danger">{item.percentage_changes} ▼</Badge>
                                            )
                                        }
                                    </td>
                                    <td>{item.factor_value.toFixed(2)}</td>
                                    <td>
                                        <Badge>{formatTimestampToTime(item.timestamp)}</Badge>
                                    </td>
                                    <td>
                                        {item.sectors.map(sector => <Badge key={`breakout-sector-${sector}`}>{sector}</Badge>)}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default BreakoutTable;
