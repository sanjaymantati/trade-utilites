import React, {useState, useMemo} from 'react';
import {Card} from "react-bootstrap";
import ProgressBar from 'react-bootstrap/ProgressBar';

function MySortableSearchableTable({data, sector}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState('R Fact'); // Default sort by R Fact
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
                case 'R Fact':
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

    return (
        <div>
            <Card className="mycard m2">
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title as="b" className="mb-0 mycard-header">
                            {sector.name} ({sector.performance > 0 ? '+' : ''}{sector.performance.toFixed(2)}%)


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
                    <ProgressBar>
                        <ProgressBar variant="success" now={50} key={1}/>
                        <ProgressBar variant="danger" now={50} key={2}/>
                    </ProgressBar>
                    <div className="text-muted small">
                        {downCount > 0 && (
                            <span className="text-danger">{downCount} stocks ({downPercentage}% Down)</span>
                        )}
                        {downCount > 0 && upCount > 0 && <>&nbsp;&nbsp;</>}
                        {upCount > 0 && (
                            <span className="text-success">{upCount} stocks ({upPercentage}% Up)</span>
                        )}
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
                                <th onClick={() => handleSort('Pre C')}>
                                    Pre C {sortColumn === 'Pre C' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('%')}>
                                    % {sortColumn === '%' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th onClick={() => handleSort('R Fact')}>
                                    R Fact {sortColumn === 'R Fact' && (sortDirection === 'asc' ? '▲' : '▼')}
                                </th>
                                <th>Signal</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedData.map((item) => (
                                <tr key={item.name}>
                                    <td className="font-weight-bold">{item.name}</td>
                                    <td>{item.pre_market_value}</td>
                                    <td className={item.percentage_changes >= 0 ? 'text-success' : 'text-danger'}>
                                        {item.percentage_changes > 0 ? '+' : ''}{item.percentage_changes}
                                    </td>
                                    <td>{item.factor_value.toFixed(2)}</td>
                                    <td>
                                        {item.breakout?.signal === "BULL" ? (
                                            <span className="badge badge-success">BULL</span>
                                        ) : (
                                            <span className="badge badge-danger">BEAR</span>
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

export default MySortableSearchableTable;
