import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserProvider";
import { Link } from "react-router-dom";

export function BookDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const titleRef = useRef();
  const authorRef = useRef();
  const quantityRef = useRef();
  const locationRef = useRef();

  const [book, setBook] = useState(null);

  async function loadBook() {
    const res = await fetch(`${API_URL}/api/books/${id}`, { credentials: "include" });
    const data = await res.json();
    setBook(data);
    titleRef.current.value = data.title || "";
    authorRef.current.value = data.author || "";
    quantityRef.current.value = data.quantity || 0;
    locationRef.current.value = data.location || "";
  }

  async function onUpdate() {
    const body = {
      title: titleRef.current.value,
      author: authorRef.current.value,
      quantity: parseInt(quantityRef.current.value) || 0,
      location: locationRef.current.value
    };
    await fetch(`${API_URL}/api/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include"
    });
    loadBook();
  }

  async function onDelete() {
    await fetch(`${API_URL}/api/books/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    navigate("/books");
  }

  useEffect(() => {
    loadBook();
  }, []);

  return (
    <div>
      <h2>Book Detail</h2>
      <table>
        <tbody>
          <tr><th>Title</th><td><input type="text" ref={titleRef} disabled={user.role !== "ADMIN"} /></td></tr>
          <tr><th>Author</th><td><input type="text" ref={authorRef} disabled={user.role !== "ADMIN"} /></td></tr>
          <tr><th>Quantity</th><td><input type="number" ref={quantityRef} disabled={user.role !== "ADMIN"} /></td></tr>
          <tr><th>Location</th><td><input type="text" ref={locationRef} disabled={user.role !== "ADMIN"} /></td></tr>
        </tbody>
      </table>
      {user.role === "ADMIN" && (
        <div>
          <button onClick={onUpdate}>Update</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
      <br />
      <Link to="/books">Back</Link>
    </div>
  );
}