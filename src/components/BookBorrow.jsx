import { useEffect, useState, useRef } from "react";
import { useUser } from "../contexts/UserProvider";

export default function BookBorrow() {
  const { user } = useUser();
  const API_URL = import.meta.env.VITE_API_URL;

  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const bookIdRef = useRef();
  const targetDateRef = useRef();

  async function loadBorrows() {
    const res = await fetch(`${API_URL}/api/borrow`, { credentials: "include" });
    const data = await res.json();
    setBorrows(data);
  }

  async function loadBooks() {
    const res = await fetch(`${API_URL}/api/books`, { credentials: "include" });
    const data = await res.json();
    setBooks(data);
  }

  async function onBorrow() {
    await fetch(`${API_URL}/api/borrow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookId: bookIdRef.current.value,
        targetDate: targetDateRef.current.value
      }),
      credentials: "include"
    });
    loadBorrows();
  }

  async function onUpdateStatus(borrowId, status) {
    await fetch(`${API_URL}/api/borrow`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ borrowId, status }),
      credentials: "include"
    });
    loadBorrows();
  }

  useEffect(() => {
    loadBorrows();
    loadBooks();
  }, []);

  return (
    <div>
      <h2>Book Borrowing</h2>

      {user.role === "USER" && (
        <div>
          <h3>New Request</h3>
          <select ref={bookIdRef}>
            {books.map((b) => (
              <option key={b._id} value={b._id}>{b.title}</option>
            ))}
          </select>
          <input type="date" ref={targetDateRef} />
          <button onClick={onBorrow}>Submit Request</button>
        </div>
      )}

      <h3>Requests</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>User</th>
            <th>Created</th>
            <th>Target Date</th>
            <th>Status</th>
            {user.role === "ADMIN" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {borrows.map((b) => (
            <tr key={b._id}>
              <td>{b.bookId}</td>
              <td>{b.userEmail}</td>
              <td>{b.createdAt}</td>
              <td>{b.targetDate}</td>
              <td>{b.status}</td>
              {user.role === "ADMIN" && (
                <td>
                  <select onChange={(e) => onUpdateStatus(b._id, e.target.value)} defaultValue={b.status}>
                    <option value="INIT">INIT</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="CLOSE-NO-AVAILABLE-BOOK">CLOSE-NO-AVAILABLE-BOOK</option>
                    <option value="CANCEL-ADMIN">CANCEL-ADMIN</option>
                    <option value="CANCEL-USER">CANCEL-USER</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}