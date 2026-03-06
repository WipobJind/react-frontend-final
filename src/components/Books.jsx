import { useEffect, useState, useRef } from "react";
import { useUser } from "../contexts/UserProvider";
import { Link } from "react-router-dom";

export default function Books() {
  const [books, setBooks] = useState([]);
  const { user } = useUser();
  const API_URL = import.meta.env.VITE_API_URL;

  const titleRef = useRef();
  const authorRef = useRef();

  const titleCreateRef = useRef();
  const authorCreateRef = useRef();
  const quantityCreateRef = useRef();
  const locationCreateRef = useRef();

  async function loadBooks() {
    const title = titleRef.current?.value || "";
    const author = authorRef.current?.value || "";
    let url = `${API_URL}/api/books?title=${title}&author=${author}`;
    const res = await fetch(url, { credentials: "include" });
    const data = await res.json();
    setBooks(data);
  }

  async function onCreateBook() {
    const body = {
      title: titleCreateRef.current.value,
      author: authorCreateRef.current.value,
      quantity: parseInt(quantityCreateRef.current.value) || 0,
      location: locationCreateRef.current.value
    };
    await fetch(`${API_URL}/api/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include"
    });
    titleCreateRef.current.value = "";
    authorCreateRef.current.value = "";
    quantityCreateRef.current.value = "";
    locationCreateRef.current.value = "";
    loadBooks();
  }

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <div>
      <h2>Books</h2>

      <div>
        <input type="text" placeholder="Search title" ref={titleRef} />
        <input type="text" placeholder="Search author" ref={authorRef} />
        <button onClick={loadBooks}>Search</button>
      </div>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Quantity</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.quantity}</td>
              <td>{book.location}</td>
              <td>{book.status}</td>
              <td>
                <Link to={`/books/${book._id}`}>Detail</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {user.role === "ADMIN" && (
        <div>
          <h3>Create Book</h3>
          <input type="text" placeholder="Title" ref={titleCreateRef} /><br />
          <input type="text" placeholder="Author" ref={authorCreateRef} /><br />
          <input type="number" placeholder="Quantity" ref={quantityCreateRef} /><br />
          <input type="text" placeholder="Location" ref={locationCreateRef} /><br />
          <button onClick={onCreateBook}>Create</button>
        </div>
      )}
    </div>
  );
}