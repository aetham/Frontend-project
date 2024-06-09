import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import React from 'react'
import './tablepage.css'

export default function TablePage() {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [sorting, setSorting] = useState({ column: '', direction: 'default' });
    const rowsPerPage = 10;
    const [totalPages, setTotalPages] = useState(0);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch('https://midaiganes.irw.ee/api/list?limit=500')
            .then(response => response.json())
            .then(enrichingData)
            .then((data) => {
                setTableData(data);
                setTotalPages(data.list.length / rowsPerPage);
                setPage(1);
                setLoading(false);
            })
            .catch((error) => console.log(error))
    }, [])

    const calculateBirthday = (item) => {

        const calc = item.personal_code.toString()
        const sex = calc.substring(0, 1);
        const yearLastTwoDigits = calc.substring(1, 3);
        const month = calc.substring(3, 5);
        const day = calc.substring(5, 7);

        let year = '';
        if (['3', '4'].includes(sex)) {
            year = `19${yearLastTwoDigits}`;
        } else if (['5', '6'].includes(sex)) {
            year = `20${yearLastTwoDigits}`;
        }

        const formattedDate = `${year}-${month}-${day}`;
        item.birthday = new Date(formattedDate);
        return item;
    };
    function enrichingData(baseData) {
        const enrichedData = baseData.list.map(calculateBirthday);
        baseData.list = enrichedData;
        return baseData;
    }

    function paginationCalculation() {
        const createdArray = [...Array(totalPages).keys()].map(i => i + 1);
        if (page <= 3) {
            return createdArray.slice(0, 5)
        }
        if (page >= 4 && page < totalPages - 3) {
            return createdArray.slice(page - 3, page + 2);
        }
        if (page >= totalPages - 3) {
            return createdArray.slice(totalPages - 5);
        }
    }
    function sliceData(data) {
        return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    }

    function sortedData() {
        const shadowArray = [...tableData.list]
        const sortingValue = sorting.column

        if (sorting.direction === 'asc') {
            const holder = shadowArray.toSorted((a, b) => a[sortingValue] > b[sortingValue] ? 1 : -1);
            return sliceData(holder)
        }
        if (sorting.direction === 'desc') {
            const holder = shadowArray.toSorted((a, b) => a[sortingValue] > b[sortingValue] ? -1 : 1);
            return sliceData(holder)
        }
        return sliceData(tableData.list)
    }

    const setSpecificPage = (pageNumber) => {
        setPage(pageNumber)
    }

    const handleHeaderClick = (value) => {
        // Incase of sorting the detailed-row should be closed
        setSelectedRow(null);
        switch (sorting.direction) {
            case 'asc':
                setSorting({ column: value, direction: 'desc' });
                break;
            case 'desc':
                setSorting({ column: value, direction: 'default' });
                break;
            default:
                setSorting({ column: value, direction: 'asc' });
                break;
        }
    };
    const handleRowClick = (item) => {
        setSelectedRow(selectedRow === item ? null : item)
    }
    if (!tableData || !tableData.list) {
        if (loading) {
            return <p>...Loading</p>
        }
        return <p>No Data To Show</p>
    }
    return (
        <div className='table-container'>
            <h1>Table</h1>
            <table>
                <thead>
                    <tr>
                        <th> Eesnimi <button onClick={() => handleHeaderClick('firstname')}> click me </button></th>
                        <th> Perekonnaimi <button onClick={() => handleHeaderClick('surname')}> click me </button></th>
                        <th> Sugu <button onClick={() => handleHeaderClick('sex')}> click me </button></th>
                        <th> Sünnipäev <button onClick={() => handleHeaderClick('birthday')}> click me </button></th>
                        <th> Telefon</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData().map((item) => (
                        <React.Fragment key={item.id}>
                            <tr key={item.id} onClick={() => handleRowClick(item.id)}>
                                <td>{item.firstname}</td>
                                <td>{item.surname}</td>
                                <td>{item.sex}</td>
                                <td>{item.birthday.toLocaleDateString()}</td>
                                <td>{item.phone}</td>
                            </tr>
                            {selectedRow === item.id && (
                                <tr className="details-row">
                                    <td colSpan="5" className="accordion">
                                        {item.image.large && <img src={item.image.large} alt="Details" className="details-image" />}
                                        <div dangerouslySetInnerHTML={{ __html: item.body }}></div>
                                        <button><Link to={('/article/' + item.id)}>Read more</Link></button>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => setSpecificPage(page - 1)} disabled={page === 1}>&lt; </button>
                {paginationCalculation().map((pagesnumbers) => (
                    <button className="pagination-button"
                        key={pagesnumbers}
                        onClick={() => setSpecificPage(pagesnumbers)}
                        disabled={page === pagesnumbers}
                    > {pagesnumbers}
                    </button>
                ))}
                <button onClick={() => setSpecificPage(page + 1)} disabled={page === totalPages}>&gt;</button>
            </div>
        </div>
    );
}