

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Form, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookTable.css'; 

const BookTable = () => {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage, setBooksPerPage] = useState(10);
    const [authorQuery, setAuthorQuery] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://openlibrary.org/subjects/science_fiction.json?limit=100');
            const works = response.data.works.map(work => ({
                ...work,
                author_name: work.authors ? work.authors.map(author => author.name).join(', ') : 'Unknown'
            }));
            setBooks(works);
            setFilteredBooks(works);
        } catch (error) {
            console.error("Error fetching data", error);
        }
        setLoading(false);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedBooks = React.useMemo(() => {
        let sortableBooks = [...filteredBooks];
        if (sortConfig !== null) {
            sortableBooks.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableBooks;
    }, [filteredBooks, sortConfig]);

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const handleBooksPerPageChange = (event) => setBooksPerPage(Number(event.target.value));
    const handleSearchChange = (event) => {
        setAuthorQuery(event.target.value);
        filterBooksByAuthor(event.target.value);
    };

    const filterBooksByAuthor = (query) => {
        const filtered = books.filter(book => book.author_name.toLowerCase().includes(query.toLowerCase()));
        setFilteredBooks(filtered);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h2 className="text-center mb-4 stylish-heading">Book Records</h2>
                </Col>
            </Row>
            <Row className="justify-content-center mt-3">
                <Col md="6">
                    <Form.Group controlId="authorSearch" className="text-center stylish-form">
                        <Row className="align-items-center">
                            <Col xs="auto">
                                <Form.Label className="mb-0">Search by Author</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="text"
                                    value={authorQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Enter author name"
                                    className="stylish-input"
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </Col>
                <Col md="6" className="text-right">
                    <Form.Group controlId="booksPerPageSelect" className="text-center stylish-form">
                        <Row className="align-items-center justify-content-end">
                            <Col xs="auto">
                                <Form.Label className="mb-0">Books Per Page</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control
                                    as="select"
                                    value={booksPerPage}
                                    onChange={handleBooksPerPageChange}
                                    className="stylish-input"
                                >
                                    <option value={10}>10</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </Form.Control>
                            </Col>
                        </Row>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Table striped bordered hover responsive className="book-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('title')}>Title</th>
                                <th onClick={() => handleSort('author_name')}>Author</th>
                                <th onClick={() => handleSort('first_publish_year')}>First Publish Year</th>
                                <th onClick={() => handleSort('subject')}>Subject</th>
                                <th onClick={() => handleSort('ratings_average')}>Ratings Average</th>
                                <th onClick={() => handleSort('author_birth_date')}>Author Birth Date</th>
                                <th onClick={() => handleSort('author_top_work')}>Author Top Work</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBooks.map(book => (
                                <tr key={book.key}>
                                    <td>{book.title}</td>
                                    <td>{book.author_name}</td>
                                    <td>{book.first_publish_year || 'N/A'}</td>
                                    <td>{book.subject ? book.subject.join(', ') : 'N/A'}</td>
                                    <td>{book.ratings_average || 'N/A'}</td>
                                    <td>{book.author_birth_date || 'N/A'}</td>
                                    <td>{book.author_top_work || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Pagination className="justify-content-center">
                        {Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }, (_, index) => (
                            <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </Col>
            </Row>
        </Container>
    );
};

export default BookTable;
